import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import React from 'react'
import { useHistory } from 'react-router-dom'
import 'regenerator-runtime/runtime.js'

export default function TopologiesLayout () {
  const history = useHistory()
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
    </div>
  )
}
