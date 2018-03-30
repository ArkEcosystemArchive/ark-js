import Base from '@/api/base'

export default class Signatures extends Base {
  all () {
    return this.http.get('signatures')
  }
}
