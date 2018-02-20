var crypto = require("./crypto.js"),
    constants = require("../../constants.js"),
		slots = require("../../time/slots.js");

function Transfer(feeOverride) {
	if (feeOverride && !Number.isInteger(feeOverride)) {
		throw new Error('Not a valid fee')
	}

	this.id = null;
	this.amount = 0;
	this.fee = feeOverride || constants.fees.send;
	this.timestamp = slots.getTime();
	this.type = 0;
	this.expiration = 15; //15 blocks, 120s
	this.version = 0x02;
	this.network = 0x17;
}

Transfer.prototype.setNetwork = function(network){
	this.network = network;
	return this;
}

Transfer.prototype.create = function(recipientId, amount){
	this.amount = amount;
	this.recipientId = recipientId;
	return this;
}

Transfer.prototype.setVendorField = function(data, type){
	this.vendorFieldHex = new Buffer(data, type).toString("hex");
	return this;
}

Transfer.prototype.sign = function(passphrase){
	var keys = crypto.getKeys(passphrase);
	this.senderPublicKey = keys.publicKey;
	this.signature = crypto.sign(this, keys);
	return this;
}

Transfer.prototype.verify = function(){
	return crypto.verify(this);
}

Transfer.prototype.secondSign = function(passphrase){
	var keys = crypto.getKeys(passphrase);
	this.secondSignature = crypto.secondSign(transaction, keys);
	return this;
}

Transfer.prototype.serialise = function(){
	return {
		hex: crypto.getBytes(this).toString("hex"),
		id: crypto.getId(this),
		signature: this.signature,
		secondSignature: this.secondSignature
	};
}


module.exports = Transfer;
