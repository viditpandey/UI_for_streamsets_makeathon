import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import DialogContent from '@material-ui/core/DialogContent'
import React, { useState } from 'react'
import Slide from '@material-ui/core/Slide'
import TextField from '@material-ui/core/TextField'

import { Typography } from '@material-ui/core'

export const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function ConfigureTopologySchedule ({
  open, setOpen, topology
}) {
  const [schedulerType, setSchedulerType] = useState('cron')
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
            onClick={() => setOpen(false)} color='primary'
          >
              Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const SchedulerType = ({ value, handleChange }) => {
  return (
    <div>
      <SchedulerOptions
        value={value}
        handleChange={handleChange}
      />
      <SchedulerConfig
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

const SchedulerConfig = ({ type, val }) => {
  return (
    type === 'cron'
      ? (
        <TextField
          id='scheduler_cron'
          value={val}
          onChange={e => console.log(e.target.value)}
          label='Cron Pattern'
        />
      ) : null
  )
}
