import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import ConfigureTopologySchedule from './ConfigureTopologySchedule'
import DeleteIcon from '@material-ui/icons/Delete'
import NotesIcon from '@material-ui/icons/Notes'
import ListItemWrapper from '../Shared/List/ListItemWrapper'
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff'
import NotificationsIcon from '@material-ui/icons/Notifications'
import React, { useState, useEffect, useContext } from 'react'
import ScheduleIcon from '@material-ui/icons/Schedule'
import Tooltip from '@material-ui/core/Tooltip'

import { AppBarContext } from '../Base/Home'
import { generateRandomColorByStrings } from '../../helper/PipelineHelpers'
import { getTopologies, deleteTopology, toggleTopologyAlert } from '../../actions/TopologyActions'
import { getViewableDateTime } from '../../helper/commonHelper'
import { HEX_CODES } from '../../configs/constants'
import { isEmpty, sortBy, flatten, uniq, cloneDeep, merge } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'
import nodeSchedule from 'node-schedule'

export default function TopologiesLayout () {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)

  const axiosHandler = async ({ method = () => {}, methodParams, errorMessage = 'Action failed', successMessage, infoMessage }) => {
    let failed = false
    const res = await method(methodParams)
      .catch(e => {
        failed = true
        enqueueSnackbar(errorMessage, { variant: 'error' })
        return null
      })
    !failed && successMessage && enqueueSnackbar(successMessage, { variant: 'success' })
    !failed && infoMessage && enqueueSnackbar(infoMessage, { variant: 'info' })
    return res
  }

  const [topologies, setTopologies] = useState([])
  const [selectedTopology, setSelectedTopology] = useState({})
  const [openScheduler, setOpenScheduler] = useState(false)
  const [instanceIdsWithColor, setInstanceIds] = useState({})

  const updateTopologyProperties = function (topologyId, updatedProperties) {
    const temp = cloneDeep(topologies)
    temp.forEach(t => {
      if (t.topologyId === topologyId) t = merge(t, updatedProperties)
    })
    setTopologies(temp)
  }

  const newTopology = (
    <Button
      onClick={() => history.push('/topologies/create')}
      variant='contained'
      color='primary'
      startIcon={<AddCircleIcon />}
    >
    new topology
    </Button>)

  useEffect(() => {
    async function fetchTopologies () {
      const res = await axiosHandler({ method: getTopologies, errorMessage: 'Topologies fetch failed', infoMessage: 'Topologies fetched succesfully' })
      let topologiesCount = ''
      if (!isEmpty(res)) {
        topologiesCount = `(${res.length})`
        const allInstanceIds = []
        setTopologies(res)
        res.forEach(topology => {
          if (isEmpty(topology.topologyItems)) return
          const ids = topology.topologyItems.map(i => i.instanceId)
          allInstanceIds.push(ids)
          setInstanceIds(generateRandomColorByStrings(uniq(flatten(allInstanceIds))))
        })
      }
      setAppTitle({
        text: `TOPOLOGIES ${topologiesCount}`,
        button: newTopology,
        currentPage: 'TopologiesLayout'
      })
    }
    fetchTopologies()
  }, [])

  return (
    <div>
      {isEmpty(topologies) ? null
        : (
          <div id='topologies-layout'>
            <Topologies
              history={history}
              topologies={topologies}
              deleteTopology={deleteTopology}
              axiosHandler={axiosHandler}
              setOpenScheduler={(topology) => { setSelectedTopology(topology); setOpenScheduler(!openScheduler) }}
              instanceIdsWithColor={instanceIdsWithColor}
            />

            <ConfigureTopologySchedule
              open={openScheduler}
              setOpen={setOpenScheduler}
              topology={selectedTopology}
              updateTopologyProperties={updateTopologyProperties}
            />
          </div>
        )}
    </div>
  )
}

