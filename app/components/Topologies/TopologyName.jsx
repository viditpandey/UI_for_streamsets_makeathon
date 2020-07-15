import React from 'react'
import TextField from '@material-ui/core/TextField'

import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1)
  }
}))

const Name = ({ name, setName, disabled }) => {
  if (disabled) {
    const classes = useStyles()
    return (
      <Typography className={classes.root} variant='h4' component='h6'>
        {name}
      </Typography>
    )
  }
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
