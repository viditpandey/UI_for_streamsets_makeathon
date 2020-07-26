
export function getProcessedData (metricsData, pipelineDetails, totalTime, processedDataMax) {
  const matchingPipeline = (metricsData.find(i => i.name === pipelineDetails.pipelineId))
  const rate = (matchingPipeline.res / totalTime).toFixed(2)

  if (rate > processedDataMax) processedDataMax = rate

  return {
    data: {
      name: pipelineDetails.pipelineTitle,
      YAxisData: rate
    },
    maxRate: processedDataMax
  }
}