const Topologies = ({
  topologies, history, deleteTopology,
  instanceIdsWithColor, axiosHandler, setOpenScheduler
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const deleteTopologyButton = item => {
    return (
      <Tooltip title='Delete Topology'>
        <IconButton
          aria-label='delete topology'
          style={{ color: HEX_CODES.red }}
          onClick={async (e) => {
            await axiosHandler({
              method: deleteTopology,
              methodParams: { topologyId: item.topologyId },
              errorMessage: 'Something went wring while deleting the topology',
              successMessage: 'Topology deleted successfuly.'
            })
          }}
          id='topology-delete-button'
          component='span'
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    )
  }

  const historyTopologyButton = item => {
    return (
      <Tooltip title='View Topology History'>
        <IconButton
          aria-label='topology history'
          style={{ color: HEX_CODES.blue }}
          onClick={() => history.push(`/topologies/${item.topologyId}/history`)}
          id='topology-history-button'
          component='span'
        >
          <NotesIcon />
        </IconButton>
      </Tooltip>
    )
  }

  const scheduleTopologyButton = item => {
    return (
      <Tooltip title='Schedule Topology'>
        <IconButton
          style={{ color: HEX_CODES.green }}
          aria-label='schedule topology'
          onClick={() => { setOpenScheduler(item) }}
          id='topology-schedule-button'
          component='span'
        >
          <ScheduleIcon />
        </IconButton>
      </Tooltip>
    )
  }

  const toggleTopologyAlerts = item => {
    const { topologyId, topologyItems, alertStatus } = item
    return (
      <Tooltip title={`Toggle ${alertStatus ? 'off' : 'on'} topology alerts`}>
        <IconButton
          style={{ color: alertStatus ? HEX_CODES.green : HEX_CODES.grey }}
          aria-label='topology alerts'
          onClick={() => {
            toggleTopologyAlert({ topologyId, topologyItems, alertStatus: !alertStatus })
              .then(() => { enqueueSnackbar('Topology alert updated', { variant: 'success' }) })
              .catch(() => { enqueueSnackbar('Something went wring while updating topology alerts.', { variant: 'error' }) })
          }}
          id='topology-schedule-button'
          component='span'
        >
          {item.alertStatus ? <NotificationsIcon /> : <NotificationsOffIcon />}
        </IconButton>
      </Tooltip>
    )
  }

  const renderHistoryAndDeleteButtons = item => {
    return (
      <div id='topologies-action-buttons'>
        {toggleTopologyAlerts(item)}
        {scheduleTopologyButton(item)}
        {historyTopologyButton(item)}
        {deleteTopologyButton(item)}
      </div>
    )
  }

  return (
    <ListItemWrapper
      items={sortBy(topologies, ['topologyId'])}
      itemClick={item => history.push(`/topologies/${item.topologyId}`)}
      getPrimaryText={item => `${item.topologyId}`}
      getKey={item => item.topologyId}
      secondaryText={secondaryTextTopology}
      collapsedText={item => getTopologyItems(item, instanceIdsWithColor)}
      secondaryActionButton={item => renderHistoryAndDeleteButtons(item)}
      listId='topologies-layout-children'
    />
  )
}

const secondaryTextTopology = topology => {
  return (
    <>
      {getNextInvocation(topology)}<br />
      <span>{`contains ${topology.topologyItems.length} pipeline(s)`}</span>
    </>
  )
}

const getTopologyItems = (topology, instanceIdsWithColor) => {
  if (isEmpty(topology.topologyItems)) return null
  else {
    const renderPipelines = (p, i) => (
      <span key={p.pipelineId} style={{ color: instanceIdsWithColor[p.instanceId] }}>
        {`${i + 1}) ${p.pipelineTitle || p.pipelineId}. (${p.instanceId})`}<br />
      </span>
    )
    return (
      <>
        {topology.topologyItems.map(renderPipelines)}
      </>
    )
  }
}

function getNextInvocation (topology) {
  const defaultTime = <span>'No next schedule'</span>
  try {
    if (!topology.cronConfig) return <span>Open Scheduler to view next schedule...</span>
    else if (topology.toRun !== undefined && topology.toRun.toString() === 'false') {
      return <span style={{ color: HEX_CODES.lightBlue }}>Topology automatic schedule paused.</span>
    }

    const job = nodeSchedule.scheduleJob(topology.cronConfig || '* * * * *', () => {})
    const nextInvocation = job.nextInvocation()
    job.cancel()
    return <span style={{ color: HEX_CODES.green }}>Next scheduled at: {getViewableDateTime(nextInvocation._date._d)}</span> || defaultTime
  } catch (error) {
    return defaultTime
  }
}
