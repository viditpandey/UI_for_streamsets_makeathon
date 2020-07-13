import AddPipelines from './AddPipelineToTopology'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import SettingsIcon from '@material-ui/icons/Settings'
import Grid from '@material-ui/core/Grid'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import React, { useState, useEffect } from 'react'
import RenderPipelineConfigs from './RenderPipelineConfigs'
import SaveIcon from '@material-ui/icons/Save'
import SortableTree, { walk } from 'react-sortable-tree'
import StopIcon from '@material-ui/icons/Stop'
import TopologyName from './TopologyName'

import { cloneDeep, isEmpty } from 'lodash'
import { createTopology, startTopology, stopTopology } from '../../actions/TopologyActions'
import { getPipelines } from '../../actions/PipelineActions'
import { listToTree } from '../../helper/tree_util_functions'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import 'react-sortable-tree/style.css'

const renderNode = ({ p, handlePipelineClick }) => {
  return (
    <Chip
      id={p.pipelineId}
      variant='outlined'
      color='primary'
      deleteIcon={<SettingsIcon />}
      size='small'
      label={p.title || p.pipelineId}
      onDelete={(e) => handlePipelineClick(true, p)}
      onClick={(e) => handlePipelineClick(true, p)}
    />
  )
}

const getTreeCompatibleData = ({ list, handlePipelineClick }) => {
  return list.map(p => {
    return {
      ...cloneDeep(p),
      title: renderNode({ p, handlePipelineClick }),
      pipelineId: p.pipelineId,
      expanded: true,
      children: []
    }
  })
}

