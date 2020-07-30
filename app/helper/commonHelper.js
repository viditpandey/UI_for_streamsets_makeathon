import moment from 'moment'

export function getViewableDateTime (dateObj) {
  try {
    return moment(dateObj).format('dddd, MMMM Do YYYY, h:mm:ss a')
  } catch (error) {
    return moment('gibberish').format('dddd, MMMM Do YYYY, h:mm:ss a')
  }
}
