import React from 'react'
import TextField from '@material-ui/core/TextField'

const Name = ({ name, setName, disabled }) => {
  return (
    <TextField
      id='topology_name'
      value={name}
      disabled={disabled}
      onChange={e => setName(e.target.value)}
      // variant='outlined'
      label='Topology Name'
    />
  )
}

export default Name
