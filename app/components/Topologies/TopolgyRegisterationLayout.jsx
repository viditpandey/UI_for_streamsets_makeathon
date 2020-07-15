import AccordionSummary from '@material-ui/core/AccordionSummary'
import AddPipelines from './AddPipelineToTopology'
import Collapse from '@material-ui/core/Collapse'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SettingsIcon from '@material-ui/icons/Settings'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import React, { useState, useEffect, useContext } from 'react'
import RenderPipelineConfigs from './RenderPipelineConfigs'
import SortableTree, { walk } from 'react-sortable-tree'
import TopologyName from './TopologyName'
import TopologyActionButton from './TopologyActionButton'

import { AppBarContext } from '../Base/Home'
import { cloneDeep, isEmpty } from 'lodash'
import {
  createTopology, startTopology,
  stopTopology, validateTopology,
  pauseTopology, resetTopology
} from '../../actions/TopologyActions'
import { getPipelines } from '../../actions/PipelineActions'
import { listToTree } from '../../helper/tree_util_functions'
import { withStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'

import 'react-sortable-tree/style.css'

const BorderLinearProgress = ({ loaderBackground, backgroundColor }) => withStyles((theme) => ({
  root: {
    borderRadius: 10
  },
  colorPrimary: {
    backgroundColor: loaderBackground
  },
  bar: {
    borderRadius: 5,
    backgroundColor: backgroundColor || '#1a90ff'
  }
}))(LinearProgress)

// const PIPELINE_STATUS = ['STARTING', 'RETRY', , 'RUNNING', 'FINISHED', 'EDITED', 'STOPPED']

const getStyleByPipelineStatus = {
  STARTING: { background: '#a9cae8' }, // light-blue
  RETRY: { background: '#f2dede' }, // red
  RUNNING: { background: '#dff0d8' }, // light green
  FINISHED: { background: '#b3d6a5' }, // slightly darker than light green
  EDITED: { background: '#dedede' }, // grey
  STOPPED: { background: '#f2dede' }, // red
  ERROR: { background: '#f2dede' }, // red
  RUN_ERROR: { background: '#f2dede' }, // red
  INVALID: { background: '#f2dede' }, // red
  VALID: { background: '#dff0d8' }, // light green,
  VALIDATING: { background: '#a9cae8' }, // light-blue
  undefined: { background: '#dedede' } // grey
}

const loaderColorByPipelineStatus = {
  STARTING: { background: '#509ade' }, // light-blue
  // RETRY: { background: '#f7a6a6' }, // red
  RUNNING: { background: '#b3d6a5' }, // light green
  // FINISHED: { background: '#709c5f' }, // slightly darker than light green
  // EDITED: { background: '#b5b5b5' }, // grey
  // STOPPED: { background: '#f7a6a6' }, // red
  // ERROR: { background: '#f7a6a6' }, // red
  // RUN_ERROR: { background: '#f7a6a6' }, // red
  // INVALID: { background: '#f7a6a6' }, // red
  // VALID: { background: '#dff0d8' }, // light green,
  VALIDATING: { background: '#509ade' } // light-blue
  // undefined: { background: '#b5b5b5' } // grey
}

const PIPELINES_IN_PROGRESS = ['STARTING', 'RUNNING', 'VALIDATING']

const renderNode = ({ p, handlePipelineClick }) => {
  const CustomProgressBar = PIPELINES_IN_PROGRESS.indexOf(p.status) !== -1 ? BorderLinearProgress({
    loaderBackground: loaderColorByPipelineStatus[p.status].background,
    backgroundColor: getStyleByPipelineStatus[p.status].background
  }) : () => null
  const chipLabel = (
    <div>{p.title || p.pipelineId} ({p.status || '...'})
      <div style={{ margin: '0 10px' }}>
        {<CustomProgressBar />}
      </div>
    </div>)
  return (
    <Chip
      id={p.pipelineId}
      style={getStyleByPipelineStatus[p.status]}
      deleteIcon={<SettingsIcon />}
      size='medium'
      label={chipLabel}
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

export default function TopolgyRegisterationLayout ({ propsTopologyData = {}, propsName = '', propsSelectedPipelines = [] }) {
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)

  const [topologyData, setTopologyData] = useState(propsTopologyData)
  const [viewMode, setPageViewOrEditMode] = useState(!!propsName)
  const [name, setName] = useState(propsName) // name in input for topology name
  const [treeData, setTreeData] = useState([]) // tree data (each pipeline is a node, rendered in <chip />)
  const [selectedPipelines, addPipelinesToTopology] = useState(propsSelectedPipelines) // pipelines which are selected to be added to this topology
  const [allPipelines, availablePipelines] = useState([]) // all pipelines in env, to be shown as available while adding pipelines to topology
  const [openDialog, setOpenDialog] = useState(false) // open Add Pipelines To Topology Dialog
  const [openConfigDialog, setOpenConfigDialog] = useState(false) // Open Dialog to manage time dependency & threshold for each pipeline in treeData
  const [selectedPipeline, setSelectedPipeline] = useState({}) // to save in state, which pipeline chip was clicked
  const [threshold, setThreshold] = useState(0)
  const [dependencyCriteria, setDependencyCriteria] = useState('stop')
  const [waitTime, setWaitTime] = useState(0)
  const [finalTreeData, setFinalTreeData] = useState([])

  const formTreeData = nodeInfo => {
    let dependsOn = 'root'
    if (nodeInfo.parentNode && nodeInfo.parentNode.pipelineId) dependsOn = nodeInfo.parentNode.pipelineId
    const pipelineInfo = selectedPipelines.find(p => p.pipelineId === nodeInfo.node.pipelineId)
    const { pipelineId, waitTime, threshold, dependencyCriteria } = pipelineInfo
    finalTreeData.push({
      topologyId: name,
      pipelineId: pipelineId,
      waitTime: Number(waitTime || 0),
      threshold: Number(threshold || 0),
      dependencyCriteria: dependsOn === 'root' ? 'stop' : (dependencyCriteria || 'stop'),
      createdBy: 'From UI',
      dependsOn
    })
    setFinalTreeData(finalTreeData)
  }

  const createTopologyButtonAction = () => {
    if (!isFormValid()) enqueueSnackbar('Name or Selected Pipelines cannot be empty.', { variant: 'error' })
    else {
      walk({
        treeData,
        getNodeKey: (node) => node.pipelineId,
        ignoreCollapsed: false,
        callback: (nodeInfo) => formTreeData(nodeInfo)
      })
      console.log('This is sent to backend: ', finalTreeData)

      createTopology({ finalTreeData })
      enqueueSnackbar('Topology created succesfully', { variant: 'success' })
    }
  }

  useEffect(() => {
    !viewMode && setAppTitle({ text: 'NEW TOPOLOGY' })

    async function fetchPipelines () {
      const res = await getPipelines()
      availablePipelines(res)
    }
    fetchPipelines()
  }, [])

  useEffect(() => { updatePipelinesConfigInTree() }, [waitTime, threshold, dependencyCriteria])

  const isFormValid = () => {
    const isValidName = name && name.length
    const isValidSelectedPipelines = !isEmpty(selectedPipelines)
    return (isValidName && isValidSelectedPipelines)
  }

  useEffect(() => {
    const data = getTreeCompatibleData({ list: selectedPipelines, handlePipelineClick })
    setTreeData(data)
  }, [openDialog])

  useEffect(() => {
    setName(propsName)
    addPipelinesToTopology(cloneDeep(propsSelectedPipelines))
    setTopologyData(cloneDeep(propsTopologyData))
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
        itemNode.dependencyCriteria = dependencyCriteria
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

  const hideToggleForRootNode = () => {
    return treeData.map(p => p.pipelineId).indexOf(selectedPipeline.pipelineId) !== -1
  }

  return (
    <Paper>
      <div style={{ padding: '15px' }}>

        <form noValidate autoComplete='off'>
          <Grid container spacing={3}>

            <Grid item xs={12} md={7}><TopologyName disabled={viewMode} name={name} setName={setName} /></Grid>

            <Grid item md={5} xs={12}>
              <div className='float-right'>
                <TopologyActionButton
                  status={!viewMode && 'EMPTY'}
                  topology={topologyData}
                  createTopology={createTopologyButtonAction}
                  startTopology={() => startTopology({ topologyId: name })}
                  stopTopology={() => stopTopology({ topologyId: name })}
                  validateTopology={() => validateTopology({ topologyId: name })}
                  resetTopology={() => resetTopology({ topologyId: name })}
                  pauseTopology={() => pauseTopology(name)}
                />
              </div>
            </Grid>
          </Grid>
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
            selectedPipelines={selectedPipelines}
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
            hideToggle={hideToggleForRootNode()}
          />

        </form>
      </div>
    </Paper>
  )
}

const CreateTree = ({ treeData, setTreeData, setFinalTreeData, selectedPipelines }) => {
  if (!treeData || !treeData.length) return <Chip variant='outlined' size='medium' label='NO PIPELINE SELECTED YET' className='margin-bottom-15' />
  const height = (selectedPipelines.length * 70) || 100
  const [open, setOpen] = useState(true)
  return (
    <div>
      <Paper>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={() => setOpen(!open)}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          Configure your pipelines dependency:
        </AccordionSummary>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <Divider />
          <div className='graph-area-style' style={{ height: height }}>
            <SortableTree
              treeData={treeData}
              getNodeKey={({ node }) => { return node.pipelineId }}
              onChange={treeData => { setTreeData(treeData); setFinalTreeData([]) }}
            />
          </div>
        </Collapse>
      </Paper>
    </div>
  )
}
