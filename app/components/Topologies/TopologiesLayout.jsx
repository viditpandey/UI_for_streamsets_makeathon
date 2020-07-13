import 'regenerator-runtime/runtime.js'

import AppTitleBar from '../Base/AppTitleBar'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import ListItemWrapper from '../Shared/List/ListItemWrapper'
import React, { useState, useEffect } from 'react'

import { getTopologies } from '../../actions/TopologyActions'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'

export default function TopologiesLayout () {
  const history = useHistory()

  const [topologies, setTopologies] = useState([])

  useEffect(() => {
    async function fetchTopologies () {
      const res = await getTopologies()
      setTopologies(res) // after this set status of checked pipelines to on, i.e, insert their pipelineId in checked var
    }
    fetchTopologies()
  }, [])

  const newTopology = (
    <Button
      onClick={() => history.push('/topologies/new')}
      variant='contained'
      color='primary'
      startIcon={<AddCircleIcon />}
    >
    new topology
    </Button>)

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AppTitleBar
            appTitle='TOPOLOGIES'
            renderSecondaryButton={newTopology}
          />
        </Grid>
        {isEmpty(topologies) ? null
          : <Topologies history={history} topologies={topologies} />}
      </Grid>
    </div>
  )
}

const Topologies = ({ topologies, history }) => {
  return (
    <ListItemWrapper
      items={topologies}
      itemClick={item => history.push(`/topologies/${item.topologyId}`)}
      primary={item => `${item.topologyId}`}
      getKey={item => item.topologyId}
      collapsedText={item => getTopologyItems(item)}

    />
  )
}

const getTopologyItems = topology => {
  if (isEmpty(topology.topologyItems)) return null
  else {
    return (
      <>{`pipelines: ${topology.topologyItems.map(y => ' ' + y.pipelineId)}`}</>
    )
  }
}
