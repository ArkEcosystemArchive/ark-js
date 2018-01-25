export default class Builder {
    constructor(nethash) {
        ark.crypto.setNetworkVersion({
            '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988': 0x17,
            '578e820911f24e039733b45e4882b73e301f813a0d2c31330dafda84534ffa23': 0x1E,
            '313ea34c8eb705f79e7bc298b788417ff3f7116c9596f5c9875e769ee2f4ede1': 0x2D
        }[nethash])
    }

    delegate() {
        if (!secondSecret) {
            return ark.delegate.createDelegate(secret, username)
        } else {
            return ark.delegate.createDelegate(secret, username, secondSecret)
        }
    }

    multisignature() {
        return ark.transaction.createMultisignature(secret, secondSecret, keysgroup, lifetime, min)
    }

    signature(secret, secondSecret) {
        return ark.signature.createSignature(secret, secondSecret)
    }

    transaction(recipientId, amount, vendorField, secret, secondSecret = null) {
        if (!secondSecret) {
            return ark.transaction.createTransaction(recipientId, amount, vendorField, secret)
        } else {
            return ark.transaction.createTransaction(recipientId, amount, vendorField, secret, secondSecret)
        }
    }

    vote(secret, delegate, secondSecret = null) {
        if (!secondSecret) {
            return ark.vote.createVote(secret, ['+' + delegate])
        } else {
            return ark.vote.createVote(secret, ['+' + delegate], secondSecret)
        }
    }

    unvote(secret, delegate, secondSecret = null) {
        if (!secondSecret) {
            return ark.vote.createVote(secret, ['-' + delegate])
        } else {
            return ark.vote.createVote(secret, ['-' + delegate], secondSecret)
        }
    }
}
