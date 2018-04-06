import Base from '@/api/base'

export default class Blocks extends Base {
  all (query) {
    return this.http.get('blocks', query)
  }

  get (id) {
    return this.http.get('blocks/get', {id})
  }

  epoch () {
    return this.http.get('blocks/getEpoch')
  }

  fee () {
    return this.http.get('blocks/getFee')
  }

  fees () {
    return this.http.get('blocks/getFees')
  }

  height () {
    return this.http.get('blocks/getHeight')
  }

  milestone () {
    return this.http.get('blocks/getMilestone')
  }

  nethash () {
    return this.http.get('blocks/getNethash')
  }

  reward () {
    return this.http.get('blocks/getReward')
  }

  status () {
    return this.http.get('blocks/getStatus')
  }

  supply () {
    return this.http.get('blocks/getSupply')
  }
}
