import AccordianWrapper from '../Shared/ExpandCollapse/AccordianWrapper'
import AddPipelines from './AddPipelineToTopology'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
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
  pauseTopology
} from '../../actions/TopologyActions'
import { getAvailablePipelines } from '../../actions/PipelineActions'
import { listToTree, getTreeCompatibleData } from '../../helper/tree_util_functions'
import { useSnackbar } from 'notistack'

import 'react-sortable-tree/style.css'

export default function TopolgyRegisterationLayout ({
  propsTopologyData = {}, propsName = '',
  propsSelectedPipelines = [], renderMetrics = () => {},
  setAutoRefresh = () => {}, hideActionButtons = false,
  startEndTime
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
  const [processAfter, setProcessAfter] = useState('stop')
  const [waitTime, setWaitTime] = useState(0)
  const [finalTreeData, setFinalTreeData] = useState([])
  const [statusToIgnore, setStatusToIgnore] = useState(null)

  const formTreeData = nodeInfo => {
    let dependsOn = 'root'
    if (nodeInfo.parentNode && nodeInfo.parentNode.pipelineId) dependsOn = nodeInfo.parentNode.pipelineId
    const pipelineInfo = selectedPipelines.find(p => (p.pipelineId === nodeInfo.node.pipelineId && p.instanceId === nodeInfo.node.instanceId)) || {}
    const { pipelineId, waitTime, threshold, processAfter, instanceId } = pipelineInfo

    finalTreeData.push({
      instanceId,
      topologyId: name,
      pipelineId: pipelineId,
      waitTime: Number(waitTime || 0),
      threshold: Number(threshold || 0),
      processAfter: dependsOn === 'root' ? 'stop' : (processAfter || 'stop'),
      createdBy: 'From UI',
      dependsOn
    })

    setFinalTreeData(finalTreeData)
  }

  const createTopologyButtonAction = () => {
    if (!isFormValid()) enqueueSnackbar('Topology Name or Selected Pipelines cannot be empty.', { variant: 'error' })
    else {
      walk({
        treeData,
        getNodeKey: (node) => node.pipelineId,
        ignoreCollapsed: false,
        callback: (nodeInfo) => formTreeData(nodeInfo)
      })
      console.log('This is sent to backend: ', finalTreeData)

      createTopology({ finalTreeData })
        .then(() => { enqueueSnackbar('Topology created succesfully', { variant: 'success' }) })
        .catch(() => { enqueueSnackbar('Error while creating topology, please refresh and retry.', { variant: 'error' }) })
    }
  }

  useEffect(() => {
    !viewMode && setAppTitle({ text: 'NEW TOPOLOGY', currentPage: 'TopolgyRegisterationLayout' })

    async function fetchPipelines () {
      const res = await getAvailablePipelines()
      const sorted = sortBy(res, ['title', 'pipelineTitle', 'pipelineId'])
      availablePipelines(sorted)
    }
    fetchPipelines()
  }, [])

  useEffect(() => { updatePipelinesConfigInTree() }, [waitTime, threshold, processAfter])

  const isFormValid = () => {
    const isValidName = name && name.length && !/\s/.test(name)
    const isValidSelectedPipelines = !isEmpty(selectedPipelines)
    return (isValidName && isValidSelectedPipelines)
  }

  useEffect(() => {
    const data = getTreeCompatibleData({ list: selectedPipelines, topologyStatus: topologyData.topologyStatus, handlePipelineClick })
    setTreeData(data)
  }, [openDialog])

  useEffect(() => {
    const cloneTopologyData = cloneDeep(propsTopologyData)
    setName(propsName)
    const sorted = sortBy(cloneDeep(propsSelectedPipelines), ['title', 'pipelineTitle', 'pipelineId'])
    addPipelinesToTopology(sorted)
    setPageViewOrEditMode(!!propsName)
    if (statusToIgnore && statusToIgnore === cloneTopologyData.topologyStatus) cloneTopologyData.topologyStatus = topologyData.topologyStatus
    else !statusToIgnore && setStatusToIgnore(null)
    setTopologyData(cloneTopologyData)
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
        itemNode.processAfter = processAfter
      }
    })
  }

  const handlePipelineClick = (val, pipeline) => {
    setThreshold((selectedPipelines.find(i => i.pipelineId === pipeline.pipelineId).threshold) || 0)
    setWaitTime((selectedPipelines.find(i => i.pipelineId === pipeline.pipelineId).waitTime) || 0)
    setProcessAfter((selectedPipelines.find(i => i.pipelineId === pipeline.pipelineId).processAfter) || 'stop')
    setOpenConfigDialog(val)
    setSelectedPipeline(pipeline)
  }

  const hideToggleForRootNode = () => {
    if (!selectedPipeline) return false
    return treeData.map(p => p.pipelineId).indexOf(selectedPipeline.pipelineId) !== -1
  }

  const handleButtonClick = (type) => {
    let callToAction = () => {}
    const updatedTopology = cloneDeep(topologyData)
    const prevTopologyStatus = topologyData.topologyStatus
    let callToActionParams = { topologyId: name }
    switch (type) {
      case 'startTopology':
        updatedTopology.topologyStatus = 'STARTING'
        enqueueSnackbar('Topology Start.', { variant: 'success' })
        callToAction = startTopology
        break

      case 'resumeTopology':
        updatedTopology.topologyStatus = 'RESUMING'
        enqueueSnackbar('Topology Resume.', { variant: 'success' })
        callToAction = resumeTopology
        break

      case 'stopTopology':
        callToActionParams = topologyData
        updatedTopology.topologyStatus = 'STOPPING'
        enqueueSnackbar('Topology Stop.', { variant: 'success' })
        callToAction = stopTopology
        break

      case 'validateTopology':
        updatedTopology.topologyStatus = 'VALIDATING'
        enqueueSnackbar('Topology Validate.', { variant: 'info' })
        callToAction = validateTopology
        break

      case 'pauseTopology':
        updatedTopology.topologyStatus = 'PAUSING'
        callToActionParams = topologyData
        enqueueSnackbar('Topology Pause.', { variant: 'info' })
        callToAction = pauseTopology
        break

      default:
        break
    }
    setStatusToIgnore(prevTopologyStatus)
    setTopologyData(updatedTopology)
    setAutoRefresh(true)
    callToAction(callToActionParams)
      .then(res => { })
      .catch(() => { enqueueSnackbar(`Something went wrong while ${type}`, { variant: 'error' }) })
  }

  return (
    <Paper>
      <div style={{ padding: '15px' }}>

        <form noValidate autoComplete='off'>
          <Grid container justify='center' spacing={3} alignItems='center'>

            <Grid id='topology-name' item xs={12} md={7}>
              <TopologyName
                disabled={viewMode}
                name={name}
                topologyStatus={topologyData.topologyStatus}
                setName={setName}
              />
            </Grid>

            <Grid id='topology-action-buttons' item md={5} xs={12}>
              <div>
                <TopologyActionButton
                  startEndTime={startEndTime}
                  hideActionButtons={hideActionButtons}
                  status={!viewMode && 'EMPTY'}
                  topology={topologyData}
                  createTopology={createTopologyButtonAction}
                  startTopology={() => handleButtonClick('startTopology')}
                  resumeTopology={() => handleButtonClick('resumeTopology')}
                  stopTopology={() => handleButtonClick('stopTopology')}
                  validateTopology={() => handleButtonClick('validateTopology')}
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
            left={sortBy(allPipelines, ['title', 'pipelineId', 'instanceId'])}
            setLeft={availablePipelines}
            right={sortBy(selectedPipelines, ['title', 'pipelineId', 'instanceId'])}
            setRight={addPipelinesToTopology}
            buttonText={`${selectedPipelines.length} pipelines selected`}
          />
          <br />
          <div id='topology-tree'>
            <CreateTree
              treeData={treeData}
              setTreeData={viewMode ? () => { enqueueSnackbar('Editing the topology not allowed.', { variant: 'info' }) } : setTreeData}
              setFinalTreeData={setFinalTreeData}
              selectedPipelines={selectedPipelines}
              setOpen={setOpenConfigDialog}
            />
          </div>
          <br />
          <div id='topology-metrics'>
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
            processAfter={processAfter}
            setProcessAfter={setProcessAfter}
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
                getNodeKey={({ node }) => { return `${node.pipelineId}_${node.instanceId}` }}
                onChange={treeData => { setTreeData(treeData); setFinalTreeData([]) }}
              />
            </div>)
        }}
      />
    </div>
  )
}
