import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import ListItemWrapper from '../Shared/List/ListItemWrapper'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import React, { useState, useEffect, useContext } from 'react'
import ReplayIcon from '@material-ui/icons/Replay'
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

  const axiosHandler = async ({ method = () => {}, methodParams, errorMessage = 'Action failed', successMessage, infoMessage }) => {
    let failed = false
    const res = await method(methodParams)
      .catch(e => {
        failed = true
        enqueueSnackbar(errorMessage, { variant: 'error' })
        return null
      })
    !failed && successMessage && enqueueSnackbar(successMessage, { variant: 'success' })
    !failed && infoMessage && enqueueSnackbar(infoMessage, { variant: 'info' })
    return res
  }

  const [pipelines, setPipelines] = useState([])

  useEffect(() => {
    setAppTitle({ text: 'PIPELINES' })
    async function fetchPipelines () {
      const res = await axiosHandler({ method: getPipelines, errorMessage: 'pipelines fetch failed', infoMessage: 'pipelines fetched succesfully' })
      res && setPipelines(res) // after this set status of checked pipelines to on, i.e, insert their pipelineId in checked var
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
  }, pipelines.length ? 3000 : null)

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

  const shouldStartPipeline = pipelineId => {
    const data = pipelines.find(p => p.pipelineId === pipelineId)
    if (data) {
      if (!data.status) return true // if status is undefined, attempt to start pipeline
      return ['RETRY', 'FINISHED', 'EDITED', 'STOPPED'].indexOf(data.status)
    } else return false
  }

  const handlePipelineActionButtonClick = (pipelineId) => async () => {
    if (shouldStartPipeline(pipelineId)) {
      const res = await axiosHandler({
        method: startPipeline,
        methodParams: { pipelineId },
        errorMessage: 'Pipeline start failed',
        successMessage: 'pipeline started succesfully'
      })
      res && updatePipeline({ pipelineId: res.pipelineId, property: 'status', newVal: res.status })
    } else {
      const res = await axiosHandler({
        method: stopPipeline,
        methodParams: { pipelineId },
        errorMessage: 'Pipeline stop failed',
        successMessage: 'Pipeline stopped succesfully'
      })
      res && updatePipeline({ pipelineId: res.pipelineId, property: 'status', newVal: res.status })
    }
  }

  const getPipelineActionButton = item => {
    let button = <PlayArrowIcon style={{ color: '#077d40' }} />
    switch (item.status) {
      case 'STARTING':
      case 'RETRY':
        button = <CircularProgress />
        break
      case 'RUNNING':
        button = <StopIcon style={{ color: '#CF142B' }} />
        break
      case 'FINISHED':
        button = <ReplayIcon />
        break
      case 'EDITED':
      case 'STOPPED':
        button = <PlayArrowIcon style={{ color: '#077d40' }} />
        break

      default:
        break
    }
    return (
      <IconButton
        aria-label='start/stop pipeline'
        onClick={handlePipelineActionButtonClick(item.pipelineId)}
        component='span'
      >
        {button}
      </IconButton>
    )
  }

  return (
    <div>

      <ListItemWrapper
        items={pipelines}
        getKey={item => item.pipelineId}
        itemClick={item => history.push(`/pipelines/${item.pipelineId}`)}
        collapsedText={item => returnSecondaryText(item)}
        getPrimaryText={item => `${item.title} (${item.pipelineId})`}
        secondaryText={item => <>{`status: ${item.status || '...'}`}</>}
        secondaryActionButton={getPipelineActionButton}
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
