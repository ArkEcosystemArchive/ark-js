/** @module crypto */

var Buffer = require('safe-buffer').Buffer
var crypto = require("crypto");
var crypto_utils = require("../crypto.js");
var ECPair = require("../ecpair.js");
var ECSignature = require("../ecsignature.js");
/** @type {Object.<string, Network>} */
var networks = require("../networks.js")

var bs58check = require('bs58check')

var ByteBuffer = require("bytebuffer");
var bignum = require("browserify-bignum");


var fixedPoint = Math.pow(10, 8);
// default is ark mainnet
var networkVersion = 0x17;

/**
 * @static
 * @param {*} obj
 * @returns {boolean}
 */
function isECPair(obj) {
	return obj instanceof ECPair;
}

/**
 * @static
 * @param {ECSignature} signature
 * @returns {Uint8Array}
 */
function getSignatureBytes(signature) {
	var buffer = Buffer.alloc(33, signature.publicKey, "hex")
	return new Uint8Array(buffer)
}

/**
 * @static
 * @param {Transaction} transaction
 * @param {boolean} [skipSignature=false]
 * @param {boolean} [skipSecondSignature=false]
 * @returns {Buffer}
 */
function getBytes(transaction, skipSignature, skipSecondSignature) {
	var assetBytes = null;

	switch (transaction.type) {
		case 1: // Signature
			assetBytes = getSignatureBytes(transaction.asset.signature);
			break;

		case 2: // Delegate
			assetBytes = Buffer.from(transaction.asset.delegate.username, "utf8");
			break;

		case 3: // Vote
			if (transaction.asset.votes !== null) {
				assetBytes = Buffer.from(transaction.asset.votes.join(""), "utf8");
			}
			break;

		case 4: // Multi-Signature
			var keysgroupBuffer = Buffer.from(transaction.asset.multisignature.keysgroup.join(""), "utf8");
			var bb = new ByteBuffer(1 + 1 + keysgroupBuffer.length, true);

			bb.writeUint8(transaction.asset.multisignature.min)
			bb.writeUint8(transaction.asset.multisignature.lifetime)

			console.assert(keysgroupBuffer.length % 66 === 0)
			bb.append(keysgroupBuffer)

			bb.flip();

			assetBytes = bb.toBuffer();
			break;

	}

	var assetLength = assetBytes !== null ? assetBytes.length : 0
	var bb = new ByteBuffer(1 + 4 + 32 + 21 + 64 + 8 + 8 + assetLength + 64 + 64, true);
	bb.writeByte(transaction.type);
	bb.writeUint32(transaction.timestamp);

	// FIXME: transaction.senderPublicKey can be 32 or 33 bytes
	bb.append(transaction.senderPublicKey, "hex")

	if (transaction.recipientId) {
		var recipient = bs58check.decode(transaction.recipientId);
		console.assert(recipient.length === 21)
		bb.append(recipient)
	} else {
		bb.fill(0, bb.offset, bb.offset + 21)
		bb.skip(21)
	}

	if (transaction.vendorFieldHex) {
		var vf = Buffer.allocUnsafe(64)
		var written = vf.write(transaction.vendorFieldHex, 0, 64, 'hex')
		vf.fill(0, written)
		bb.append(vf)
	} else if (transaction.vendorField) {
		var vf = Buffer.allocUnsafe(64)
		var written = vf.write(transaction.vendorField, 0, 64, 'utf8')
		vf.fill(0, written)
		bb.append(vf)
	} else {
		bb.fill(0, bb.offset, bb.offset + 64)
		bb.skip(64)
	}

	bb.writeUint64(transaction.amount)

	bb.writeUint64(transaction.fee)

	if (assetLength > 0) {
		bb.append(assetBytes)
	}

	if (!skipSignature && transaction.signature) {
		var signatureBuffer = Buffer.from(transaction.signature, "hex");
		bb.append(signatureBuffer)
	}

	if (!skipSecondSignature && transaction.signSignature) {
		var signSignatureBuffer = Buffer.from(transaction.signSignature, "hex");
		bb.append(signSignatureBuffer)
	}

	bb.flip()
	return bb.toBuffer()
}

/**
 * @static
 * @param {string} hexString
 * @returns {Transaction}
 */
