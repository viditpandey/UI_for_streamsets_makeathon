import React, { useState, useEffect, useContext } from 'react'
import ListItemWrapper from '../Shared/List/ListItemWrapper'
import TopologyHistoryLayout from './TopologyHistoryLayout'

import { AppBarContext } from '../Base/Home'
import { CircularProgress, Typography } from '@material-ui/core'
import { getTopologyHistory } from '../../actions/TopologyActions'
import { getViewableDateTime } from '../../helper/commonHelper'
import { isEmpty, sortBy, reverse } from 'lodash'
import { useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export default function TopologyHistoriesLayout () {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)

  const [singleHistoryView, toggleHistoryView] = useState(false)
  const [topologyHistoryData, setTopologyHistoryData] = useState([])

  useEffect(() => {
    setAppTitle({ text: `${id} HISTORY`, currentPage: 'TopologyHistoriesLayout' })
    async function topologyHistory (id) {
      const res = await getTopologyHistory({ topologyId: id }).catch(e => { enqueueSnackbar('Something went wrong while fetching History for topology.', { variant: 'error' }) })
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
            items={reverse(sortBy(topologyHistoryData, ['topologyEndTime']))}
            itemClick={item => toggleHistoryView(item)}
            getPrimaryText={item => `${item.historyId}`}
            getKey={item => item.historyId}
            secondaryText={item => `status: ${item.topologyStatus}`}
            collapsedText={collapsedText}
            secondaryActionButton={item => {}}
          />
        )}
    </div>
  )
}
const collapsedText = historyItem => (
  <>
    {`start time: ${getViewableDateTime(historyItem.topologyStartTime)}`} <br />
    {`end time: ${getViewableDateTime(historyItem.topologyEndTime)}`} <br />
  </>
)
