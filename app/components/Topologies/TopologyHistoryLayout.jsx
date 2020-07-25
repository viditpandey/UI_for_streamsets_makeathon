import React, { useState, useEffect, useContext } from 'react'

import { AppBarContext } from '../Base/Home'
import { CircularProgress, Typography } from '@material-ui/core'
import { isEmpty } from 'lodash'
import { useSnackbar } from 'notistack'

const getHistoryByTopologyId = () => {}

export default function TopologyLayout ({ id }) {
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)
  const [topologyHistoryData, setTopologyHistoryData] = useState([])

  useEffect(() => {
    async function getTopologyHistory (id) {
      const res = await getHistoryByTopologyId({ topologyId: id })
      if (!isEmpty(res)) {
        setTopologyHistoryData(res)
        setAppTitle({ text: `TOPOLOGY HISTORY: ${res.topologyId}` })
        enqueueSnackbar('History Fetched')
      }
    }
    getTopologyHistory(id)
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
      <Typography>
        {'Topology History Data...'}
      </Typography>
    </div>
  )
}
