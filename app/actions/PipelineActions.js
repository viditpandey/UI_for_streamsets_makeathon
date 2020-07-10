import axios from 'axios'
import { BASE_URL, mockedPipelines } from '../configs/constants'

const GET_ALL_PIPELINES = BASE_URL + '/getpipelines'
const START_PIPELINE = BASE_URL + '/start'
const STOP_PIPELINE = BASE_URL + '/stop'
const PIPELINES_STATUS = BASE_URL + '/getpipelinestatus'

export const getPipelines = async () => {
  try {
    const res = await axios.get(GET_ALL_PIPELINES).catch(e => ({ data: mockedPipelines }))
    const pipelines = res.data
    console.log('GET: Here\'s the list of pipelines', pipelines)
    return pipelines
  } catch (e) {
    console.error('[PipelineActions.getPipelines] error:', e)
    return mockedPipelines
  }
}

export const startPipeline = async ({ pipelineId }) => {
  // const { pipelineId } = pipeline
  try {
    const res = await axios.post(START_PIPELINE, { pipelineId }).catch(e => ({ data: {} }))
    const pipelineStatus = res.data
    console.log(`start attempted for pipelineId ${pipelineId}, response received: ${JSON.stringify(pipelineStatus)}`)
    return pipelineStatus
  } catch (e) {
    console.error('[PipelineActions.startPipeline] error:', e)
    return {}
  }
}

export const stopPipeline = async ({ pipelineId }) => {
  // const { pipelineId } = pipeline
  try {
    const res = await axios.post(STOP_PIPELINE, { pipelineId }).catch(e => ({ data: {} }))
    const pipelineStatus = res.data
    console.log(`stop attempted for pipelineId ${pipelineId}, response received: ${JSON.stringify(pipelineStatus)}`)
    return pipelineStatus
  } catch (e) {
    console.error('[PipelineActions.stopPipeline] error:', e)
    return {}
  }
}

export const getPipelinesStatus = async () => {
  try {
    const res = await axios.get(PIPELINES_STATUS).catch(e => ({ data: mockedPipelines.map(i => ({ ...i, status: 'STARTED' })) }))
    const pipelinesStatus = Object.values(res.data)
    console.log(`fetched latest status for ${pipelinesStatus.length} pipelines`)
    return pipelinesStatus
  } catch (error) {
    console.error('[PipelineActions.getPipelinesStatus] error:', error)
    return []
  }
}
