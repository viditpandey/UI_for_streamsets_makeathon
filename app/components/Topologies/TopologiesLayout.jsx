import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import ListItemWrapper from '../Shared/List/ListItemWrapper'
import React, { useState, useEffect, useContext } from 'react'

import { AppBarContext } from '../Base/Home'
import { getTopologies, deleteTopology } from '../../actions/TopologyActions'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'

export default function TopologiesLayout () {
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const { setAppTitle } = useContext(AppBarContext)

  const axiosHandler = async ({ method = () => {}, methodParams, errorMessage = 'Action failed', successMessage, infoMessage }) => {
    let failed = false
    const res = await method(methodParams)
      .catch(e => {
        failed = true
        enqueueSnackbar(errorMessage, { variant: 'error' })
        return null
      })
    !failed && successMessage && enqueueSnackbar(successMessage, { variant: 'success' })
    !failed && infoMessage && enqueueSnackbar(infoMessage, { variant: 'info' })
    return res
  }

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
      const res = await axiosHandler({ method: getTopologies, errorMessage: 'Topologies fetch failed', infoMessage: 'Topologies fetched succesfully' })
      res && setTopologies(res) // after this set status of checked pipelines to on, i.e, insert their pipelineId in checked var
    }
    fetchTopologies()
  }, [])

  return (
    <div>
      {isEmpty(topologies) ? null
        : (
          <Topologies
            history={history}
            topologies={topologies}
            deleteTopology={deleteTopology}
            axiosHandler={axiosHandler}
          />
        )}
    </div>
  )
}

const Topologies = ({ topologies, history, deleteTopology, axiosHandler }) => {
  const deleteTopologyButton = item => {
    return (
      <IconButton
        aria-label='delete topology'
        onClick={async (item) => {
          await axiosHandler({
            method: deleteTopology,
            methodParams: { topologyId: item.topologyId },
            errorMessage: 'Something went wring while deleting the topology',
            successMessage: 'Topology deleted successfuly.'
          })
        }}
        component='span'
      >
        <DeleteIcon />
      </IconButton>
    )
  }
  return (
    <ListItemWrapper
      items={topologies}
      itemClick={item => history.push(`/topologies/${item.topologyId}`)}
      getPrimaryText={item => `${item.topologyId}`}
      getKey={item => item.topologyId}
      secondaryText={item => `contains ${item.topologyItems.length} pipeline(s)`}
      collapsedText={item => getTopologyItems(item)}
      secondaryActionButton={item => deleteTopologyButton(item)}
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
