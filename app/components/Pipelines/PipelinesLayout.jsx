import 'regenerator-runtime/runtime.js'

import IconButton from '@material-ui/core/IconButton'
import ListItemWrapper from '../Shared/List/ListItemWrapper'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import React, { useState, useEffect, useContext } from 'react'
import StopIcon from '@material-ui/icons/Stop'

import { AppBarContext } from '../Base/Home'
import { getPipelines, startPipeline, stopPipeline, getPipelinesStatus } from '../../actions/PipelineActions'
import { useInterval } from '../../helper/useInterval'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export default function PipelinesLayout () {
  const { setAppTitle } = useContext(AppBarContext)

  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()

  const [checked, setChecked] = useState([])
  const [pipelines, setPipelines] = useState([])

  useEffect(() => {
    setAppTitle({ text: 'PIPELINES' })
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

      <ListItemWrapper
        items={pipelines}
        getKey={item => item.pipelineId}
        itemClick={item => history.push(`/pipelines/${item.pipelineId}`)}
        collapsedText={item => returnSecondaryText(item)}
        getPrimaryText={item => `${item.title} (${item.pipelineId})`}
        secondaryText={item => item.status ? <>{`status: ${item.status}`}</> : null}
        secondaryActionButton={item => {
          const isChecked = checked.indexOf(item.pipelineId) !== -1
          return (
            <IconButton
              aria-label='start/stop pipeline'
              onClick={handleToggle(item.pipelineId)}
              component='span'
            >
              {!isChecked
                ? <PlayArrowIcon style={{ color: '#077d40' }} />
                : <StopIcon />}
            </IconButton>
          )
        }}
      />
    </div>
  )
}

const returnSecondaryText = item => {
  const { created, description, status } = item
  return (
    <>
      {`created: ${new Date(created)}`} <br />
      {`description: ${description}`} <br />
      {status ? `status: ${status}` : null}
    </>
  )
}
