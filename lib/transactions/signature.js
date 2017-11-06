const crypto = require("./crypto.js")
const constants = require("../constants.js")
const slots = require("../time/slots.js");

function newSignature(secondSecret) {
	const keys = crypto.getKeys(secondSecret);

	const signature = {
		publicKey: keys.publicKey
	};

	return signature;
}

function createSignature(secret, secondSecret) {
	if (!secret || !secondSecret) return false;

	let keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
	}

	if (!keys.publicKey) {
    throw new Error("Invalid public key");
  }

	const signature = newSignature(secondSecret);
	const transaction = {
		type: 1,
		amount: 0,
		fee: constants.fees.secondsignature,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			signature
		}
	};

	crypto.sign(transaction, keys);
	transaction.id = crypto.getId(transaction);

	return transaction;
}

module.exports = {
	createSignature
}