function fromBytes (hexString) {
	console.assert(typeof hexString === 'string' && hexString.length > 32)

	var tx = {}
	var buf = Buffer.from(hexString, "hex")
	tx.type = buf.readInt8(0)
	tx.timestamp = buf.readUInt32LE(1)
	tx.senderPublicKey = hexString.substr(10, 33*2)
	tx.vendorFieldHex = hexString.substr(10+33*2+42, 128)
	var AMOUNT_OFFSET = 38 + 21 + 64
	tx.amount = buf.readUIntLE(AMOUNT_OFFSET, 6) // TODO: read last 2 bytes, add tests
	tx.fee = buf.readUIntLE(AMOUNT_OFFSET + 8, 6) // TODO: read last 2 bytes, add tests

	var ASSET_OFFSET = 76 + 42 + 128 + 32
	switch (tx.type) {
	case 0: // transfer
		tx.recipientId = bs58check.encode(buf.slice(38, 38 + 21))
		parseSignatures(hexString, tx, ASSET_OFFSET)
		break
	case 1: // second signature registration
		tx.asset = {
			signature: {
				publicKey: hexString.substr(ASSET_OFFSET, 66)
			}
		}
		parseSignatures(hexString, tx, ASSET_OFFSET + 66)
		break
	case 2: // delegate registration
		// Impossible to assess size of delegate asset, trying to grab signature and derive delegate asset
		var offset = findAndParseSignatures(hexString, tx)
		var username = Buffer
			.from(hexString.substring(ASSET_OFFSET, hexString.length - offset), "hex")
			.toString("utf8")
		tx.asset = {
			delegate: { username: username }
		}
		break
	case 3: // vote
		var offset = findAndParseSignatures(hexString, tx)
		var votes = Buffer
			.from(hexString.substring(ASSET_OFFSET, hexString.length - offset), "hex")
			.toString("utf8")
			.split(",")
		tx.asset = { votes: votes }
		break
	case 4: // multisignature creation
		var offset = findAndParseSignatures(hexString, tx)
		var buffer = Buffer
			.from(hexString.substring(ASSET_OFFSET, hexString.length - offset), "hex")
		tx.asset = {
			multisignature: {
				min: buffer.readUInt8(0),
				lifetime: buffer.readUInt8(1),
				keysgroup: []
			}
		}
		var index = 2;
		while (index < buffer.length) {
			var key = buffer.slice(index, index + 66).toString("utf8");
			tx.asset.multisignature.keysgroup.push(key);
			index += 66;
		}
		break
	case 5: // IPFS
		parseSignatures(hexString, tx, ASSET_OFFSET)
		break
	default:
		tx.recipientId = bs58check.encode(buf.slice(38, 38+21))
		break
	}

	return tx;
}

/**
 * @static
 * @param {string} hexString
 * @param {Transaction} tx
 * @returns {number}
 */
function findAndParseSignatures(hexString, tx){
	var signature1 = Buffer.from(hexString.substr(-146), "hex")
	var signature2 = null;
	var found      = false;
	var offset     = 0;
	while(!found && signature1.length > 8){
		if(signature1[0] != 0x30){
			signature1 = signature1.slice(1);
		}
		else try {
			ECSignature.fromDER(signature1,"hex");
			found = true;
		} catch(error){
			signature1 = signature1.slice(1);
		}
	}
	if(!found){
		offset = 0;
		signature1 = null;
	}
	else {
		found = false;
		offset = signature1.length*2;
		var signature2 = Buffer.from(hexString.substring(hexString.length-offset-146, hexString.length-offset), "hex");
		while(!found && signature2.length > 8){
			if(signature2[0] != 0x30){
				signature2 = signature2.slice(1);
			}
			else try {
				ECSignature.fromDER(signature2,"hex");
				found = true;
			} catch(error){
				signature2 = signature2.slice(1);
			}
		}
		if(!found){
			signature2 = null;
			tx.signature = signature1.toString("hex");
			offset = tx.signature.length;
		}
		else if(signature2){
			tx.signSignature = signature1.toString("hex");
			tx.signature = signature2.toString("hex");
			offset = tx.signature.length+tx.signSignature.length;
		}
	}
	return offset;
}

/**
 * @static
 * @param {string} hexString
 * @param {Transaction} tx
 * @param {number} startOffset
 */
function parseSignatures(hexString, tx, startOffset){
	tx.signature = hexString.substring(startOffset);
	if(tx.signature.length == 0) delete tx.signature;
	else {
		var length = parseInt("0x" + tx.signature.substring(2,4), 16) + 2;
		tx.signature = hexString.substring(startOffset, startOffset + length*2);
		tx.signSignature = hexString.substring(startOffset + length*2);
		if(tx.signSignature.length == 0) delete tx.signSignature;
	}
}

/**
 * @static
 * @param {Transaction} transaction
 * @returns {string}
 */
function getId(transaction) {
	return crypto.createHash("sha256").update(getBytes(transaction)).digest().toString("hex");
}

