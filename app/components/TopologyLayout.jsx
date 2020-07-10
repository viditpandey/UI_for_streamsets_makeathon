import React from 'react'
import Chip from '@material-ui/core/Chip'

export default function TopologyLayout ({ id }) {
  return (
    <Chip variant='outlined' size='medium' label={`TOPOLOGY: ${id}`} className='margin-bottom-15' />

  )
}
