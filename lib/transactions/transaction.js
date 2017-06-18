var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js"),
    bip39 = require("bip39");

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

  /* checks if the secret/secondSecret sent is an entropy */
  if (secret.length == 32) {
    try { 
      secret = bip39.entropyToMnemonic(secret) 
    } catch(e) {}
  }

  if (secondSecret && secondSecret.length == 32) {
    try { 
      secondSecret = bip39.entropyToMnemonic(secondSecret);
    } catch(e) {}
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
