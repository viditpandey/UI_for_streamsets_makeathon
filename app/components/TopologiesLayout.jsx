import 'regenerator-runtime/runtime.js'
import React from 'react'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Chip from '@material-ui/core/Chip'

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
