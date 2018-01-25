export default class Delegate {
    constructor(http, builder) {
        this.http = http
        this.builder = builder
    }

    count() {
        return this.http.get('api/delegates/count')
    }

    search(query, parameters = {}) {
        return this.http.get('api/delegates/search', Object.assign({
            "q": query
        }, parameters))
    }

    voters(publicKey) {
        return this.http.get('api/delegates/voters', {
            "publicKey": publicKey
        })
    }

    delegate(parameters = {}) {
        return this.http.get('api/delegates/get', parameters)
    }

    delegates(parameters = {}) {
        return this.http.get('api/delegates', parameters)
    }

    fee() {
        return this.http.get('api/delegates/fee')
    }

    forgedByAccount(generatorPublicKey) {
        return this.http.get('api/delegates/forging/getForgedByAccount', {
            "generatorPublicKey": generatorPublicKey
        })
    }

    create(secret, username, secondSecret = null) {
        let transaction = this.builder.delegate(secret, username)

        return this.http.post('peer/transactions', {
            "transactions": [transaction]
        })
    }

    nextForgers() {
        return this.http.get('api/delegates/getNextForgers')
    }

    enableForging(secret, parameters = {}) {
        return this.http.post('api/delegates/forging/enable', Object.assign({
            "secret": secret
        }, parameters))
    }

    disableForging(secret, parameters = {}) {
        return this.http.post('api/delegates/forging/disable', Object.assign({
            "secret": secret
        }, parameters))
    }

    forgingStatus(publicKey, parameters = {}) {
        return this.http.get('api/delegates/forging/status', Object.assign({
            "publicKey": publicKey
        }, parameters))
    }
}
