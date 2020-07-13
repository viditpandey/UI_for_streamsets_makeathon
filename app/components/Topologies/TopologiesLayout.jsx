import 'regenerator-runtime/runtime.js'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState, useEffect } from 'react'
import { getTopologies } from '../../actions/TopologyActions'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}))

export default function TopologiesLayout () {
  const classes = useStyles()
  const history = useHistory()

  const [topologies, setTopologies] = useState([])

  useEffect(() => {
    async function fetchTopologies () {
      const res = await getTopologies()
      setTopologies(res) // after this set status of checked pipelines to on, i.e, insert their pipelineId in checked var
    }
    fetchTopologies()
  }, [])

  return (
    <div>
      <Chip variant='outlined' size='medium' label='TOPOLOGIES' className='margin-bottom-15' />
      <br />
      <Button
        onClick={() => history.push('/topologies/new')}
        variant='contained'
        color='primary'
        startIcon={<AddCircleIcon />}
      >
            new topology
      </Button>
      <div className='margin-bottom-15' />
      <List className={classes.root}>
        {topologies.map(topologyDetails => {
          console.log('topologyDetails', topologyDetails)
          return (
            <Topology
              key={topologyDetails.topologyId}
              topology={topologyDetails}
              history={history}
            />
          )
        })}
      </List>
    </div>
  )
}

const Topology = ({ topology, history }) => {
  const { topologyId, topologyItems } = topology
  const secondaryText = (
    <>
      {`pipelines: ${topologyItems.map(y => ' ' + y.pipelineId)}`}
    </>
  )
  return (
    <ListItem>
      <ListItemText
        id={topologyId}
        onClick={() => history.push(`/topologies/${topologyId}`)}
        primary={`${topologyId}`}
        secondary={secondaryText}
      />
    </ListItem>
  )
}
