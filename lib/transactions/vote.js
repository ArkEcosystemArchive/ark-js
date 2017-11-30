/** @module vote */

const crypto = require("./crypto.js")
const constants = require("../constants.js")
const slots = require("../time/slots.js")

/**
 * @static
 * @param {ECPair|string} secret
 * @param {Array} delegates
 * @param {ECPair|string} [secondSecret]
 * @returns {Transaction}
 */
function createVote(secret, delegates, secondSecret) {
	if (!secret || !Array.isArray(delegates)) return;

	let keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
  }

  if (!keys.publicKey) {
    throw new Error("Invalid public key");
  }

	const transaction = {
		type: 3,
		amount: 0,
		fee: constants.fees.vote,
		recipientId: crypto.getAddress(keys.publicKey),
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			votes: delegates
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
	createVote
}
