import React from 'react'
import Chip from '@material-ui/core/Chip'

export default function PipelineLayout ({ id }) {
  return (
    <Chip variant='outlined' size='medium' label={`PIPELINE: ${id}`} className='margin-bottom-15' />

  )
}
