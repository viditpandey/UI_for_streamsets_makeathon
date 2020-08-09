import React, { useState, useEffect, useContext } from 'react'
import ListItemWrapper from '../Shared/List/ListItemWrapper'
import SortableTree from 'react-sortable-tree'
import TopologyHistoryLayout from './TopologyHistoryLayout'

import { AppBarContext } from '../Base/Home'
import { CircularProgress, Typography } from '@material-ui/core'
import { getTopologyHistory } from '../../actions/TopologyActions'
import { getViewableDateTime } from '../../helper/commonHelper'
import { isEmpty, sortBy, reverse } from 'lodash'
import { listToTree, getTreeCompatibleData } from '../../helper/tree_util_functions'
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
            secondaryText={getSecondaryText}
            collapsedText={collapsedText}
            collapsedTextPrimary={collapsedTextPrimary}
            secondaryActionButton={item => {}}
          />
        )}
    </div>
  )
}

const getSecondaryText = historyItem => (
  <>
    {`status: ${historyItem.topologyStatus}`} <br />
    {`end time: ${getViewableDateTime(historyItem.topologyEndTime)}`} <br />
  </>
)

const collapsedText = historyItem => (
  <>
    {`start time: ${getViewableDateTime(historyItem.topologyStartTime)}`} <br />
    {`end time: ${getViewableDateTime(historyItem.topologyEndTime)}`} <br />
  </>
)

const collapsedTextPrimary = historyItem => {
  const { topologyHistoryItems } = historyItem
  const test = getTreeCompatibleData({ list: topologyHistoryItems, topologyStatus: historyItem.topologyStatus, handlePipelineClick: () => {} })
  const treeData = listToTree(test)
  const height = (topologyHistoryItems.length * 70) || 100
  return (
    <div className='graph-area-style padding-top-30' style={{ height: height }}>
      <Typography>Quick View of pipeline structure</Typography>
      <SortableTree
        treeData={treeData}
        getNodeKey={({ node }) => { return `${node.pipelineId}_${node.instanceId}` }}
        onChange={() => {}}
      />
    </div>
  )
}
