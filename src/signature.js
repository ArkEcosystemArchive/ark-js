export default class Signature {
    constructor(http, builder) {
        this.http = http
        this.builder = builder
    }

    fee() {
        return this.http.get('api/signatures/fee')
    }

    create(secret, secondSecret) {
        let transaction = ark.signature.createSignature(secret, secondSecret)

        return this.http.post('peer/transactions', {
            "transactions": [transaction]
        })
    }
}
