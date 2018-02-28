export default class Block {
  constructor (http) {
    this.http = http
  }

  block (id) {
    return this.http.get('api/blocks/get', {
      'id': id
    })
  }

  blocks (parameters = {}) {
    return this.http.get('api/blocks', parameters)
  }

  epoch () {
    return this.http.get('api/blocks/getEpoch')
  }

  height () {
    return this.http.get('api/blocks/getHeight')
  }

  nethash () {
    return this.http.get('api/blocks/getNethash')
  }

  fee () {
    return this.http.get('api/blocks/getFee')
  }

  fees () {
    return this.http.get('api/blocks/getFees')
  }

  milestone () {
    return this.http.get('api/blocks/getMilestone')
  }

  reward () {
    return this.http.get('api/blocks/getReward')
  }

  supply () {
    return this.http.get('api/blocks/getSupply')
  }

  status () {
    return this.http.get('api/blocks/getStatus')
  }
}
