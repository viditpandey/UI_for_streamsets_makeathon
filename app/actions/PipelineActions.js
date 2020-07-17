import axios from 'axios'

import { BASE_URL, mockedPipelines } from '../configs/constants'

const GET_ALL_PIPELINES = BASE_URL + '/getpipelines'
const PIPELINE_ACTION = BASE_URL + '/pipelineaction'
const PIPELINES_STATUS = BASE_URL + '/getpipelinestatus'

export const getPipelines = async () => {
  try {
    const res = await axios.get(GET_ALL_PIPELINES)
      .catch(e => { throw (e) })
    const pipelines = res.data
    console.log('mockedPipelines', mockedPipelines)
    console.log('GET: Here\'s the list of pipelines', pipelines)
    return pipelines
  } catch (e) {
    console.error('[PipelineActions.getPipelines] error:', e)
    // return mockedPipelines
    throw e
  }
}

export const startPipeline = async ({ pipelineId }) => {
  try {
    const res = await axios({
      method: 'post',
      url: PIPELINE_ACTION,
      data: {
        pipelineId: pipelineId,
        action: 'start',
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

export const stopPipeline = async ({ pipelineId }) => {
  try {
    const res = await axios.post(PIPELINE_ACTION, {
      pipelineId,
      action: 'stop',
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
    const pipelinesStatus = Object.values(res.data)
    console.log(`fetched latest status for ${pipelinesStatus.length} pipelines`)
    return pipelinesStatus
  } catch (error) {
    console.error('[PipelineActions.getPipelinesStatus] error:', error)
    return []
  }
}
