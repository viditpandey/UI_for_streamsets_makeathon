import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import React from 'react'
import TextField from '@material-ui/core/TextField'

export default function RenderPipelineConfigs ({ open, setOpen, pipeline, setSelectedPipeline, threshold, setThreshold, waitTime, setWaitTime }) {
  let titleDialog = 'No pipeline Selected'
  if (pipeline) titleDialog = `Pipeline: ${pipeline.title}`
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setSelectedPipeline(null)}
        scroll='body'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
      >
        <DialogTitle id='scroll-dialog-title'>{titleDialog}</DialogTitle>
        <DialogContent>
          <TextField
            id='pipeline_threshold'
            value={threshold}
            type='number'
            onChange={e => setThreshold(e.target.value)}
            variant='outlined'
            style={{ marginBottom: '15px' }}
            label='Retry threshold limit (# times).'
          />
          <TextField
            id='pipeline_time_dependency'
            value={waitTime}
            type='number'
            onChange={e => setWaitTime(e.target.value)}
            variant='outlined'
            style={{ marginBottom: '15px' }}
            label='Time dependency (seconds).'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
              Cancel
          </Button>
          <Button onClick={() => setOpen(false)} color='primary'>
              Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
