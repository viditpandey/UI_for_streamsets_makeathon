import AppTitleBar from '../Base/AppTitleBar'
// import Chip from '@material-ui/core/Chip'
import React from 'react'

export default function PipelineLayout ({ id }) {
  return (
    <AppTitleBar appTitle={`PIPELINE: ${id}`} />
    // <AppTitleBar appTitle={<Chip variant='outlined' size='medium' label={`PIPELINE: ${id}`} />} />

  )
}
