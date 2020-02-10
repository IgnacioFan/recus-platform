import moment from 'moment'

export const timeFromFilter = {
  filters: {
    timeFrom(datetime) {
      return datetime ? moment(datetime).locale("zh-tw").format('llll') : '-'
    }
  }
}

export const fromNowFilter = {
  filters: {
    fromNow(datetime) {
      return datetime ? moment(datetime).fromNow() : '-'
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