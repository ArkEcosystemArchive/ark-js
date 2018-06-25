/** @module multisignature */

var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

/**
 * @static
 * @param {Transaction} trs
 * @param {string} secret
 */
function signTransaction(trs, secret) {
	if (!trs || !secret) return false;

	var keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
	}

	var signature = crypto.sign(trs, keys);

	return signature;
}

/**
 * @static
 * @param {ECPair|string} secret
 * @param {ECPair|string} secondSecret
 * @param {*} keysgroup
 * @param {*} lifetime
 * @param {*} min
 * @param {number} [feeOverride]
 */
function createMultisignature(secret, secondSecret, keysgroup, lifetime, min, feeOverride) {
	if (typeof secret === 'undefined' || !keysgroup || !lifetime || !min) return false;

	var keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
	}

	if (feeOverride && !Number.isInteger(feeOverride)) {
		throw new Error('Not a valid fee')
	}

	var transaction = {
		type: 4,
		amount: 0,
		fee: (keysgroup.length + 1) * (feeOverride || constants.fees.multisignature),
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			multisignature: {
				min: min,
				lifetime: lifetime,
				keysgroup: keysgroup
			}
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
	createMultisignature : createMultisignature,
	signTransaction: signTransaction
}
