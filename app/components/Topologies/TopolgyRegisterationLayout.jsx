import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
// import CircularProgress from '@material-ui/core/CircularProgress'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DoneIcon from '@material-ui/icons/Done'
// import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import PipelinesForTopology from './PipelinesForTopology'
import React, { useState, useEffect } from 'react'
import SaveIcon from '@material-ui/icons/Save'
import SortableTree, { walk } from 'react-sortable-tree'
import TextField from '@material-ui/core/TextField'

import { getPipelines } from '../../actions/PipelineActions'
import { useHistory } from 'react-router-dom'
// import { walk } from '../helper/tree_util_functions'

import 'react-sortable-tree/style.css'

const renderNode = ({ p, handlePipelineClick }) => {
  return (
    <Chip
      id={p.pipelineId}
      variant='outlined'
      color='primary'
      icon={<DoneIcon />}
      size='small'
      label={p.title}
      onDelete={() => {}}
      // deleteIcon={<HourglassEmptyIcon />}
      onClick={(e) => handlePipelineClick(true, p)}
    />
  )
}

export default function TopolgyRegisterationLayout () {
  const history = useHistory()
  const [name, setName] = useState('') // name in input for topology name
  const [treeData, setTreeData] = useState([]) // tree data (each pipeline is a node, rendered in <chip />)
  const [allPipelines, availablePipelines] = useState([]) // all pipelines in env, to be shown as available while adding pipelines to topology
  const [selectedPipelines, addPipelinesToTopology] = useState([]) // pipelines which are selected to be added to this topology
  const [openDialog, setOpenDialog] = useState(false) // open Add Pipelines To Topology Dialog
  const [openConfigDialog, setOpenConfigDialog] = useState(false) // Open Dialog to manage time dependency & threshold for each pipeline in treeData
  const [selectedPipeline, setSelectedPipeline] = useState(null) // to save in state, which pipeline chip was clicked
  const [threshold, setThreshold] = useState(0)
  const [waitTime, setWaitTime] = useState(0)
  const [finalTreeData, setFinalTreeData] = useState([])

  useEffect(() => {
    async function fetchPipelines () {
      const res = await getPipelines()
      availablePipelines(res)
    }
    fetchPipelines()
  }, [])

  useEffect(() => {
    updatePipelinesConfigInTree()
  }, [waitTime, threshold])

  useEffect(() => {
    setTreeData(selectedPipelines.map(p => {
      return {
        title: renderNode({ p, handlePipelineClick }),
        pipelineId: p.pipelineId,
        expanded: true,
        children: []
      }
    }))
  }, [openDialog])

  const updatePipelinesConfigInTree = () => {
    selectedPipelines.forEach(itemNode => {
      if (itemNode.pipelineId === selectedPipeline.pipelineId) {
        itemNode.waitTime = waitTime
        itemNode.threshold = threshold
      }
    })
  }

  const handlePipelineClick = (val, pipeline) => {
    setThreshold((selectedPipelines.find(i => i.pipelineId === pipeline.pipelineId).threshold) || 0)
    setWaitTime((selectedPipelines.find(i => i.pipelineId === pipeline.pipelineId).waitTime) || 0)
    setOpenConfigDialog(val)
    setSelectedPipeline(pipeline)
  }

  const formTreeData = nodeInfo => {
    let dependsOn = 'root'
    if (nodeInfo.parentNode && nodeInfo.parentNode.pipelineId) dependsOn = nodeInfo.parentNode.pipelineId
    const pipelineInfo = selectedPipelines.find(p => p.pipelineId === nodeInfo.node.pipelineId)
    const { pipelineId, waitTime, threshold } = pipelineInfo
    finalTreeData.push({
      pipelineId: pipelineId,
      waitTime: waitTime,
      threshold: threshold,
      dependsOn
    })
    setFinalTreeData(finalTreeData)
  }

  return (
    <div>
      <Chip variant='outlined' size='medium' label='NEW TOPOLOGY' className='margin-bottom-15' />

      <form noValidate autoComplete='off'>

        <Name name={name} setName={setName} />
        <br />

        <AddPipelines
          open={openDialog}
          setOpen={setOpenDialog}
          left={allPipelines}
          setLeft={availablePipelines}
          right={selectedPipelines}
          setRight={addPipelinesToTopology}
        />
        <br />

        <CreateTree
          treeData={treeData}
          setTreeData={setTreeData}
          setFinalTreeData={setFinalTreeData}
          setOpen={setOpenConfigDialog}
        />
        <br />

        <RenderPipelineConfigs
          pipeline={selectedPipeline}
          setSelectedPipeline={setSelectedPipeline}
          open={openConfigDialog}
          setOpen={setOpenConfigDialog}
          setThreshold={setThreshold}
          threshold={threshold}
          setWaitTime={setWaitTime}
          waitTime={waitTime}
        />

        <ButtonSubmit handleSubmit={() => {
          walk({
            treeData,
            getNodeKey: (node) => node.pipelineId,
            ignoreCollapsed: false,
            callback: (nodeInfo) => formTreeData(nodeInfo)
          })
          console.log('This is sent to backend: ', finalTreeData)
          history.push('/topologies')
        }}
        />
      </form>

    </div>
  )
}

