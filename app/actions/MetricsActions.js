// import axios from 'axios'

// import { BASE_URL } from '../configs/constants'

// const GET_PIPELINE_HISTORY = pipelineId => `${BASE_URL}/pipelineoperation/${pipelineId}/history`

// export const getPipelineHistory = async ({ pipelineId }) => {
//   try {
//     const res = await axios({
//       method: 'get',
//       url: GET_PIPELINE_HISTORY(pipelineId)
//     }
//     ).catch(e => ({ data: {} }))
//     const response = res.data
//     const sortedResponse = res.data.sort(function (a, b) {
//       var x = a.timeStamp > b.timeStamp ? -1 : 1
//       return x
//     })
//     console.log('--------', sortedResponse)
//     const metrics = JSON.parse(sortedResponse[0].metrics)
//     console.log('--------', metrics)
//     const numberOfRecordsProcessed = metrics.counters['pipeline.batchInputRecords.counter'].count
//     console.log('NumberOfRecordsProcessed', numberOfRecordsProcessed)
//     const endTime = metrics.gauges['RuntimeStatsGauge.gauge'].value.timeOfLastReceivedRecord
//     console.log('endTime', endTime)
//     const startTime = metrics.gauges['runner.0.gauge'].value.stageStartTime
//     console.log('startTime', startTime)
//     const DPR = Number(numberOfRecordsProcessed) / (Number(endTime) - Number(startTime))
//     console.log('=========DPR', DPR)
//     console.log(`get pipeline history attempted for pipelineId ${pipelineId}, response received`)
//     return response
//   } catch (e) {
//     console.error('[MetricsActions.getPipelineHistory] error:', e)
//     return {}
//   }
// }
