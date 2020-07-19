import React from 'react'
import TextField from '@material-ui/core/TextField'

import { makeStyles } from '@material-ui/core/styles'
import { getStyleByPipelineStatus } from '../../configs/constants'
import { Typography } from '@material-ui/core'

const useStyles = (topologyStatus) => makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    backgroundColor: (getStyleByPipelineStatus[topologyStatus] && getStyleByPipelineStatus[topologyStatus].background) || '#dedede' || theme.palette.background.default,
    padding: theme.spacing(1)
  }
}))

const Name = ({ name, setName, disabled, topologyStatus }) => {
  if (disabled) {
    const classes = useStyles(topologyStatus)()
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
      error={/\s/.test(name)}
      helperText='Topology name cannot contain spaces'
      value={name}
      disabled={disabled}
      onChange={e => setName(e.target.value)}
      label='Topology Name'
    />
  )
}

export default Name
