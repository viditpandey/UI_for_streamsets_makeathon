import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import React, { useState } from 'react'
import Slide from '@material-ui/core/Slide'
import TextField from '@material-ui/core/TextField'

import { createScheduler } from '../../actions/SchedulerActions'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}))

export const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function ConfigureTopologySchedule ({
  open, setOpen, topology
}) {
  const [schedulerType, setSchedulerType] = useState('cron')
  const [cronConfig, setCronConfig] = useState('* * * * *')
  const titleDialog = `Schedule Topology ${topology.topologyId}`
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {}}
        TransitionComponent={Transition}
        scroll='body'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
      >
        <DialogTitle id='scroll-dialog-title'>{titleDialog}</DialogTitle>
        <DialogContent>
          <Typography>Which Scheduler you want to configure?</Typography>
          <br />
          <SchedulerType
            cronConfig={cronConfig}
            setCronConfig={setCronConfig}
            value={schedulerType}
            handleChange={(e) => setSchedulerType(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)} color='primary'
          >
              Close
          </Button>
          <Button
            // disabled={disabled}
            onClick={() => {
              console.log('------', topology.topologyId, cronConfig, true)
              createScheduler({ topologyId: topology.topologyId, cronConfig, toRun: true })
              setOpen(false)
            }} color='primary'
          >
              Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const SchedulerType = ({ value, handleChange, cronConfig, setCronConfig }) => {
  return (
    <div>
      <SchedulerOptions
        value={value}
        handleChange={handleChange}
      />
      <br />
      <SchedulerConfig
        cronConfig={cronConfig}
        setCronConfig={setCronConfig}
        type={value}
      />
    </div>
  )
}

const SchedulerOptions = ({ value, handleChange }) => {
  return (
    <FormControl component='fieldset'>
      <RadioGroup aria-label='SchedulerType' name='Scheduler-type' value={value} onChange={handleChange}>
        <FormControlLabel value='cron' control={<Radio />} label='Cron' />
        <FormControlLabel value='datetime' control={<Radio />} label='Date time' />
      </RadioGroup>
    </FormControl>
  )
}

const SchedulerConfig = ({ type, cronConfig, setCronConfig }) => {
  const classes = useStyles()
  return (
    type === 'cron'
      ? (
        <TextField
          id='scheduler_cron'
          value={cronConfig}
          onChange={e => setCronConfig(e.target.value)}
          label='Cron Pattern'
        />
      ) : (
        <form className={classes.container} noValidate>
          <TextField
            id='datetime-local'
            label='Next appointment'
            type='datetime-local'
            defaultValue={new Date(cronConfig).toISOString()}
            onChange={e => { setCronConfig(e.target.value) }}
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
        </form>
      )
  )
}
