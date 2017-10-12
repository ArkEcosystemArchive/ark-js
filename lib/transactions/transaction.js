var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

/**
 * @param {string} recipientId
 * @param {number} amount
 * @param {string} vendorField
 * @param {string} secret
 * @param {string} secondSecret
 * @returns {Object}
 * @throws {Error}
 */
function createTransaction(recipientId, amount, vendorField, secret, secondSecret) {
  if(!crypto.validateAddress(recipientId)){
    throw new Error("Wrong recipientId");
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

	var keys = crypto.getKeys(secret);
	transaction.senderPublicKey = keys.publicKey;

	crypto.sign(transaction, keys);

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

module.exports = {
	createTransaction: createTransaction
}
