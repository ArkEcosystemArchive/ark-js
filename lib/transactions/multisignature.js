/** @module multisignature */

const crypto = require("./crypto.js")
const constants = require("../constants.js")
const slots = require("../time/slots.js")

/**
 * @static
 * @param {Transaction} trs
 * @param {string} secret
 */
function signTransaction(trs, secret) {
	if (!trs || !secret) return false;

	let keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
	}

	const signature = crypto.sign(trs, keys);

	return signature;
}

/**
 * @static
 * @param {ECPair|string} secret
 * @param {ECPair|string} secondSecret
 * @param {*} keysgroup
 * @param {*} lifetime
 * @param {*} min
 */
function createMultisignature(secret, secondSecret, keysgroup, lifetime, min) {
	if (!secret || !keysgroup || !lifetime || !min) return false;

	let keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
	}

	const transaction = {
		type: 4,
		amount: 0,
		fee: constants.fees.multisignature,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			multisignature: {
				min,
				lifetime,
				keysgroup
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

/** Multisignature transaction support. */
module.exports = {
	createMultisignature,
	signTransaction
}
