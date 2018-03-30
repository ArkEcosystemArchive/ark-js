import Base from '@/api/base'

export default class MultiSignatures extends Base {
  all () {
    return this.http.get('multisignatures')
  }

  pending () {
    return this.http.get('multisignatures/pending')
  }

  wallets () {
    return this.http.get('multisignatures/wallets')
  }
}
