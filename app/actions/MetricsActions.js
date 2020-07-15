import axios from 'axios'

import { BASE_URL } from '../configs/constants'

const GET_PIPELINE_HISTORY = pipelineId => `${BASE_URL}/pipelineoperation/${pipelineId}/history`

export const getNumberOfRecordsProcessed = async ({ pipelineId }) => {
  try {
    const res = await axios({
      method: 'get',
      url: GET_PIPELINE_HISTORY(pipelineId)
    }
    ).catch(e => ({ data: {} }))
    const sortedResponse = res.data.sort(function (a, b) {
      var x = a.timeStamp > b.timeStamp ? -1 : 1
      return x
    })
    const metrics = JSON.parse(sortedResponse && sortedResponse[0].metrics)
    console.log('--------', metrics)
    const numberOfRecordsProcessed = metrics && metrics.counters['pipeline.batchOutputRecords.counter'].count
    console.log('NumberOfRecordsProcessed', numberOfRecordsProcessed)
    console.log(`get pipeline history attempted for pipelineId ${pipelineId}, response received`)
    return numberOfRecordsProcessed
  } catch (e) {
    console.error('[MetricsActions.getPipelineHistory] error:', e)
    return {}
  }
}
