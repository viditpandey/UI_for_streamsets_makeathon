import axios from 'axios'

import { BASE_URL, mockedTopology, mockedTopologies, mockedTopologyHistory } from '../configs/constants' // eslint-disable-line

const CREATE_TOPOLOGY = BASE_URL + '/createTopology'
const DELETE_TOPOLOGY = topologyId => `${BASE_URL}/deleteTopology/${topologyId}`
const GET_ALL_TOPOLOGIES = BASE_URL + '/getTopologies'
const GET_TOPOLOGY_BY_ID = topologyId => `${BASE_URL}/getTopology/${topologyId}`
const UPDATE_TOPOLOGY_ACTION = `${BASE_URL}/updateTopologyStatus`
const RESUME_TOPOLOGY = topologyId => `${BASE_URL}/resumeTopology/${topologyId}`
const START_TOPOLOGY = topologyId => `${BASE_URL}/startTopology/${topologyId}`
const VALIDATE_TOPOLOGY = topologyId => `${BASE_URL}/validateTopology/${topologyId}`
const GET_TOPOLOGY_HISTORY = topologyId => `${BASE_URL}/getTopologyHistory/${topologyId}`

export const createTopology = async (formData) => {
  console.log('createTopology, formdata:', formData)
  try {
    const topologyFields = formData.finalTreeData
    axios({
      method: 'post',
      url: CREATE_TOPOLOGY,
      data: { topologyFields }
    })
      .then(response => {
        console.log(`create topology attempted for topologyId ${formData.topologyId}, response received: ${JSON.stringify(response)}`)
        window.location = '/topologies'
        // return response
      })
      .catch(e => { throw e })
  } catch (e) {
    console.error('[TopologyActions.createTopology] error:', e)
    throw e
  }
}

export const startTopology = async ({ topologyId }) => {
  try {
    const res = await axios({
      method: 'post',
      url: START_TOPOLOGY(topologyId)
    }
    ).catch(e => { throw e })
    const response = res.data
    console.log(`start topology attempted for topologyId ${topologyId}, response received: ${JSON.stringify(response)}`)
    return response
  } catch (e) {
    console.error('[TopologyActions.startTopology] error:', e)
    throw e
  }
}

export const validateTopology = async ({ topologyId }) => {
  try {
    const res = await axios({
      method: 'get',
      url: VALIDATE_TOPOLOGY(topologyId)
    }
    ).catch(e => { throw e })
    const response = res.data
    console.log(`validate topology attempted for topologyId ${topologyId}, response received: ${JSON.stringify(response)}`)
    return response
  } catch (e) {
    console.error('[TopologyActions.validateTopology] error:', e)
    throw e
  }
}

export const stopTopology = async ({ topologyId, topologyItems }) => {
  try {
    const res = await axios({
      method: 'post',
      url: UPDATE_TOPOLOGY_ACTION,
      data: {
        topologyId: topologyId,
        action: 'STOP',
        pipelines: topologyItems.map(p => p.pipelineId)
      }
    }
    ).catch(e => { throw e })
    const response = res.data
    console.log(`stop topology attempted for topologyId ${topologyId}, response received`)
    return response
  } catch (e) {
    console.error('[TopologyActions.stopTopology] error:', e)
    throw e
  }
}

export const getTopologies = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: GET_ALL_TOPOLOGIES
    }
    ).catch(e => { throw (e) })
    const response = res.data
    console.log('get all topologies attempted , response received')
    return response
  } catch (e) {
    console.error('[TopologyActions.getTopologies] error:', e)
    throw e
    // return mockedTopologies
  }
}

export const getTopologyById = async ({ topologyId }) => {
  console.log('fetching topology details for topology id: ', topologyId)
  try {
    const res = await axios.get(GET_TOPOLOGY_BY_ID(topologyId)).catch(e => { throw (e) })
    const response = res.data
    return response
  } catch (e) {
    console.log('fetching topology data by topology ID failed -> error', e)
    throw e
    // return mockedTopology
  }
}

export const deleteTopology = async ({ topologyId }) => {
  try {
    const res = await axios({
      method: 'delete',
      url: DELETE_TOPOLOGY(topologyId)
    })
      .then(res => {
        if (res.status === 200) { window.location = '/topologies' }
        return res
      })
      .catch(e => { throw (e) })
    const response = res.data
    console.log(`delete topology attempted for topologyId ${topologyId}, response received: ${JSON.stringify(response)}`)
    return response
  } catch (e) {
    console.error('[TopologyActions.deleteTopology] error:', e)
    throw e
  }
}

export const pauseTopology = async ({ topologyId, topologyItems }) => {
  try {
    const res = await axios({
      method: 'post',
      url: UPDATE_TOPOLOGY_ACTION,
      data: {
        topologyId: topologyId,
        action: 'PAUSE',
        pipelines: topologyItems.map(p => p.pipelineId)
      }
    })
      .catch(e => { throw e })
    const response = res.data
    console.log(`pause topology attempted for topologyId ${topologyId}, response received`)
    return response
  } catch (e) {
    console.error('[TopologyActions.pauseTopology] error:', e)
    throw e
  }
}

export const toggleTopologyAlert = async ({ topologyId, topologyItems, alertStatus = true }) => {
  try {
    const res = await axios({
      method: 'post',
      url: UPDATE_TOPOLOGY_ACTION,
      data: {
        topologyId: topologyId,
        action: alertStatus ? 'ALERT_ON' : 'ALERT_OFF',
        pipelines: topologyItems.map(p => p.pipelineId)
      }
    })
      .catch(e => { throw e })
    const response = res.data
    console.log(`Toggle topology ${topologyId} alert to ${alertStatus}, response received`)
    return response
  } catch (e) {
    console.error('[TopologyActions.toggleTopologyAlert] error:', e)
    throw e
  }
}

export const resumeTopology = async ({ topologyId }) => {
  try {
    const res = await axios({
      method: 'put',
      url: RESUME_TOPOLOGY(topologyId)
    })
      .catch(e => { throw e })
    const response = res.data
    console.log(`resume topology attempted for topologyId ${topologyId}, response received`)
    return response
  } catch (e) {
    console.error('[TopologyActions.resumeTopology] error:', e)
    throw e
  }
}

export const getTopologyHistory = async ({ topologyId }) => {
  try {
    const res = await axios({
      method: 'get',
      url: GET_TOPOLOGY_HISTORY(topologyId)
    })
      .catch(e => { throw e })
    const response = res.data
    console.log(`get Topology History attempted for topologyId ${topologyId}, response received`)
    return response
  } catch (e) {
    console.error('[TopologyActions.getTopologyHistory] error:', e)
    throw e
    // return mockedTopologyHistory
  }
}