export default function TopolgyRegisterationLayout ({ setAppTitle = () => {}, propsName = '', propsSelectedPipelines = [] }) {
  const { enqueueSnackbar } = useSnackbar()

  const history = useHistory()
  const [viewMode, setPageViewOrEditMode] = useState(!!propsName)
  const [name, setName] = useState(propsName) // name in input for topology name
  const [treeData, setTreeData] = useState([]) // tree data (each pipeline is a node, rendered in <chip />)
  const [selectedPipelines, addPipelinesToTopology] = useState(propsSelectedPipelines) // pipelines which are selected to be added to this topology
  const [allPipelines, availablePipelines] = useState([]) // all pipelines in env, to be shown as available while adding pipelines to topology
  const [openDialog, setOpenDialog] = useState(false) // open Add Pipelines To Topology Dialog
  const [openConfigDialog, setOpenConfigDialog] = useState(false) // Open Dialog to manage time dependency & threshold for each pipeline in treeData
  const [selectedPipeline, setSelectedPipeline] = useState(null) // to save in state, which pipeline chip was clicked
  const [threshold, setThreshold] = useState(0)
  const [dependencyCriteria, setDependencyCriteria] = useState('stop')
  const [waitTime, setWaitTime] = useState(0)
  const [finalTreeData, setFinalTreeData] = useState([])
  const [canSubmit, toggleCanSubmit] = useState(false)

  const formTreeData = nodeInfo => {
    let dependsOn = 'root'
    if (nodeInfo.parentNode && nodeInfo.parentNode.pipelineId) dependsOn = nodeInfo.parentNode.pipelineId
    const pipelineInfo = selectedPipelines.find(p => p.pipelineId === nodeInfo.node.pipelineId)
    const { pipelineId, waitTime, threshold } = pipelineInfo
    finalTreeData.push({
      topologyId: name,
      pipelineId: pipelineId,
      waitTime: Number(waitTime || 0),
      threshold: Number(threshold || 0),
      createdBy: 'From UI',
      dependsOn
    })
    setFinalTreeData(finalTreeData)
  }

  const saveTopology = (
    <ButtonSubmit
      hideButton={viewMode}
      disabled={!canSubmit}
      handleSubmit={() => {
        walk({
          treeData,
          getNodeKey: (node) => node.pipelineId,
          ignoreCollapsed: false,
          callback: (nodeInfo) => formTreeData(nodeInfo)
        })
        console.log('This is sent to backend: ', finalTreeData)

        createTopology({ finalTreeData })
        enqueueSnackbar('Topology created succesfully', { variant: 'success' })
        history.push('/topologies')
      }}
    />)

  useEffect(() => {
    !viewMode && setAppTitle({ text: 'NEW TOPOLOGY', button: saveTopology })

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
    const isValidName = name && name.length
    const isValidSelectedPipelines = !isEmpty(selectedPipelines)
    if (isValidName && isValidSelectedPipelines) toggleCanSubmit(true)
    else toggleCanSubmit(false)
  }, [name, selectedPipelines])

  useEffect(() => {
    const data = getTreeCompatibleData({ list: selectedPipelines, handlePipelineClick })
    setTreeData(data)
  }, [openDialog])

  useEffect(() => {
    setName(propsName)
    const t = cloneDeep(propsSelectedPipelines)
    // t.forEach(p => {
    //   const matchingPipeline = allPipelines.find(item => item.pipelineId === p.pipelineId)
    //   p.title = matchingPipeline && matchingPipeline.title
    // })
    addPipelinesToTopology(t)
    setPageViewOrEditMode(!!propsName)
  }, [propsName, propsSelectedPipelines])

  useEffect(() => {
    const filteredPipelinesNotInTopology = cloneDeep(allPipelines)
    selectedPipelines.forEach(p => {
      const matchingPipeline = allPipelines.findIndex(item => item.pipelineId === p.pipelineId)
      if (matchingPipeline !== -1) {
        filteredPipelinesNotInTopology.splice(matchingPipeline)
      }
    })
    availablePipelines(filteredPipelinesNotInTopology)
  }, [selectedPipelines])

  useEffect(() => {
    const test = getTreeCompatibleData({ list: selectedPipelines, handlePipelineClick })
    setTreeData(listToTree(test))
  }, [selectedPipelines])

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
    setDependencyCriteria((selectedPipelines.find(i => i.pipelineId === pipeline.pipelineId).dependencyCriteria) || 'stop')
    setOpenConfigDialog(val)
    setSelectedPipeline(pipeline)
  }

  return (
    <div>
      <Grid container spacing={3}>

        <Grid item xs={8}>
          {viewMode &&
            <StartStopTopology
              name={name}
              viewMode={viewMode}
            />}
          <form noValidate autoComplete='off'>

            <TopologyName disabled={viewMode} name={name} setName={setName} />
            <br />

            <AddPipelines
              disabled={viewMode}
              open={openDialog}
              setOpen={setOpenDialog}
              left={allPipelines}
              setLeft={availablePipelines}
              right={selectedPipelines}
              setRight={addPipelinesToTopology}
              buttonText={`${selectedPipelines.length}/${allPipelines.length + selectedPipelines.length} pipelines selected`}
            />
            <br />

            <CreateTree
              treeData={treeData}
              setTreeData={viewMode ? () => { enqueueSnackbar('Editing the topology not allowed.', { variant: 'info' }) } : setTreeData}
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
              dependencyCriteria={dependencyCriteria}
              setDependencyCriteria={setDependencyCriteria}
              disabled={viewMode}
            />

          </form>
        </Grid>
      </Grid>
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

const ButtonSubmit = ({ handleSubmit, disabled, hideButton }) => {
  if (hideButton) return null
  return (
    <Button
      variant='contained'
      color='primary'
      disabled={disabled}
      size='small'
      onClick={(e) => { handleSubmit() }}
      startIcon={<SaveIcon />}
    >
        CREATE TOPOLOGY
    </Button>
  )
}

const StartStopTopology = ({ name, viewMode }) => {
  return (
    <div>
      {/* <Grid item xs={4}> */}
      <Button
        variant='contained'
        color='primary'
        disabled={viewMode}
        size='small'
        onClick={(e) => {
          console.log('name', name)
          startTopology(name)
        }}
        startIcon={<PlayCircleFilledIcon />}
      >
        START TOPOLOGY
      </Button>
      <div className='margin-bottom-15' />
      {/* </Grid>
      <Grid item xs={4}> */}
      <Button
        variant='contained'
        color='primary'
        disabled={viewMode}
        size='small'
        onClick={(e) => {
          stopTopology(name)
        }}
        startIcon={<StopIcon />}
      >
        STOP TOPOLOGY
      </Button>
      <div className='margin-bottom-15' />

      {/* </Grid> */}
    </div>
  )
}
