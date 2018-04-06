import Base from '@/api/base'

export default class Wallets extends Base {
  all (query) {
    return this.http.get('accounts/getAllAccounts', query)
  }

  get (address) {
    return this.http.get('accounts', {address})
  }

  count () {
    return this.http.get('accounts/count')
  }

  delegates (address) {
    return this.http.get('accounts/delegates', {address})
  }

  fee () {
    return this.http.get('accounts/delegates/fee')
  }

  balance (address) {
    return this.http.get('accounts/getBalance', {address})
  }

  publicKey (address) {
    return this.http.get('accounts/getPublicKey', {address})
  }

  top (query) {
    return this.http.get('accounts/top', query)
  }
}
