var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

function createVote(secret, delegates, secondSecret, vendorField) {
	var keys = crypto.getKeys(secret);

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

	if (vendorField) {
		transaction.vendorField = vendorField;

		if(transaction.vendorField.length > constants.vendorField.length) return null;
	}

	crypto.sign(transaction, keys);

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);

	return transaction;
}

module.exports = {
	createVote: createVote
}
