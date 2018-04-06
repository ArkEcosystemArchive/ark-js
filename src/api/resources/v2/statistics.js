import Base from '@/api/base'

export default class Statistics extends Base {
  blockchain () {
    return this.http.get('statistics/blockchain')
  }

  transactions () {
    return this.http.get('statistics/transactions')
  }

  blocks () {
    return this.http.get('statistics/blocks')
  }

  votes () {
    return this.http.get('statistics/votes')
  }

  unvotes () {
    return this.http.get('statistics/unvotes')
  }
}
