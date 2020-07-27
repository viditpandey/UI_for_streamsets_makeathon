import React, { useEffect, useContext } from 'react'
import { AppBarContext } from '../Base/Home'

export default function PipelineLayout ({ id }) {
  const { setAppTitle } = useContext(AppBarContext)
  useEffect(() => { setAppTitle({ text: `PIPELINE: ${id}`, currentPage: 'PipelineLayout' }) }, [])

  return (
    <div>
      Single Pipeline View (Coming Soon)
    </div>

  )
}
