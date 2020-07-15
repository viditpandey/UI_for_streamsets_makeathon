import React, { useState, useEffect, useContext } from 'react'
import TopolgyRegisterationLayout from './TopolgyRegisterationLayout'

import { AppBarContext } from '../Base/Home'
import { getTopologyById } from '../../actions/TopologyActions'
import { isEmpty } from 'lodash'
import { useInterval } from '../../helper/useInterval'

const MAX_POLL_COUNT = 2

export default function TopologyLayout ({ id }) {
  const { setAppTitle } = useContext(AppBarContext)
  const [topologyData, setTopologyData] = useState({})
  const [shouldPoll, setPolling] = useState(false)
  const [sameStatus, setSameStatus] = useState(0)

  useEffect(() => {
    async function getTopologyData (id) {
      const res = await getTopologyById({ topologyId: id })
      setTopologyData(res)
      setAppTitle({ text: `TOPOLOGY: ${res.topologyId}` })
    }
    getTopologyData(id)
    id && setPolling(true)
  }, [])

  useInterval(async () => {
    if (!shouldPoll) return
    const { topologyId, topologyStatus } = topologyData
    const latestStatus = await getTopologyById({ topologyId })
    if (!isEmpty(latestStatus)) setTopologyData(latestStatus)
    else setPolling(false)
    if (latestStatus && topologyStatus === latestStatus.topologyStatus) setSameStatus(sameStatus + 1)
    else setSameStatus(1)
    if (sameStatus >= MAX_POLL_COUNT) { setPolling(false); setSameStatus(1) }
  }, shouldPoll ? 3000 : null)

  return (
    <div>

      <TopolgyRegisterationLayout
        propsName={topologyData.topologyId}
        propsSelectedPipelines={topologyData.topologyItems}
        propsTopologyData={topologyData}
      />
    </div>
  )
}
