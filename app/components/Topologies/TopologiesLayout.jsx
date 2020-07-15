import 'regenerator-runtime/runtime.js'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import ListItemWrapper from '../Shared/List/ListItemWrapper'
import React, { useState, useEffect, useContext } from 'react'

import { AppBarContext } from '../Base/Home'
import { getTopologies } from '../../actions/TopologyActions'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export default function TopologiesLayout () {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)

  const [topologies, setTopologies] = useState([])

  const newTopology = (
    <Button
      onClick={() => history.push('/topologies/create')}
      variant='contained'
      color='primary'
      startIcon={<AddCircleIcon />}
    >
    new topology
    </Button>)

  useEffect(() => {
    setAppTitle({ text: 'TOPOLOGIES', button: newTopology })
    async function fetchTopologies () {
      const res = await getTopologies()
      setTopologies(res) // after this set status of checked pipelines to on, i.e, insert their pipelineId in checked var
      enqueueSnackbar('Topologies fetched succesfully', { variant: 'info' })
    }
    fetchTopologies()
  }, [])

  return (
    <div>
      {isEmpty(topologies) ? null
        : <Topologies history={history} topologies={topologies} />}
    </div>
  )
}

const Topologies = ({ topologies, history }) => {
  return (
    <ListItemWrapper
      items={topologies}
      itemClick={item => history.push(`/topologies/${item.topologyId}`)}
      getPrimaryText={item => `${item.topologyId}`}
      getKey={item => item.topologyId}
      secondaryText={item => `contains ${item.topologyItems.length} pipeline(s)`}
      collapsedText={item => getTopologyItems(item)}
      secondaryActionButton={() => {}}
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
