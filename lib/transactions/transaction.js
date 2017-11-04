const crypto = require("./crypto.js")
const constants = require("../constants.js")
const slots = require("../time/slots.js")

function createTransaction(recipientId, amount, vendorField, secret, secondSecret) {
	if (!recipientId || !amount || !secret) return false;

  if(!crypto.validateAddress(recipientId)){
    throw new Error("Wrong recipientId");
	}

	let keys = secret;

	if (!crypto.isECPair(secret)) {
		keys = crypto.getKeys(secret);
	}

  if (!keys.publicKey) {
    throw new Error("Invalid public key");
  }

	const transaction = {
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
	createTransaction: createTransaction
}
