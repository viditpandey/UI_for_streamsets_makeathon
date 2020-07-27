import AccordianWrapper from '../Shared/ExpandCollapse/AccordianWrapper'
import MetricsLayout from '../Graphs/MetricsLayout'
import Grid from '@material-ui/core/Grid'
import HistoryIcon from '@material-ui/icons/History'
import React, { useState, useEffect, useContext } from 'react'
import Switch from '@material-ui/core/Switch'
import TopolgyRegisterationLayout from './TopolgyRegisterationLayout'

import { AppBarContext } from '../Base/Home'
import { CircularProgress, Typography, Button } from '@material-ui/core'
import { getNumberOfRecordsProcessed } from '../../actions/MetricsActions'
import { getTopologyById } from '../../actions/TopologyActions'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useInterval } from '../../helper/useInterval'
import { useSnackbar } from 'notistack'

const MAX_POLL_COUNT = 5

export default function TopologyLayout ({ id }) {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)
  const [topologyData, setTopologyData] = useState({})
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [fetchMetrics, setFetchMetrics] = useState(false)
  const [metricsData, setMetricsData] = useState([])
  const [finsihedCount, setFinishedCount] = useState(0)

  useEffect(() => {
    async function getTopologyData (id) {
      const res = await getTopologyById({ topologyId: id })
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
    const latestStatus = await getTopologyById({ topologyId })
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
      const allPipelineIDs = topologyData.topologyItems.map(p => p.pipelineId)
      const finalRes = await Promise.all(allPipelineIDs.map(i => getNumberOfRecordsProcessed({ pipelineId: i })))
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
      <Grid container spacing={3} justify='flex-end'>
        <Grid item xs={12} md={9}>
          <Typography>{'Auto refresh topology status'}
            <Switch
              checked={autoRefresh}
              color='primary'
              onChange={e => {
                setAutoRefresh(!autoRefresh)
              }}
              name='topologyAutoRefreshStatus'
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            className='full-width'
            variant='contained'
            color='primary'
            size='small'
            onClick={(e) => history.push(`/topologies/${topologyData.topologyId}/history`)}
            startIcon={<HistoryIcon />}
          >
            View Topology History
          </Button>
        </Grid>

      </Grid>

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
