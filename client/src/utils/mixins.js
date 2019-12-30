import moment from 'moment'

export const timeFromFilter = {
  filters: {
    timeFrom(datetime) {
      return datetime ? moment(datetime).format('lll') : '-'
    }
  }
}

export const emptyImageFilter = {
  filters: {
    emptyImage(src) {
      return src || 'https://via.placeholder.com/350x220/DFDFDF?text=No+Image'
    }
  }
}