/**
 * @static
 * @param {Transaction} transaction
 * @param {boolean} [skipSignature=false]
 * @param {boolean} [skipSecondSignature=false]
 * @returns {Buffer}
 */
function getHash(transaction, skipSignature, skipSecondSignature) {
	return crypto.createHash("sha256").update(getBytes(transaction, skipSignature, skipSecondSignature)).digest();
}

/**
 * @static
 * @param {Transaction} transaction
 * @returns {number}
 */
function getFee(transaction) {
	switch (transaction.type) {
		case 0: // Normal
			return 0.1 * fixedPoint;
			break;

		case 1: // Signature
			return 100 * fixedPoint;
			break;

		case 2: // Delegate
			return 10000 * fixedPoint;
			break;

		case 3: // Vote
			return 1 * fixedPoint;
			break;
	}
}

/**
 * @static
 * @param {Transaction} transaction
 * @param {ECPair} keys
 * @returns {ECSignature}
 */
function sign(transaction, keys) {
	var hash = getHash(transaction, true, true);

	var signature = keys.sign(hash).toDER().toString("hex");

	if (!transaction.signature) {
		transaction.signature = signature;
	}
	return signature;

}

/**
 * @static
 * @param {Transaction} transaction
 * @param {ECPair} keys
 */
function secondSign(transaction, keys) {
	var hash = getHash(transaction, false, true);

	var signature = keys.sign(hash).toDER().toString("hex");

	if (!transaction.signSignature) {
		transaction.signSignature = signature;
	}
	return signature;
}

/**
 * @static
 * @param {Transaction} transaction
 * @param {Network} [network=networks.ark]
 */
function verify(transaction, network) {
	network = network || networks.ark;

	var hash = getHash(transaction, true, true);

	var signatureBuffer = Buffer.from(transaction.signature, "hex");
	var senderPublicKeyBuffer = Buffer.from(transaction.senderPublicKey, "hex");
	var ecpair = ECPair.fromPublicKeyBuffer(senderPublicKeyBuffer, network);
	var ecsignature = ECSignature.fromDER(signatureBuffer);
	var res = ecpair.verify(hash, ecsignature);

	return res;
}

/**
 * @static
 * @param {Transaction} transaction
 * @param {string} publicKey
 * @param {Network} [network]
 */
function verifySecondSignature(transaction, publicKey, network) {
	network = network || networks.ark;

	var hash = getHash(transaction, false, true);

	var signSignatureBuffer = Buffer.from(transaction.signSignature, "hex");
	var publicKeyBuffer = Buffer.from(publicKey, "hex");
	var ecpair = ECPair.fromPublicKeyBuffer(publicKeyBuffer, network);
	var ecsignature = ECSignature.fromDER(signSignatureBuffer);
	var res = ecpair.verify(hash, ecsignature);

	return res;
}

/**
 * @static
 * @param {string} secret
 * @param {Network} [network]
 * @returns {ECPair}
 */
function getKeys(secret, network) {
	var ecpair = ECPair.fromSeed(secret, network || networks.ark);

	ecpair.publicKey = ecpair.getPublicKeyBuffer().toString("hex");
	ecpair.privateKey = '';

	return ecpair;
}

/**
 * @static
 * @param {string} publicKey
 * @param {number} [version]
 * @returns {string}
 */
function getAddress(publicKey, version){
	if(!version){
		version = networkVersion;
	}

	var payload = Buffer.alloc(21);
	var buffer = crypto_utils.ripemd160(Buffer.from(publicKey,'hex'));

	payload.writeUInt8(version, 0);
	buffer.copy(payload, 1);

	return bs58check.encode(payload);
}

/**
 * @static
 * @param {number} version
 */
function setNetworkVersion(version){
	networkVersion = version;
}

/**
 * @static
 * @returns {number}
 */
function getNetworkVersion(){
	return networkVersion;
}

/**
 * @static
 * @param {string} address
 * @param {number} [version]
 * @returns {boolean}
 */
function validateAddress(address, version){
	if(!version){
		version = networkVersion;
	}
	try {
		var decode = bs58check.decode(address);
		return decode[0] == version;
	} catch(e){
		return false;
	}
}

module.exports = {
	getBytes: getBytes,
	fromBytes: fromBytes,
	getHash: getHash,
	getId: getId,
	getFee: getFee,
	sign: sign,
	secondSign: secondSign,
	getKeys: getKeys,
	getAddress: getAddress,
	validateAddress: validateAddress,
	verify: verify,
	verifySecondSignature: verifySecondSignature,
	fixedPoint: fixedPoint,
	setNetworkVersion: setNetworkVersion,
	getNetworkVersion: getNetworkVersion,
	isECPair: isECPair
}
