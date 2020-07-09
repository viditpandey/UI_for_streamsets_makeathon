import 'regenerator-runtime/runtime.js'
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Switch from '@material-ui/core/Switch'
import { getPipelines } from '../actions/PipelineActions'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}))

export default function PipelinesLayout () {
  const classes = useStyles()
  const [checked, setChecked] = useState([])
  const [pipelines, setPipelines] = useState([])

  useEffect(() => {
    async function fetchPipelines () {
      const res = await getPipelines()
      setPipelines(res) // after this set status of checked pipelines to on, i.e, insert their pipelineId in checked var
    }
    fetchPipelines()
  }, [])

  const handleToggle = (pipelineId) => () => {
    const currentIndex = checked.indexOf(pipelineId)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(pipelineId)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  return (
    <List subheader={<ListSubheader>Pipelines</ListSubheader>} className={classes.root}>
      {pipelines.map(pipelineItem => {
        return (
          <Pipeline
            key={pipelineItem.pipelineId}
            pipeline={pipelineItem}
            handleToggle={handleToggle}
            isChecked={checked.indexOf(pipelineItem.pipelineId) !== -1}
          />
        )
      })}
    </List>
  )
}

const Pipeline = ({ pipeline, handleToggle, isChecked }) => {
  const { pipelineId, title } = pipeline
  return (
    <ListItem>
      <ListItemText id={pipelineId} primary={title} />
      <ListItemSecondaryAction>
        <Switch
          edge='end'
          onChange={handleToggle(pipelineId)}
          checked={isChecked}
          inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  )
}