const CreateTree = ({ treeData, setTreeData, setFinalTreeData }) => {
  if (!treeData || !treeData.length) return <Chip variant='outlined' size='medium' label='NO PIPELINE SELECTED YET' className='margin-bottom-15' />
  return (
    <div style={{ height: 500 }}>
      <SortableTree
        treeData={treeData}
        getNodeKey={({ node }) => { return node.pipelineId }}
        onChange={treeData => { setTreeData(treeData); setFinalTreeData([]) }}
      />
    </div>
  )
}

const AddPipelines = ({ left, setLeft, right, setRight, open, setOpen }) => {
  return (
    <div>
      <Button
        variant='contained'
        color='primary'
        size='small'
        onClick={(e) => { setOpen(true) }}
        startIcon={<AddCircleIcon />}
      >
        Add Pipelines to this topology
      </Button>
      <Dialog
        open={open}
        // onClose={() => setOpen(false)}
        scroll='body'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
      >
        <DialogTitle id='scroll-dialog-title'>Select Pipelines</DialogTitle>
        <DialogContent />
        <PipelinesForTopology
          left={left}
          setLeft={setLeft}
          right={right}
          setRight={setRight}
        />
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} color='primary'>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const ButtonSubmit = ({ handleSubmit }) => {
  return (
    <Button
      variant='contained'
      color='primary'
      size='small'
      onClick={(e) => { handleSubmit() }}
      startIcon={<SaveIcon />}
    >
        CREATE TOPOLOGY
    </Button>
  )
}

const Name = ({ name, setName }) => {
  return (
    <TextField
      id='topology_name'
      value={name}
      onChange={e => setName(e.target.value)}
      //   autoFocus
      variant='outlined'
      style={{ marginBottom: '15px' }}
      label='Topology Name'
    />
  )
}

const RenderPipelineConfigs = ({ open, setOpen, pipeline, setSelectedPipeline, threshold, setThreshold, waitTime, setWaitTime }) => {
  let titleDialog = 'No pipeline Selected'
  if (pipeline) titleDialog = `Pipeline: ${pipeline.title}`
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setSelectedPipeline(null)}
        scroll='body'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
      >
        <DialogTitle id='scroll-dialog-title'>{titleDialog}</DialogTitle>
        <DialogContent>
          <TextField
            id='pipeline_threshold'
            value={threshold}
            type='number'
            onChange={e => setThreshold(e.target.value)}
            variant='outlined'
            style={{ marginBottom: '15px' }}
            label='Retry threshold limit (# times).'
          />
          <TextField
            id='pipeline_time_dependency'
            value={waitTime}
            type='number'
            onChange={e => setWaitTime(e.target.value)}
            variant='outlined'
            style={{ marginBottom: '15px' }}
            label='Time dependency (seconds).'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} color='primary'>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
