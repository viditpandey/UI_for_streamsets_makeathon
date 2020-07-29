export function parsePipelineResponse (pipelinesResponse, type) {
  try {
    const pipelines = []
    pipelinesResponse.forEach(item => {
      for (const instanceId in item) {
        if (Object.prototype.hasOwnProperty.call(item, instanceId)) {
          const instancePipelines = type !== 'status' ? item[instanceId] : Object.values(item[instanceId])
          instancePipelines.forEach(pipeline => {
            pipelines.push({ ...pipeline, instanceId })
          })
        }
      }
    })
    return pipelines
  } catch (error) {
    console.log(`[PipelinesHelper.parsePipelineResponse] catch block error: ${error}`)
    return []
  }
}

export function parsePipelinesStatusResponse (response) {
  try {
    return parsePipelineResponse(response, 'status')
  } catch (error) {
    console.log(`[PipelinesHelper.parsePipelinesStatusResponse] catch block error: ${error}`)
    return []
  }
}
