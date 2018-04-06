import Base from '@/api/base'

export default class Node extends Base {
  status () {
    return this.http.get('node/status')
  }

  syncing () {
    return this.http.get('node/syncing')
  }

  configuration () {
    return this.http.get('node/configuration')
  }
}
