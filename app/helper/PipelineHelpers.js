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

export function generateRandomColorByStrings (items) {
  const obj = {}
  items.forEach(i => { obj[i] = stringToColour(i) })
  return obj
}

function stringToColour (str) {
  try {
    var hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    var colour = '#'
    for (let i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF
      colour += ('00' + value.toString(16)).substr(-2)
    }
    return colour
  } catch (error) { return '#000000' }
}

export function getRandomColor () {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
