export default class Transaction {
    constructor(http, builder) {
        this.http = http
        this.builder = builder
    }

    transaction(id) {
        return this.http.get('api/transactions/get', {
            "id": id
        })
    }

    transactions(parameters = {}) {
        return this.http.get('api/transactions', parameters)
    }

    unconfirmedTransaction(id) {
        return this.http.get('api/transactions/unconfirmed/get', {
            "id": id
        })
    }

    unconfirmedTransactions(parameters = {}) {
        return this.http.get('api/transactions/unconfirmed', parameters)
    }

    create(recipientId, amount, vendorField, secret, secondSecret = null) {
        let transaction = this.builder.transaction(recipientId, amount, vendorField, secret)

        return this.http.post('peer/transactions', {
            "transactions": [transaction]
        })
    }
}
