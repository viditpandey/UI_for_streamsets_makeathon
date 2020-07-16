import AccordianWrapper from '../Shared/ExpandCollapse/AccordianWrapper'
import MetricsLayout from '../Graphs/DataProcessRateGraph'
import React, { useState, useEffect, useContext } from 'react'
import Switch from '@material-ui/core/Switch'
import TopolgyRegisterationLayout from './TopolgyRegisterationLayout'

import { AppBarContext } from '../Base/Home'
import { getNumberOfRecordsProcessed } from '../../actions/MetricsActions'
import { getTopologyById } from '../../actions/TopologyActions'
import { isEmpty } from 'lodash'
import { Typography } from '@material-ui/core'
import { useInterval } from '../../helper/useInterval'
import { useSnackbar } from 'notistack'

// const MAX_POLL_COUNT = 50

export default function TopologyLayout ({ id }) {
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)
  const [topologyData, setTopologyData] = useState({})
  const [autoRefresh, setAutoRefresh] = useState(true)
  // const [shouldPoll, setPolling] = useState(false)
  // const [pollCount, setPollCount] = useState(0)
  const [fetchMetrics, setFetchMetrics] = useState(false)
  const [metricsData, setMetricsData] = useState([])

  useEffect(() => {
    async function getTopologyData (id) {
      const res = await getTopologyById({ topologyId: id })
      setTopologyData(res)
      setAppTitle({ text: `TOPOLOGY: ${res.topologyId}` })
      // res && setPolling(true)
      res && setFetchMetrics(true)
    }
    getTopologyData(id)
  }, [])

  const shouldPollContinue = () => {
    return autoRefresh
    // if (autoRefresh) return true
    // // const inactiveStatus = ['TO_START', 'FINISHED', 'EDITED', 'STOPPED', 'ERROR', 'RUN_ERROR', 'INVALID']
    // const inactiveStatus = ['FINISHED']
    // const topologyInactive = inactiveStatus.indexOf(topologyData.topologyStatus) !== -1
    // if (topologyInactive) {
    //   return true
    //   // setPollCount(pollCount + 1)
    //   // if (pollCount > MAX_POLL_COUNT) return false
    //   // else return true
    // }
    // return true
  }

  useInterval(async () => {
    if (!shouldPollContinue()) return
    const { topologyId } = topologyData
    const latestStatus = await getTopologyById({ topologyId })
    if (!isEmpty(latestStatus)) {
      if (latestStatus.topologyStatus !== topologyData.topologyStatus) enqueueSnackbar(`Topology Status changed from ${topologyData.topologyStatus} to ${latestStatus.topologyStatus || '...'}.`, { variant: 'info' })
      setTopologyData(latestStatus)
      setFetchMetrics(true)
    }
    // else setPolling(false)
    // if (sameStatus >= MAX_POLL_COUNT) { setPolling(false); setSameStatus(1) }
  }, autoRefresh ? 2000 : null)

  useEffect(() => {
    if (fetchMetrics) { console.log('this is not called'); getProcessedRecordsNumber(topologyData) }
  }, [fetchMetrics])

  async function getProcessedRecordsNumber (topologyData) {
    if (!fetchMetrics) return
    if ((topologyData.topologyStatus === 'FINISHED') && topologyData.topologyItems) {
      const allPipelineIDs = topologyData.topologyItems.map(p => p.pipelineId)
      const finalRes = await Promise.all(allPipelineIDs.map(i => getNumberOfRecordsProcessed({ pipelineId: i })))
      if (!isEmpty(finalRes)) setFetchMetrics(false)
      const updatedData = allPipelineIDs.map((pipelineId, index) => ({ name: pipelineId, res: finalRes[index] }))
      setMetricsData(updatedData)
    }
  }

  return (
    <div>
      <Typography>{'Auto refresh topology status'}
        <Switch
          checked={autoRefresh}
          onChange={e => {
            enqueueSnackbar(`Topology status auto refresh turned ${!autoRefresh ? 'on' : 'off'}`, { variant: 'success' })
            setAutoRefresh(!autoRefresh)
          }}
          name='topologyAutoRefreshStatus'
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      </Typography>

      <TopolgyRegisterationLayout
        propsName={topologyData.topologyId}
        propsSelectedPipelines={topologyData.topologyItems}
        propsTopologyData={topologyData}
        // setPollCount={setPollCount}
        renderMetrics={() => {
          return (
            <AccordianWrapper
              title='View Metrics'
              renderChildrend={() => {
                return (
                  <div className='padding-top-30'>
                    <MetricsLayout
                      topologyData={topologyData.topologyItems}
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
