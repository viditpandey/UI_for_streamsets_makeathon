import axios from 'axios'

import { BASE_URL, mockedPipelines } from '../configs/constants' // eslint-disable-line
import { parsePipelineResponse, parsePipelinesStatusResponse } from '../helper/PipelineHelpers'

const GET_ALL_PIPELINES = BASE_URL + '/getpipelines'
const GET_AVAILABLE_PIPELINES = BASE_URL + '/getAvailablePipelines'
const PIPELINE_ACTION = BASE_URL + '/pipelineaction'
const PIPELINES_STATUS = BASE_URL + '/getpipelinestatus'

export const getPipelines = async () => {
  try {
    const res = await axios.get(GET_ALL_PIPELINES)
      .catch(e => { throw (e) })
    const pipelines = parsePipelineResponse(res.data)
    console.log('GET: Here\'s the list of pipelines', pipelines)
    return pipelines
  } catch (e) {
    console.error('[PipelineActions.getPipelines] error:', e)
    throw e
  }
}

export const getAvailablePipelines = async () => {
  try {
    const res = await axios.get(GET_AVAILABLE_PIPELINES)
      .catch(e => { throw (e) })
    const pipelines = parsePipelineResponse(res.data)
    console.log('GET: Here\'s the list of available pipelines (not part of any topology yet)', pipelines)
    return pipelines
  } catch (e) {
    console.error('[PipelineActions.getAvailablePipelines] error:', e)
    throw e
  }
}

export const startPipeline = async ({ pipelineId, instanceId }) => {
  try {
    const res = await axios({
      method: 'post',
      url: PIPELINE_ACTION,
      data: {
        pipelineId,
        action: 'start',
        instanceId,
        rev: 0
      }
    }
    ).catch(e => { throw (e) })
    const pipelineStatus = res.data
    console.log(`start attempted for pipelineId ${pipelineId}, response received: ${JSON.stringify(pipelineStatus)}`)
    return pipelineStatus
  } catch (e) {
    console.error('[PipelineActions.startPipeline] error:', e)
    throw e
  }
}

export const stopPipeline = async ({ pipelineId, instanceId }) => {
  try {
    const res = await axios.post(PIPELINE_ACTION, {
      pipelineId,
      action: 'stop',
      instanceId,
      rev: 0
    }).catch(e => { throw e })
    const pipelineStatus = res.data
    console.log(`stop attempted for pipelineId ${pipelineId}, response received: ${JSON.stringify(pipelineStatus)}`)
    return pipelineStatus
  } catch (e) {
    console.error('[PipelineActions.stopPipeline] error:', e)
    throw e
  }
}

export const getPipelinesStatus = async () => {
  try {
    const res = await axios.get(PIPELINES_STATUS).catch(e => ({ data: [] }))
    const pipelinesStatus = parsePipelinesStatusResponse(res.data)
    console.log(`fetched latest status for ${pipelinesStatus.length} pipelines`)
    return pipelinesStatus
  } catch (error) {
    console.error('[PipelineActions.getPipelinesStatus] error:', error)
    return []
  }
}
