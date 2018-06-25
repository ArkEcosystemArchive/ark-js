/** @module delegate */

var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

/**
 * @static
 * @param {string} secret
 * @param {string} username
 * @param {ECPair|string} [secondSecret]
 * @param {number} [feeOverride]
 */
function createDelegate(secret, username, secondSecret, feeOverride) {
	if (typeof secret === 'undefined' || !username) return false;

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

	var transaction = {
		type: 2,
		amount: 0,
		fee: feeOverride || constants.fees.delegate,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			delegate: {
				username: username,
				publicKey: keys.publicKey
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
	createDelegate : createDelegate
}
