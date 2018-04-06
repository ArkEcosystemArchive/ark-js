import Base from '@/api/base'

export default class Loader extends Base {
  status () {
    return this.http.get('loader/autoconfigure')
  }

  syncing () {
    return this.http.get('loader/status')
  }

  configuration () {
    return this.http.get('loader/status/sync')
  }
}
