import { apiHelper } from '../../utils/helpers'

export default {
  search(name) {
    const searchParams = new URLSearchParams(name)
    return apiHelper.get(`/member/tag?${searchParams.toString()}`)
  },
  get() {
    return apiHelper.get(`/member/tags`)
  },
}