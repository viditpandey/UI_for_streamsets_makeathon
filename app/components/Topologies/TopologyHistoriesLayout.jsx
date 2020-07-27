import React, { useState, useEffect, useContext } from 'react'
import ListItemWrapper from '../Shared/List/ListItemWrapper'

import { AppBarContext } from '../Base/Home'
import { CircularProgress, Typography } from '@material-ui/core'
import { getTopologyHistory } from '../../actions/TopologyActions'
import { isEmpty, sortBy, reverse } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import TopologyHistoryLayout from './TopologyHistoryLayout'

export default function TopologyHistoriesLayout () {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)

  const [singleHistoryView, toggleHistoryView] = useState(false)
  const [topologyHistoryData, setTopologyHistoryData] = useState([])

  useEffect(() => {
    setAppTitle({ text: `TOPOLOGY HISTORY: ${id}`, currentPage: 'TopologyHistoriesLayout' })
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
      {singleHistoryView
        ? <TopologyHistoryLayout propsTopologyData={singleHistoryView} toggleHistoryView={toggleHistoryView} />
        : (
          <ListItemWrapper
            items={reverse(sortBy(topologyHistoryData, ['topologyStopTime']))}
            itemClick={item => toggleHistoryView(item)}
            getPrimaryText={item => `${item.historyId} (${item.topologyStatus})`}
            getKey={item => item.historyId}
            secondaryText={item => `topology started: ${new Date(item.topologyStartTime)} and stopped: ${new Date(item.topologyEndTime)}`}
            collapsedText={item => {}}
            secondaryActionButton={item => {}}
          />
        )}
    </div>
  )
}
