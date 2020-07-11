import React, { useState, useEffect } from 'react'
import SortableTree from 'react-sortable-tree'
import TextField from '@material-ui/core/TextField'
import 'react-sortable-tree/style.css'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import PipelinesForTopology from './PipelinesForTopology'
import { getPipelines } from '../actions/PipelineActions'
import DoneIcon from '@material-ui/icons/Done'

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
      onClick={(e) => handlePipelineClick(true, p)}
    />
  )
}

export default function TopolgyRegisterationLayout () {
  const [name, setName] = useState('') // name in input for topology name
  const [treeData, setTreeData] = useState([]) // tree data (each pipeline is a node, rendered in <chip />)
  const [allPipelines, availablePipelines] = useState([]) // all pipelines in env, to be shown as available while adding pipelines to topology
  const [selectedPipelines, addPipelinesToTopology] = useState([]) // pipelines which are selected to be added to this topology
  const [openDialog, setOpenDialog] = useState(false) // open Add Pipelines To Topology Dialog
  const [openConfigDialog, setOpenConfigDialog] = useState(false) // Open Dialog to manage time dependency & threshold for each pipeline in treeData
  const [selectedPipeline, setSelectedPipeline] = useState(null) // to save in state, which pipeline chip was clicked
  const [threshold, setThreshold] = useState(0)
  const [timeLimit, setTimeLimit] = useState(0)

  useEffect(() => {
    async function fetchPipelines () {
      const res = await getPipelines()
      availablePipelines(res)
    }
    fetchPipelines()
  }, [])

  useEffect(() => {
    updatePipelinesConfigInTree()
  }, [timeLimit, threshold])

  const updatePipelinesConfigInTree = () => {
    selectedPipelines.forEach(itemNode => {
      if (itemNode.pipelineId === selectedPipeline.pipelineId) {
        itemNode.timeLimit = timeLimit
        itemNode.threshold = threshold
      }
    })
  }

  const handlePipelineClick = (val, pipeline) => {
    setThreshold((selectedPipelines.find(i => i.pipelineId === pipeline.pipelineId).threshold) || 0)
    setTimeLimit((selectedPipelines.find(i => i.pipelineId === pipeline.pipelineId).timeLimit) || 0)
    setOpenConfigDialog(val)
    setSelectedPipeline(pipeline)
  }

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

  return (
    <div>
      <Chip variant='outlined' size='medium' label='NEW TOPOLOGY' className='margin-bottom-15' />

      <form noValidate autoComplete='off' onSubmit={val => console.log(val)}>

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
          setTimeLimit={setTimeLimit}
          timeLimit={timeLimit}
        />

        <ButtonSubmit handleSubmit={() => console.log(name)} />
      </form>

    </div>
  )
}

const CreateTree = ({ treeData, setTreeData }) => {
  if (!treeData || !treeData.length) return <Chip variant='outlined' size='medium' label='NO PIPELINE SELECTED YET' className='margin-bottom-15' />
  return (
    <div style={{ height: 500 }}>
      <SortableTree
        treeData={treeData}
        getNodeKey={({ node }) => { return node.pipelineId }}
        onChange={treeData => { console.log(treeData); setTreeData(treeData) }}
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

const RenderPipelineConfigs = ({ open, setOpen, pipeline, setSelectedPipeline, threshold, setThreshold, timeLimit, setTimeLimit }) => {
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
            label='Retry threshold limit.'
          />
          <TextField
            id='pipeline_time_dependency'
            value={timeLimit}
            type='number'
            onChange={e => setTimeLimit(e.target.value)}
            variant='outlined'
            style={{ marginBottom: '15px' }}
            label='Time dependency.'
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
