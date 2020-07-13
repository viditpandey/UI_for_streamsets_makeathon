// import Chip from '@material-ui/core/Chip'
import React, { useEffect } from 'react'

export default function PipelineLayout ({ id, setAppTitle }) {
  useEffect(() => { setAppTitle({ text: `PIPELINE: ${id}` }) }, [])

  return (
    <div>
      Single Pipeline View (Coming Soon)
    </div>

  )
}
