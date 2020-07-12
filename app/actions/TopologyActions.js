import axios from 'axios'
import { BASE_URL, mockedTopology } from '../configs/constants'

const CREATE_TOPOLOGY = BASE_URL + '/createTopology'
const GET_TOPOLOGY_BY_ID = topologyId => `${BASE_URL}/getTopology/${topologyId}`

export const createTopology = async (formData) => {
  console.log('formData:', formData)
  try {
    const topologyFields = formData.finalTreeData
    const res = await axios({
      method: 'post',
      url: CREATE_TOPOLOGY,
      data: {
        topologyFields
      }
    }
    ).catch(e => ({ data: {} }))
    const response = res.data
    console.log(`create topology attempted for topologyId ${formData.topologyId}, response received: ${JSON.stringify(response)}`)
    return response
  } catch (e) {
    console.error('[TopologyActions.createTopology] error:', e)
    return {}
  }
}

export const getTopologyById = async ({ topologyId }) => {
  console.log('fetching topology details for topology id: ', topologyId)
  try {
    const res = await axios.get(GET_TOPOLOGY_BY_ID(topologyId)).catch(e => ({ data: mockedTopology }))
    // const res = await axios.get(GET_TOPOLOGY_BY_ID(topologyId)).catch(e => ({ data: {} }))
    const response = res.data
    console.log(`Fetched topology data for id: ${topologyId}, data received: ${response}`)
    return response
  } catch (error) {
    console.log('fetching topology data by topoligy ID failed -> error', error)
    return {}
  }
}
