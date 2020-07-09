import axios from 'axios'
import { BASE_URL, mockedPipelines } from '../configs/constants'

const GET_ALL_PIPELINES = BASE_URL + '/rest/v1/pipelines?len=-1&orderBy=NAME&order=ASC'

export const getPipelines = async () => {
  try {
    const res = await axios.get(GET_ALL_PIPELINES).catch(e => ({ data: mockedPipelines }))
    const pipelines = res.data
    console.log('GET: Here\'s the list of pipelines', pipelines)

    return pipelines
  } catch (e) {
    console.error('error:', e)
    return mockedPipelines
  }
}
