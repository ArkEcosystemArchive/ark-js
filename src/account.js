export default class Account {
    constructor(http) {
        this.http = http
    }

    balance(address) {
        return this.http.get('api/accounts/getBalance', {
            "address": address
        })
    }

    publickey(address) {
        return this.http.get('api/accounts/getPublickey', {
            "address": address
        })
    }

    delegates(address) {
        return this.http.get('api/accounts/delegates', {
            "address": address
        })
    }

    delegatesFee(address) {
        return this.http.get('api/accounts/delegates/fee', {
            "address": address
        })
    }

    vote(secret, publicKey, secondSecret) {
        return this.http.put('api/accounts/delegates', {
            "secret": secret,
            "publicKey": publicKey,
            "secondSecret": secondSecret
        })
    }

    account(address) {
        return this.http.get('api/accounts', {
            "address": address
        })
    }

    accounts() {
        return this.http.get('api/accounts/getAllAccounts')
    }

    top() {
        return this.http.get('api/accounts/top')
    }

    count() {
        return this.http.get('api/accounts/count')
    }
}
