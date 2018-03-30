import Base from '@/api/base'

export default class Loader extends Base {
  status () {
    return this.http.get('loader/status')
  }

  syncing () {
    return this.http.get('loader/syncing')
  }

  configuration () {
    return this.http.get('loader/configuration')
  }
}
