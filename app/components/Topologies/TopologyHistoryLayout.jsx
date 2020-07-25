import React, { useState, useEffect, useContext } from 'react'
import ListItemWrapper from '../Shared/List/ListItemWrapper'

import { AppBarContext } from '../Base/Home'
import { CircularProgress, Typography } from '@material-ui/core'
import { getTopologyHistory } from '../../actions/TopologyActions'
import { isEmpty, sortBy, reverse } from 'lodash'
import { useParams, useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export default function TopologyHistoryLayout () {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)
  const history = useHistory()

  const [topologyHistoryData, setTopologyHistoryData] = useState([])

  useEffect(() => {
    setAppTitle({ text: `TOPOLOGY HISTORY: ${id}` })
    async function topologyHistory (id) {
      const res = await getTopologyHistory({ topologyId: id })
      if (!isEmpty(res)) {
        setTopologyHistoryData(res)
        enqueueSnackbar('History Fetched', { variant: 'success' })
      }
    }
    topologyHistory(id)
  }, [])

  if (isEmpty(topologyHistoryData)) {
    return (
      <div>
        <CircularProgress />
        <Typography>Topology History will be here in some Future...</Typography>
      </div>
    )
  }

  return (
    <div>
      <ListItemWrapper
        items={reverse(sortBy(topologyHistoryData, ['topologyStopTime']))}
        itemClick={item => history.push(`/topologies/${id}/history/${item.historyId}`)}
        getPrimaryText={item => `${item.historyId} (${item.topologyStatus})`}
        getKey={item => item.historyId}
        secondaryText={item => `topology started: ${new Date(item.topologyStopTime)} and stopped: ${new Date(item.topologyStopTime)}`}
        collapsedText={item => {}}
        secondaryActionButton={item => {}}
      />
    </div>
  )
}
