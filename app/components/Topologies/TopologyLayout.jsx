import AccordianWrapper from '../Shared/ExpandCollapse/AccordianWrapper'
import MetricsLayout from '../Graphs/MetricsLayout'
import React, { useState, useEffect, useContext } from 'react'
import TopologyMenuOptions from './TopologyMenuOptions'
import TopolgyRegisterationLayout from './TopolgyRegisterationLayout'

import { AppBarContext } from '../Base/Home'
import { CircularProgress, Typography } from '@material-ui/core'
import { getNumberOfRecordsProcessed } from '../../actions/MetricsActions'
import { getTopologyById } from '../../actions/TopologyActions'
import { isEmpty } from 'lodash'
import { useInterval } from '../../helper/useInterval'
import { useSnackbar } from 'notistack'

const MAX_POLL_COUNT = 5

export default function TopologyLayout ({ id }) {
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)
  const [topologyData, setTopologyData] = useState({})
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [fetchMetrics, setFetchMetrics] = useState(false)
  const [metricsData, setMetricsData] = useState([])
  const [finsihedCount, setFinishedCount] = useState(0)

  useEffect(() => {
    async function getTopologyData (id) {
      const res = await getTopologyById({ topologyId: id }).catch(() => { enqueueSnackbar('Something went wrong while fetching topology details.', { variant: 'error' }) })
      if (!isEmpty(res)) {
        setTopologyData(res)
        setAppTitle({ text: `TOPOLOGY: ${res.topologyId}`, currentPage: 'TopologyLayout' })
        setFetchMetrics(true)
      }
    }
    getTopologyData(id)
  }, [])

  const isTopologyStatusInactive = () => {
    // const inactiveStatus = ['TO_START', 'FINISHED', 'EDITED', 'STOPPED', 'ERROR', 'RUN_ERROR', 'INVALID']
    const inactiveStatus = ['FINISHED']
    return inactiveStatus.indexOf(topologyData.topologyStatus) !== -1
  }

  const shouldPollContinue = () => {
    if (isEmpty(topologyData)) return false
    const topologyInactive = isTopologyStatusInactive()

    if (topologyInactive) {
      setFinishedCount(finsihedCount + 1)
      if (finsihedCount > MAX_POLL_COUNT) setAutoRefresh(false)
    } else setFinishedCount(0)

    return (finsihedCount < MAX_POLL_COUNT)
  }

  useInterval(async () => {
    if (!shouldPollContinue()) return

    const { topologyId } = topologyData
    const latestStatus = await getTopologyById({ topologyId }).catch(() => { enqueueSnackbar('Something went wrong while fetching topology details.', { variant: 'error' }) })
    if (!isEmpty(latestStatus)) {
      if (latestStatus.topologyStatus !== topologyData.topologyStatus) enqueueSnackbar(`Topology Status changed from ${topologyData.topologyStatus} to ${latestStatus.topologyStatus || '...'}.`, { variant: 'info' })
      setTopologyData(latestStatus)
      setFetchMetrics(true)
    }
  }, autoRefresh ? 2000 : null)

  useEffect(() => {
    if (!isEmpty(topologyData)) enqueueSnackbar(`Topology status auto refresh turned ${autoRefresh ? 'on' : 'off'}`, { variant: 'success' })
    if (autoRefresh) setFinishedCount(0)
  }, [autoRefresh])

  useEffect(() => {
    if (fetchMetrics) {
      getProcessedRecordsNumber(topologyData)
      setFetchMetrics(false)
    }
  }, [fetchMetrics])

  async function getProcessedRecordsNumber (topologyData) {
    if (!fetchMetrics) return
    if ((topologyData.topologyStatus === 'FINISHED') && topologyData.topologyItems) {
      const allPipelineIDs = topologyData.topologyItems.map(p => ({ pipelineId: p.pipelineId, instanceId: p.instanceId }))
      const allPipelinesMetrics = allPipelineIDs.map(i => getNumberOfRecordsProcessed({ pipelineId: i.pipelineId, instanceId: i.instanceId }))
      const finalRes = await Promise.all(allPipelinesMetrics)
      setFetchMetrics(false)
      const updatedData = allPipelineIDs.map((pipelineId, index) => ({ name: pipelineId, res: finalRes[index] }))
      setMetricsData(updatedData)
    }
  }

  if (isEmpty(topologyData)) {
    return (
      <div>
        <CircularProgress />
        <Typography>Loading topology</Typography>
      </div>
    )
  }

  return (
    <div>
      <TopologyMenuOptions
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        topologyData={topologyData}
      />

      <TopolgyRegisterationLayout
        propsName={topologyData.topologyId}
        propsSelectedPipelines={topologyData.topologyItems}
        propsTopologyData={topologyData}
        setAutoRefresh={(val) => setAutoRefresh(!!val)}
        renderMetrics={() => {
          return (
            <AccordianWrapper
              title='View Metrics'
              renderChildrend={() => {
                return (
                  <div className='padding-top-30'>
                    <MetricsLayout
                      topologyPipelinesData={topologyData.topologyItems}
                      metricsData={metricsData}
                    />
                  </div>
                )
              }}
            />
          )
        }}
      />
    </div>
  )
}
