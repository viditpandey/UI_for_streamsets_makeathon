import React from 'react'

import { Typography } from '@material-ui/core'

export default function Legend ({ name, color }) {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ marginTop: '5px', height: '15px', width: '30px', background: color }} />
        &nbsp; &nbsp;
        <Typography>{name}</Typography>
      </div>
    </div>
  )
}
