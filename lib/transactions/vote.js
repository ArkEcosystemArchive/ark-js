var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
		slots = require("../time/slots.js");

/**
 * @typedef Transaction
 * @property {number} amount
 * @property {object} asset
 * @property {string} id
 * @property {number} fee
 * @property {string} recipientId
 * @property {*} senderPublicKey
 * @property {string} signature
 * @property {string} [signSignature=]
 * @property {number} timestamp
 * @property {number} type
 * @property {string} [vendorField]
 */

/**
 *
 * @param {*} secret
 * @param {Array} delegates
 * @param {*} [secondSecret=]
 * @returns {Transaction}
 */
function createVote(secret, delegates, secondSecret) {
	if (!secret || !Array.isArray(delegates)) return;

	var keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
  }

  if (!keys.publicKey) {
    throw new Error("Invalid public key");
  }

	var transaction = {
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
		var secondKeys = secondSecret;
		if (!crypto.isECPair(secondSecret)) {
			secondKeys = crypto.getKeys(secondSecret);
		}
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);

	return transaction;
}

module.exports = {
	createVote: createVote
}
