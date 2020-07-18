import AccordianWrapper from '../Shared/ExpandCollapse/AccordianWrapper'
import AddPipelines from './AddPipelineToTopology'
import Chip from '@material-ui/core/Chip'
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
import { cloneDeep, isEmpty, sortBy } from 'lodash'
import {
  createTopology, startTopology, resumeTopology,
  stopTopology, validateTopology,
  pauseTopology, resetTopology
} from '../../actions/TopologyActions'
import { getPipelines } from '../../actions/PipelineActions'
import { HEX_CODES, getStyleByPipelineStatus } from '../../configs/constants'
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
    backgroundColor: backgroundColor || HEX_CODES.grey
  }
}))(LinearProgress)

// const PIPELINE_STATUS = ['STARTING', 'RETRY', , 'RUNNING', 'FINISHED', 'EDITED', 'STOPPED']

const loaderColorByPipelineStatus = {
  STARTING: { background: HEX_CODES.blueVariant1 },
  RUNNING: { background: HEX_CODES.greenVariant1 },
  VALIDATING: { background: HEX_CODES.blueVariant1 }
}

const PIPELINES_IN_PROGRESS = ['STARTING', 'RUNNING', 'VALIDATING', 'PAUSING']

const renderNode = ({ p, topologyStatus, handlePipelineClick }) => {
  let statusLabel = p.pipelineStatus || 'TO_START'
  if (topologyStatus === 'PAUSED') statusLabel = 'PAUSED'
  const CustomProgressBar = PIPELINES_IN_PROGRESS.indexOf(statusLabel) !== -1 ? BorderLinearProgress({
    loaderBackground: loaderColorByPipelineStatus[statusLabel].background,
    backgroundColor: getStyleByPipelineStatus[statusLabel].background
  }) : () => null
  const chipLabel = (

    <div>{p.title || p.pipelineTitle || p.pipelineId} ({statusLabel})
      <div style={{ margin: '0 10px' }}>
        {<CustomProgressBar />}
      </div>
    </div>)
  return (
    <Chip
      id={p.pipelineId}
      style={getStyleByPipelineStatus[statusLabel]}
      deleteIcon={<SettingsIcon />}
      size='medium'
      label={chipLabel}
      onDelete={(e) => handlePipelineClick(true, p)}
      onClick={(e) => handlePipelineClick(true, p)}
    />
  )
}

const getTreeCompatibleData = ({ list, topologyStatus, handlePipelineClick }) => {
  return list.map(p => {
    return {
      ...cloneDeep(p),
      title: renderNode({ p, topologyStatus, handlePipelineClick }),
      pipelineId: p.pipelineId,
      expanded: true,
      children: []
    }
  })
}

export default function TopolgyRegisterationLayout ({
  propsTopologyData = {}, propsName = '',
  propsSelectedPipelines = [], renderMetrics = () => {},
  setAutoRefresh = () => {}
}) {
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
      const sorted = sortBy(res, ['title', 'pipelineTitle', 'pipelineId'])
      availablePipelines(sorted)
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
    const data = getTreeCompatibleData({ list: selectedPipelines, topologyStatus: topologyData.topologyStatus, handlePipelineClick })
    setTreeData(data)
  }, [openDialog])

  useEffect(() => {
    setName(propsName)
    const sorted = sortBy(cloneDeep(propsSelectedPipelines), ['title', 'pipelineTitle', 'pipelineId'])
    addPipelinesToTopology(sorted)
    setTopologyData(cloneDeep(propsTopologyData))
    setPageViewOrEditMode(!!propsName)
  }, [propsName, propsSelectedPipelines])

  useEffect(() => {
    if (isEmpty(allPipelines)) return
    const allPipelinesCloned = cloneDeep(allPipelines)
    const SelectedPipelineIDs = selectedPipelines.map(i => i.pipelineId)
    const filteredPipelinesNotInTopology = allPipelinesCloned.filter(i => SelectedPipelineIDs.indexOf(i.pipelineId) === -1)
    const sorted = sortBy(filteredPipelinesNotInTopology, ['title', 'pipelineTitle', 'pipelineId'])
    availablePipelines(sorted)
  }, [selectedPipelines])

  useEffect(() => {
    const test = getTreeCompatibleData({ list: selectedPipelines, topologyStatus: topologyData.topologyStatus, handlePipelineClick })
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

  const handleButtonClick = (type) => {
    let callToAction = () => {}
    const updatedTopology = cloneDeep(topologyData)
    let callToActionParams = { topologyId: name }
    switch (type) {
      case 'startTopology':
        updatedTopology.topologyStatus = 'STARTING'
        setTopologyData(updatedTopology)
        enqueueSnackbar('Topology Start.', { variant: 'success' })
        callToAction = startTopology
        break

      case 'resumeTopology':
        enqueueSnackbar('Topology Resume.', { variant: 'success' })
        callToAction = resumeTopology
        break

      case 'stopTopology':
        callToActionParams = topologyData
        enqueueSnackbar('Topology Stop.', { variant: 'success' })
        callToAction = stopTopology
        break

      case 'validateTopology':
        enqueueSnackbar('Topology Validate.', { variant: 'info' })
        callToAction = validateTopology
        break

      case 'resetTopology':
        enqueueSnackbar('Topology Reset Status.', { variant: 'success' })
        callToAction = resetTopology
        break

      case 'pauseTopology':
        callToActionParams = topologyData
        enqueueSnackbar('Topology Pause.', { variant: 'info' })
        callToAction = pauseTopology
        break

      default:
        break
    }
    setTopologyData(updatedTopology)
    setAutoRefresh(true)
    callToAction(callToActionParams)
  }

  return (
    <Paper>
      <div style={{ padding: '15px' }}>

        <form noValidate autoComplete='off'>
          <Grid container justify='center' spacing={3} alignItems='center'>

            <Grid item xs={12} md={7}>
              <TopologyName
                disabled={viewMode}
                name={name}
                topologyStatus={topologyData.topologyStatus}
                setName={setName}
              />
            </Grid>

            <Grid item md={5} xs={12}>
              <div>
                <TopologyActionButton
                  status={!viewMode && 'EMPTY'}
                  topology={topologyData}
                  createTopology={createTopologyButtonAction}
                  startTopology={() => handleButtonClick('startTopology')}
                  resumeTopology={() => handleButtonClick('resumeTopology')}
                  stopTopology={() => handleButtonClick('stopTopology')}
                  validateTopology={() => handleButtonClick('validateTopology')}
                  resetTopology={() => handleButtonClick('resetTopology')}
                  pauseTopology={() => handleButtonClick('pauseTopology')}
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
            // left={allPipelines}
            setLeft={availablePipelines}
            right={selectedPipelines}
            // right={selectedPipelines}
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
          <div>
            {renderMetrics(topologyData)}
          </div>

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
  return (
    <div>
      <AccordianWrapper
        title='Configure your pipelines dependency:'
        defaultExpanded
        renderChildrend={() => {
          return (
            <div className='graph-area-style padding-top-30' style={{ height: height }}>
              <SortableTree
                treeData={treeData}
                getNodeKey={({ node }) => { return node.pipelineId }}
                onChange={treeData => { setTreeData(treeData); setFinalTreeData([]) }}
              />
            </div>)
        }}
      />
    </div>
  )
}
