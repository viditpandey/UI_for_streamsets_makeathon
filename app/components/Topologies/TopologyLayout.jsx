import 'regenerator-runtime/runtime.js'

import Chip from '@material-ui/core/Chip'
import React, { useState, useEffect } from 'react'
import TopolgyRegisterationLayout from './TopolgyRegisterationLayout'

import { getTopologyById } from '../../actions/TopologyActions'

export default function TopologyLayout ({ id }) {
  const [topologyData, setTopologyData] = useState({})

  useEffect(() => {
    async function getTopologyData (id) {
      const res = await getTopologyById({ topologyId: id })
      setTopologyData(res)
    }
    getTopologyData(id)
  }, [])

  return (
    <div>
      <Chip
        variant='outlined'
        size='medium'
        label={`TOPOLOGY: ${topologyData.topologyId} (${id})`}
        className='margin-bottom-15'
      />

      <TopolgyRegisterationLayout
        propsName={topologyData.topologyId}
        propsTreeData={[]}
        propsSelectedPipelines={topologyData.topologyItems}
      />
    </div>
  )
}
