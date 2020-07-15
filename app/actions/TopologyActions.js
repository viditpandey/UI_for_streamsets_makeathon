import axios from 'axios'

import { BASE_URL, mockedTopology } from '../configs/constants'

const CREATE_TOPOLOGY = BASE_URL + '/createTopology'
const GET_ALL_TOPOLOGIES = BASE_URL + '/getTopologies'
const GET_TOPOLOGY_BY_ID = topologyId => `${BASE_URL}/getTopology/${topologyId}`
const START_TOPOLOGY = topologyId => `${BASE_URL}/startTopology/${topologyId}`
const STOP_TOPOLOGY = topologyId => `${BASE_URL}/stopTopology/${topologyId}`
const RESET_TOPOLOGY = topologyId => `${BASE_URL}/resetTopology/${topologyId}`
const VALIDATE_TOPOLOGY = topologyId => `${BASE_URL}/validateTopology/${topologyId}`

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
    ).then(res => {
      window.location = '/topologies'
    })
      .catch(e => ({ data: {} }))
    const response = res.data
    console.log(`create topology attempted for topologyId ${formData.topologyId}, response received: ${JSON.stringify(response)}`)
    return response
  } catch (e) {
    console.error('[TopologyActions.createTopology] error:', e)
    return {}
  }
}

export const resetTopology = async ({ topologyId }) => {
  try {
    const res = await axios({
      method: 'get',
      url: RESET_TOPOLOGY(topologyId)
    }
    ).catch(e => ({ data: {} }))
    const response = res.data
    console.log(`reset topology attempted for topologyId ${topologyId}, response received: ${JSON.stringify(response)}`)
    return response
  } catch (e) {
    console.error('[TopologyActions.resetTopology] error:', e)
    return {}
  }
}

export const startTopology = async ({ topologyId }) => {
  try {
    const res = await axios({
      method: 'post',
      url: START_TOPOLOGY(topologyId)
    }
    ).catch(e => ({ data: {} }))
    const response = res.data
    console.log(`start topology attempted for topologyId ${topologyId}, response received: ${JSON.stringify(response)}`)
    return response
  } catch (e) {
    console.error('[TopologyActions.startTopology] error:', e)
    return {}
  }
}

export const validateTopology = async ({ topologyId }) => {
  try {
    const res = await axios({
      method: 'get',
      url: VALIDATE_TOPOLOGY(topologyId)
    }
    ).catch(e => ({ data: {} }))
    const response = res.data
    console.log(`validate topology attempted for topologyId ${topologyId}, response received: ${JSON.stringify(response)}`)
    return response
  } catch (e) {
    console.error('[TopologyActions.validateTopology] error:', e)
    return {}
  }
}

export const stopTopology = async ({ topologyId }) => {
  try {
    const res = await axios({
      method: 'post',
      url: STOP_TOPOLOGY(topologyId)
    }
    ).catch(e => ({ data: {} }))
    const response = res.data
    console.log(`start topology attempted for topologyId ${topologyId}, response received: ${JSON.stringify(response)}`)
    return response
  } catch (e) {
    console.error('[TopologyActions.startTopology] error:', e)
    return {}
  }
}

export const getTopologies = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: GET_ALL_TOPOLOGIES
    }
    ).catch(e => { throw (e) })
    // ).catch(e => ({ data: [] }))
    const response = res.data
    console.log('get all topologies attempted , response received')
    return response
  } catch (e) {
    console.error('[TopologyActions.getTopologies] error:', e)
    throw e
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
    // return mockedTopology
  }
}
