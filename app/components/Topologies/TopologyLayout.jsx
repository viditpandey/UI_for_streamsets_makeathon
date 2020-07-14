import 'regenerator-runtime/runtime.js'

import React, { useState, useEffect, useContext } from 'react'
import TopolgyRegisterationLayout from './TopolgyRegisterationLayout'

import { AppBarContext } from '../Base/Home'
import { getTopologyById } from '../../actions/TopologyActions'
import { isEmpty } from 'lodash'
import { useInterval } from '../../helper/useInterval'

export default function TopologyLayout ({ id }) {
  const { setAppTitle } = useContext(AppBarContext)
  const [topologyData, setTopologyData] = useState({})

  useEffect(() => {
    async function getTopologyData (id) {
      const res = await getTopologyById({ topologyId: id })
      setTopologyData(res)
      setAppTitle({ text: `TOPOLOGY: ${res.topologyId} ${id}` })
    }
    getTopologyData(id)
  }, [])

  useInterval(async () => {
    const { topologyId } = topologyData
    const latestStatus = await getTopologyById({ topologyId })
    !isEmpty(latestStatus) && setTopologyData(latestStatus)
  }, id ? 3000 : null)

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
