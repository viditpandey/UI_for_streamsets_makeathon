import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import PipelinesForTopology from './PipelinesForTopology'
import React from 'react'

const AddPipelines = ({ left, setLeft, right, setRight, open, setOpen, disabled }) => {
  return (
    <div>
      <Button
        variant='contained'
        color='primary'
        size='small'
        disabled={disabled}
        onClick={(e) => { setOpen(true) }}
        startIcon={<AddCircleIcon />}
      >
          Add Pipelines to this topology
      </Button>
      <Dialog
        open={open}
        scroll='body'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
      >
        <DialogTitle id='scroll-dialog-title'>Select Pipelines</DialogTitle>
        <DialogContent />
        <PipelinesForTopology
          left={left}
          setLeft={setLeft}
          right={right}
          setRight={setRight}
        />
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

export default AddPipelines
