import 'regenerator-runtime/runtime.js'

import React, { useState, useEffect, useContext } from 'react'
import TopolgyRegisterationLayout from './TopolgyRegisterationLayout'

import { AppBarContext } from '../Base/Home'
import { getTopologyById } from '../../actions/TopologyActions'

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

  return (
    <div>

      <TopolgyRegisterationLayout
        propsName={topologyData.topologyId}
        propsSelectedPipelines={topologyData.topologyItems}
      />
    </div>
  )
}
