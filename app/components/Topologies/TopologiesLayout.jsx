import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import ConfigureTopologySchedule from './ConfigureTopologySchedule'
import DeleteIcon from '@material-ui/icons/Delete'
import HistoryIcon from '@material-ui/icons/History'
import ListItemWrapper from '../Shared/List/ListItemWrapper'
import React, { useState, useEffect, useContext } from 'react'
import ScheduleIcon from '@material-ui/icons/Schedule'

import { AppBarContext } from '../Base/Home'
import { getTopologies, deleteTopology } from '../../actions/TopologyActions'
import { isEmpty, sortBy } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'

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
    setAppTitle({ text: 'TOPOLOGIES', button: newTopology })
    async function fetchTopologies () {
      const res = await axiosHandler({ method: getTopologies, errorMessage: 'Topologies fetch failed', infoMessage: 'Topologies fetched succesfully' })
      res && setTopologies(res)
    }
    fetchTopologies()
  }, [])

  return (
    <div>
      {isEmpty(topologies) ? null
        : (
          <div>
            <Topologies
              history={history}
              topologies={topologies}
              deleteTopology={deleteTopology}
              axiosHandler={axiosHandler}
              // open={openScheduler}
              setOpenScheduler={(topology) => { setSelectedTopology(topology); setOpenScheduler(!openScheduler) }}
            />
            <ConfigureTopologySchedule
              open={openScheduler}
              setOpen={setOpenScheduler}
              topology={selectedTopology}
            />
          </div>
        )}
    </div>
  )
}

const Topologies = ({ topologies, history, deleteTopology, axiosHandler, setOpenScheduler }) => {
  const deleteTopologyButton = item => {
    return (
      <IconButton
        aria-label='delete topology'
        onClick={async (e) => {
          await axiosHandler({
            method: deleteTopology,
            methodParams: { topologyId: item.topologyId },
            errorMessage: 'Something went wring while deleting the topology',
            successMessage: 'Topology deleted successfuly.'
          })
        }}
        component='span'
      >
        <DeleteIcon />
      </IconButton>
    )
  }

  const historyTopologyButton = item => {
    return (
      <IconButton
        aria-label='delete topology'
        onClick={() => history.push(`/topologies/${item.topologyId}/history`)}
        component='span'
      >
        <HistoryIcon />
      </IconButton>
    )
  }

  const scheduleTopologyButton = item => {
    return (
      <IconButton
        aria-label='delete topology'
        onClick={() => { setOpenScheduler(item) }}
        component='span'
      >
        <ScheduleIcon />
      </IconButton>
    )
  }

  const renderHistoryAndDeleteButtons = item => {
    return (
      <div>
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
      secondaryText={item => `contains ${item.topologyItems.length} pipeline(s)`}
      collapsedText={item => getTopologyItems(item)}
      secondaryActionButton={item => renderHistoryAndDeleteButtons(item)}
    />
  )
}

const getTopologyItems = topology => {
  if (isEmpty(topology.topologyItems)) return null
  else {
    const renderPipelines = (p, i) => <span key={p.pipelineId}>{`${i + 1}) ${p.pipelineId}`}<br /></span>
    return (
      <>
        {topology.topologyItems.map(renderPipelines)}
      </>
    )
  }
}
