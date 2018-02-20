/** @module signature */

var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

/**
 * @param {string} secondSecret
 * @returns {{publicKey: ECPair}}
 */
function newSignature(secondSecret) {
	var keys = crypto.getKeys(secondSecret);

	var signature = {
		publicKey: keys.publicKey
	};

	return signature;
}

/**
 * @static
 * @param {ECPair|string} secret
 * @param {string} secondSecret
 * @param {number} [feeOverride]
 * @returns {Transaction}
 */
function createSignature(secret, secondSecret, feeOverride) {
	if (!secret || !secondSecret) return false;

	var keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
	}

	if (!keys.publicKey) {
    throw new Error("Invalid public key");
	}

	if (feeOverride && !Number.isInteger(feeOverride)) {
		throw new Error('Not a valid fee')
	}

	var signature = newSignature(secondSecret);
	var transaction = {
		type: 1,
		amount: 0,
		fee: feeOverride || constants.fees.secondsignature,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			signature: signature
		}
	};

	crypto.sign(transaction, keys);
	transaction.id = crypto.getId(transaction);

	return transaction;
}

module.exports = {
	createSignature: createSignature
}
