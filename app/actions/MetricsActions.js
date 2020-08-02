import axios from 'axios'

import { BASE_URL } from '../configs/constants'
import { isEmpty } from 'lodash'

const GET_PIPELINE_HISTORY = (pipelineId, instanceId) => `${BASE_URL}/pipelineoperation/${instanceId}/${pipelineId}/history`

export const getNumberOfRecordsProcessed = async ({ pipelineId, instanceId }) => {
  try {
    const res = await axios({
      method: 'get',
      url: GET_PIPELINE_HISTORY(pipelineId, instanceId)
    }
    ).catch(e => ({ data: [] }))
    if (isEmpty(res.data)) return []
    const sortedResponse = res.data.sort(function (a, b) {
      var x = a.timeStamp > b.timeStamp ? -1 : 1
      return x
    })
    const metrics = JSON.parse(!isEmpty(sortedResponse) && sortedResponse[0].metrics)
    const numberOfRecordsProcessed = metrics && metrics.counters['pipeline.batchOutputRecords.counter'].count
    console.log('NumberOfRecordsProcessed', numberOfRecordsProcessed)
    console.log(`get pipeline history attempted for pipelineId ${pipelineId}, response received`)
    return numberOfRecordsProcessed
  } catch (e) {
    console.error('[MetricsActions.getPipelineHistory] error:', e)
    return []
  }
}
