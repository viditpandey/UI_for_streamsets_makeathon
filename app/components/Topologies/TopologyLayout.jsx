import 'regenerator-runtime/runtime.js'

import React, { useState, useEffect } from 'react'
import TopolgyRegisterationLayout from './TopolgyRegisterationLayout'

import { getTopologyById } from '../../actions/TopologyActions'

export default function TopologyLayout ({ id, setAppTitle }) {
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
        setAppTitle={setAppTitle}
        propsName={topologyData.topologyId}
        propsSelectedPipelines={topologyData.topologyItems}
      />
    </div>
  )
}
