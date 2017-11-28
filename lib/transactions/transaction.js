var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
		slots = require("../time/slots.js");

/**
 * @typedef Transaction
 * @property {number} amount
 * @property {{}} asset
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
 * @param {string} recipientId
 * @param {*} amount
 * @param {string|null} vendorField
 * @param {*} secret
 * @param {*} [secondSecret]
 */
function createTransaction(recipientId, amount, vendorField, secret, secondSecret) {
	if (!recipientId || !amount || !secret) return false;

  if(!crypto.validateAddress(recipientId)){
    throw new Error("Wrong recipientId");
	}

	var keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
	}

  if (!keys.publicKey) {
    throw new Error("Invalid public key");
  }

	var transaction = {
		type: 0,
		amount: amount,
		fee: constants.fees.send,
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
