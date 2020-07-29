import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import ListItemWrapper from '../Shared/List/ListItemWrapper'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import React, { useState, useEffect, useContext } from 'react'
import ReplayIcon from '@material-ui/icons/Replay'
import StopIcon from '@material-ui/icons/Stop'
import Tooltip from '@material-ui/core/Tooltip'

import { AppBarContext } from '../Base/Home'
import {
  getPipelines, startPipeline,
  stopPipeline, getPipelinesStatus
} from '../../actions/PipelineActions'
import { generateRandomColor } from '../../helper/PipelineHelpers'
import { sortBy, uniq } from 'lodash'
import { useInterval } from '../../helper/useInterval'
import { useSnackbar } from 'notistack'

export default function PipelinesLayout () {
  const { setAppTitle } = useContext(AppBarContext)
  const { enqueueSnackbar } = useSnackbar()

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
  const [instanceIdsWithColor, setInstanceIds] = useState({})

  useEffect(() => {
    setAppTitle({ text: 'PIPELINES', currentPage: 'PipelinesLayout' })
    async function fetchPipelines () {
      const res = await axiosHandler({ method: getPipelines, errorMessage: 'pipelines fetch failed', infoMessage: 'pipelines fetched succesfully' })
      const allInstanceIds = uniq(res.map(i => i.instanceId))
      setInstanceIds(generateRandomColor(allInstanceIds))
      res && setPipelines(res) // after this set status of checked pipelines to on, i.e, insert their pipelineId in checked var
    }
    fetchPipelines()
  }, [])

  useInterval(async () => {
    const latestStatus = await getPipelinesStatus()
    const updatedPipelines = []
    latestStatus.length && latestStatus.forEach(p => {
      const { status, pipelineId, instanceId } = p
      updatedPipelines.push(updatePipeline({ pipelineId, property: 'status', newVal: status, instanceId }))
    })
    latestStatus.length && setPipelines(updatedPipelines)
  }, pipelines.length ? 3000 : null)

  const updatePipeline = ({ pipelineId, property, newVal, instanceId }) => {
    let updatedPipeline = []
    pipelines.forEach(prevPipeline => {
      if (prevPipeline.pipelineId === pipelineId && prevPipeline.instanceId === instanceId) {
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
    let tooltip = 'Perform action'
    switch (item.status) {
      case 'STARTING':
      case 'RETRY':
        button = <CircularProgress />
        tooltip = 'pipeline in progress'
        break
      case 'RUNNING':
        button = <StopIcon style={{ color: '#CF142B' }} />
        tooltip = 'stop pipeline'
        break
      case 'FINISHED':
        button = <ReplayIcon />
        tooltip = 'restart pipeline'
        break
      case 'EDITED':
      case 'STOPPED':
        button = <PlayArrowIcon style={{ color: '#077d40' }} />
        tooltip = 'start pipeline'
        break

      default:
        break
    }
    return (
      <Tooltip title={tooltip}>
        <IconButton
          aria-label='start/stop pipeline'
          id='pipeline-action-button'
          onClick={handlePipelineActionButtonClick(item.pipelineId)}
          component='span'
        >
          {button}
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <div id='pipelines-layout'>

      <ListItemWrapper
        items={sortBy(pipelines, ['title', 'pipelineId'])}
        getKey={item => item.pipelineId}
        itemClick={() => {}}
        collapsedText={item => returnSecondaryText(item)}
        // getPrimaryText={item => `${item.title} (${item.pipelineId})`}
        getPrimaryText={item => <div style={{ color: instanceIdsWithColor[item.instanceId] }}>{`${item.title} (${item.pipelineId})`}</div>}
        secondaryText={item => getSecondaryText(item, instanceIdsWithColor)}
        secondaryActionButton={getPipelineActionButton}
        listId='pipelines-layout-children'
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

const getSecondaryText = (item, instanceIdsWithColor) => {
  const { status, instanceId } = item
  return (
    <>
      <span style={{ color: instanceIdsWithColor[instanceId] }}>{`Streamset instance: ${instanceId}`} </span><br />
      {status ? `status: ${status}` : '...'}
    </>
  )
}
