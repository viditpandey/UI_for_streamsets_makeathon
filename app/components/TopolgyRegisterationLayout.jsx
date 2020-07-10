import React, { useState, useEffect } from 'react'
import SortableTree from 'react-sortable-tree'
import TextField from '@material-ui/core/TextField'
import 'react-sortable-tree/style.css'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import PipelinesForTopology from './PipelinesForTopology'
import { getPipelines } from '../actions/PipelineActions'

export default function TopolgyRegisterationLayout () {
  const [name, setName] = useState('')
  const [treeData, setTreeData] = useState([])
  const [allPipelines, availablePipelines] = useState([])
  const [selectedPipelines, addPipelinesToTopology] = useState([])
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    async function fetchPipelines () {
      const res = await getPipelines()
      availablePipelines(res)
    }
    fetchPipelines()
  }, [])

  useEffect(() => {
    setTreeData(selectedPipelines.map(p => {
      return {
        title: p.title,
        expanded: true,
        children: []
      }
    }))
  }, [openDialog])

  return (
    <div>
      <Chip variant='outlined' size='medium' label='NEW TOPOLOGY' className='margin-bottom-15' />

      <form noValidate autoComplete='off' onSubmit={val => console.log(val)}>

        <Name name={name} setName={setName} />
        <br />

        <AddPipelines
          open={openDialog}
          setOpen={setOpenDialog}
          left={allPipelines}
          setLeft={availablePipelines}
          right={selectedPipelines}
          setRight={addPipelinesToTopology}
        />
        <br />

        <CreateTree
          treeData={treeData}
          setTreeData={setTreeData}
        />
        <br />

        <ButtonSubmit handleSubmit={() => console.log(name)} />
      </form>

    </div>
  )
}

const CreateTree = ({ treeData, setTreeData }) => {
  if (!treeData || !treeData.length) return <h3>No Pipelines Selected</h3>
  return (
    <div style={{ height: 500 }}>
      <SortableTree
        treeData={treeData}
        onChange={treeData => { console.log(treeData); setTreeData(treeData) }}
      />
    </div>
  )
}

const AddPipelines = ({ left, setLeft, right, setRight, open, setOpen }) => {
//   const [open, setOpen] = useState(false)
  return (
    <div>
      <Button
        variant='contained'
        color='primary'
        size='small'
        onClick={(e) => { setOpen(true) }}
        startIcon={<AddCircleIcon />}
      >
        Add Pipelines to this topology
      </Button>
      <Dialog
        open={open}
        // onClose={() => setOpen(false)}
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

const ButtonSubmit = ({ handleSubmit }) => {
  return (
    <Button
      variant='contained'
      color='primary'
      size='small'
      onClick={(e) => { handleSubmit() }}
      startIcon={<SaveIcon />}
    >
        CREATE TOPOLOGY
    </Button>
  )
}

const Name = ({ name, setName }) => {
  return (
    <TextField
      id='topology_name'
      value={name}
      onChange={e => setName(e.target.value)}
      //   autoFocus
      variant='outlined'
      style={{ marginBottom: '15px' }}
      label='Topology Name'
    />
  )
}
