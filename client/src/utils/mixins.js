import moment from 'moment'

export const timeFromFilter = {
  filters: {
    timeFrom(datetime) {
      return datetime ? moment(datetime).format('lll') : '-'
    }
  }
}