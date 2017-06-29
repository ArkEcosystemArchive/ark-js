var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

function createHashRegistration(ipfshash, secret, secondSecret) {
	var transaction = {
		type: 5,
    amount:0,
		fee: constants.fees.send,
		timestamp: slots.getTime(),
		asset: {}
	};

  transaction.vendorFieldHex = new Buffer(ipfshash,"utf8").toString("hex");
  //filling with 0x00
  while(transaction.vendorFieldHex.length < 128){
    transaction.vendorFieldHex = "00"+transaction.vendorFieldHex;
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
	createHashRegistration: createHashRegistration
}
