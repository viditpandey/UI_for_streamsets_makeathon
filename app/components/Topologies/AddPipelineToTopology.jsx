import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import PipelinesForTopology from './PipelinesForTopology'
import React from 'react'
import Slide from '@material-ui/core/Slide'

import { concat } from 'lodash'
import { generateRandomColor } from '../../helper/PipelineHelpers'

export const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

function filterSearchedPipelines (pipelines, searchTerm) {
  try {
    if (searchTerm.trim() === '') return pipelines
    const filteredPipelines = pipelines.filter(p => {
      const isNameMatched = p.title.toLowerCase().search(searchTerm.toLowerCase()) !== -1
      const isInstanceMatched = p.instanceId.toLowerCase().search(searchTerm.toLowerCase()) !== -1
      return (isNameMatched || isInstanceMatched)
    })
    return filteredPipelines
  } catch (error) {
    return pipelines
  }
}

const AddPipelines = ({ left, setLeft, right, setRight, open, setOpen, disabled, buttonText }) => {
  const [instanceIdsWithColor, setInstanceIds] = React.useState({})
  const [searchCriteria, setSearchCriteria] = React.useState()

  React.useEffect(() => {
    if (open) {
      const allInstanceIds = concat(left, right).map(i => i.instanceId)
      setInstanceIds(generateRandomColor(allInstanceIds))
    }
  }, [open])

  return (
    <div id='topology-add-pipelines'>
      <Button
        variant='contained'
        color='primary'
        size='medium'
        disabled={disabled}
        onClick={(e) => { setOpen(true) }}
        startIcon={<AddCircleIcon />}
      >
        {buttonText}
      </Button>
      <Dialog
        open={open}
        maxWidth='lg'
        TransitionComponent={Transition}
        scroll='body'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
      >
        <DialogTitle id='scroll-dialog-title'>Select Pipelines</DialogTitle>
        <DialogContent />
        <PipelinesForTopology
          left={filterSearchedPipelines(left, searchCriteria)}
          setLeft={setLeft}
          right={right}
          setRight={setRight}
          instanceIdsWithColor={instanceIdsWithColor}
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
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
