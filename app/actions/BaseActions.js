import axios from 'axios'

const GET_BACKEND_URL = '/backend_base_url'

export async function getBackendUrl () {
  try {
    const res = await axios.get(GET_BACKEND_URL).catch(e => { throw (e) })
    return res.data
  } catch (error) {
    console.error('[BaseActions.getBackendUrl] error:', error)
    throw error
  }
}
