export default class Transport {
    constructor(http) {
        this.http = http
    }

    list() {
        return this.http.get('peer/list')
    }

    blocksCommon(ids) {
        return this.http.get('peer/blocks/common', {
            "ids": ','.join(ids)
        })
    }

    block(id) {
        return this.http.get('peer/block', {
            "id": id
        })
    }

    blocks() {
        return this.http.get('peer/blocks')
    }

    createBlock(block) {
        return this.http.post('peer/blocks', {
            "block": block
        })
    }

    transactions() {
        return this.http.get('peer/transactions')
    }

    transactionsFromIds(ids) {
        return this.http.get('peer/transactionsFromIds', {
            "ids": ','.join(ids)
        })
    }

    createTransaction(transaction) {
        return this.http.post('peer/transactions', {
            "transactions": [transaction]
        })
    }

    height() {
        return this.http.get('peer/height')
    }

    status() {
        return this.http.get('peer/status')
    }
}
