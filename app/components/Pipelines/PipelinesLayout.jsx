import 'regenerator-runtime/runtime.js'

// import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import Chip from '@material-ui/core/Chip'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import React, { useState, useEffect } from 'react'
// import Switch from '@material-ui/core/Switch'
import StopIcon from '@material-ui/icons/Stop'

import { getPipelines, startPipeline, stopPipeline, getPipelinesStatus } from '../../actions/PipelineActions'
import { makeStyles } from '@material-ui/core/styles'
import { useInterval } from '../../helper/useInterval'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}))

export default function PipelinesLayout () {
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()
  const classes = useStyles()

  const [checked, setChecked] = useState([])
  const [pipelines, setPipelines] = useState([])

  useEffect(() => {
    async function fetchPipelines () {
      const res = await getPipelines()
      setPipelines(res) // after this set status of checked pipelines to on, i.e, insert their pipelineId in checked var
      enqueueSnackbar('pipelines fetched succesfully', { variant: 'info' })
    }
    fetchPipelines()
  }, [])

  useInterval(async () => {
    const latestStatus = await getPipelinesStatus()
    const updatedPipelines = []
    latestStatus.length && latestStatus.forEach(p => {
      const { status, pipelineId } = p
      updatedPipelines.push(updatePipeline({ pipelineId, property: 'status', newVal: status }))
    })
    latestStatus.length && setPipelines(updatedPipelines)
  }, pipelines.length ? 5000 : null)

  const updatePipeline = ({ pipelineId, property, newVal }) => {
    let updatedPipeline = []
    pipelines.forEach(prevPipeline => {
      if (prevPipeline.pipelineId === pipelineId) {
        prevPipeline[property] = newVal
        updatedPipeline = prevPipeline
      }
    })
    return updatedPipeline
  }

  const handleToggle = (pipelineId) => async () => {
    const currentIndex = checked.indexOf(pipelineId)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(pipelineId)
      const t = await startPipeline({ pipelineId })
      enqueueSnackbar('pipeline started succesfully', { variant: 'success' })
      updatePipeline({ pipelineId: t.pipelineId, property: 'status', newVal: t.status })
    } else {
      newChecked.splice(currentIndex, 1)
      const t = await stopPipeline({ pipelineId })
      enqueueSnackbar('pipeline stopped succesfully', { variant: 'success' })
      updatePipeline({ pipelineId: t.pipelineId, property: 'status', newVal: t.status })
    }
    console.log('handle toggle called')
    setChecked(newChecked)
  }

  return (
    <div>
      <Chip variant='outlined' size='medium' label='PIPELINES' className='margin-bottom-15' />
      <List className={classes.root}>
        {pipelines.map(pipelineItem => {
          return (
            <Pipeline
              key={pipelineItem.pipelineId}
              pipeline={pipelineItem}
              history={history}
              handleToggle={handleToggle}
              isChecked={checked.indexOf(pipelineItem.pipelineId) !== -1}
            />
          )
        })}
      </List>
    </div>
  )
}

const Pipeline = ({ pipeline, handleToggle, isChecked, history }) => {
  const { pipelineId, title, status, description, created } = pipeline
  const secondaryText = (
    <>
      {`created: ${new Date(created)}`} <br />
      {`description: ${description}`} <br />
      {status ? `status: ${status}` : null}
    </>
  )
  return (
    <ListItem>
      <ListItemText
        id={pipelineId}
        onClick={() => history.push(`/pipelines/${pipelineId}`)}
        primary={`${title} (${pipelineId})`}
        secondary={secondaryText}
      />
      <ListItemSecondaryAction>
        <IconButton
          color={!isChecked ? 'primary' : 'secondary'}
          aria-label='upload picture'
          onClick={handleToggle(pipelineId)}
          component='span'
        >
          {!isChecked
            ? <PlayArrowIcon />
            : <StopIcon />}
          {/* {<CheckCircleOutlineIcon />} */}
        </IconButton>
        {/* <Switch
          edge='end'
          onChange={handleToggle(pipelineId)}
          checked={isChecked}
          inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
        /> */}
      </ListItemSecondaryAction>
    </ListItem>
  )
}
