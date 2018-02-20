/** @module transaction */

var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
		slots = require("../time/slots.js");

/**
 * @static
 * @param {string} recipientId
 * @param {number} amount
 * @param {string|null} vendorField
 * @param {ECPair|string} secret
 * @param {ECPair|string} [secondSecret]
 * @param {number} [version]
 * @param {number} [feeOverride]
 * @returns {Transaction}
 */
function createTransaction(recipientId, amount, vendorField, secret, secondSecret, version, feeOverride) {
	if (!recipientId || !amount || !secret) return false;

  if(!crypto.validateAddress(recipientId, version)){
    throw new Error("Wrong recipientId");
	}

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
		type: 0,
		amount: amount,
		fee: feeOverride || constants.fees.send,
		recipientId: recipientId,
		timestamp: slots.getTime(),
		asset: {}
	};

  if(vendorField){
    transaction.vendorField=vendorField;
    if(transaction.vendorField.length > 64){
			return null;
		}
  }

	transaction.senderPublicKey = keys.publicKey;

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
	createTransaction: createTransaction
}
