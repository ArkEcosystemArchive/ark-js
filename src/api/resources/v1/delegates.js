import Base from '@/api/base'

export default class Delegates extends Base {
  all (query) {
    return this.http.get('delegates', query)
  }

  get (id) {
    return this.http.get('delegates/get', {id})
  }

  count () {
    return this.http.get('delegates/count')
  }

  fee () {
    return this.http.get('delegates/fee')
  }

  forged (generatorPublicKey) {
    return this.http.get('delegates/forging/getForgedByAccount', {generatorPublicKey})
  }

  search (query) {
    return this.http.get('delegates/search', query)
  }

  voters (publicKey) {
    return this.http.get('delegates/voters', {publicKey})
  }
}
