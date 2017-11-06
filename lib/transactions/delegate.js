const crypto = require("./crypto.js")
const constants = require("../constants.js")
const slots = require("../time/slots.js")

function createDelegate(secret, username, secondSecret) {
	if (!secret || !username) return false;

	let keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
	}

	if (!keys.publicKey) {
		throw new Error("Invalid public key");
	}

	const transaction = {
		type: 2,
		amount: 0,
		fee: constants.fees.delegate,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			delegate: {
				username,
				publicKey: keys.publicKey
			}
		}
	};

	crypto.sign(transaction, keys);

	if (secondSecret) {
		let secondKeys = secondSecret;
		if (!crypto.isECPair(secondSecret)) {
			secondKeys = crypto.getKeys(secondSecret);
		}
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

module.exports = {
	createDelegate
}
