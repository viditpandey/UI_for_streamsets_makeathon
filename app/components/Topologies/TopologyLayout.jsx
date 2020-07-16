import AccordianWrapper from '../Shared/ExpandCollapse/AccordianWrapper'
import MetricsLayout from '../Graphs/DataProcessRateGraph'
import React, { useState, useEffect, useContext } from 'react'
import TopolgyRegisterationLayout from './TopolgyRegisterationLayout'

import { AppBarContext } from '../Base/Home'
import { getNumberOfRecordsProcessed } from '../../actions/MetricsActions'
import { getTopologyById } from '../../actions/TopologyActions'
import { isEmpty } from 'lodash'
import { useInterval } from '../../helper/useInterval'
import { useSnackbar } from 'notistack'
// const MAX_POLL_COUNT = 200

export default function TopologyLayout ({ id }) {
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)
  const [topologyData, setTopologyData] = useState({})
  const [shouldPoll, setPolling] = useState(false)
  const [fetchMetrics, setFetchMetrics] = useState(false)
  const [metricsData, setMetricsData] = useState([])

  const shouldPollContinue = () => {
    // const inactiveStatus = ['TO_START', 'FINISHED', 'EDITED', 'STOPPED', 'ERROR', 'RUN_ERROR', 'INVALID']
    const inactiveStatus = ['FINISHED']
    const topologyInactive = inactiveStatus.indexOf(topologyData.topologyStatus) !== -1
    if (topologyInactive) return false
    return true
  }

  useEffect(() => {
    async function getTopologyData (id) {
      const res = await getTopologyById({ topologyId: id })
      setTopologyData(res)
      setAppTitle({ text: `TOPOLOGY: ${res.topologyId}` })
      res && setPolling(true)
      res && setFetchMetrics(true)
    }
    getTopologyData(id)
  }, [])

  useInterval(async () => {
    if (!shouldPollContinue()) return
    const { topologyId } = topologyData
    const latestStatus = await getTopologyById({ topologyId })
    if (!isEmpty(latestStatus)) {
      if (latestStatus.topologyStatus !== topologyData.topologyStatus) enqueueSnackbar(`Topology Status changed from ${topologyData.topologyStatus} to ${latestStatus.topologyStatus}.`, { variant: 'info' })
      setTopologyData(latestStatus)
      setFetchMetrics(true)
    }
    // else setPolling(false)
    // if (sameStatus >= MAX_POLL_COUNT) { setPolling(false); setSameStatus(1) }
  }, shouldPoll ? 2000 : null)

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

      <TopolgyRegisterationLayout
        propsName={topologyData.topologyId}
        propsSelectedPipelines={topologyData.topologyItems}
        propsTopologyData={topologyData}
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
