import React from 'react'
import TextField from '@material-ui/core/TextField'

import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: '#dedede' || theme.palette.background.default,
    padding: theme.spacing(1)
  }
}))

const Name = ({ name, setName, disabled, topologyStatus }) => {
  if (disabled) {
    const classes = useStyles()
    const status = `(${topologyStatus})`
    return (
      <div>
        <Typography className={classes.root} variant='h4' component='h6'>
          {`${name} ${topologyStatus ? status : ''}`}
        </Typography>
      </div>
    )
  }
  return (
    <TextField
      id='topology_name'
      value={name}
      disabled={disabled}
      onChange={e => setName(e.target.value)}
      label='Topology Name'
    />
  )
}

export default Name
