import Base from '@/api/base'

export default class Signatures extends Base {
  fee () {
    return this.http.get('signatures/fee')
  }
}
