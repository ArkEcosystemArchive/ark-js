/**
 * @module arkjs
 * @license MIT
 */

module.exports = {
	/** @see module:crypto */
	crypto: require("./lib/transactions/crypto.js"),
	/** @see module:delegate */
	delegate : require("./lib/transactions/delegate.js"),
	/** @see module:signature */
	signature : require("./lib/transactions/signature.js"),
	/** @see module:multisignature */
	multisignature : require("./lib/transactions/multisignature.js"),
	/** @see module:transaction */
	transaction : require("./lib/transactions/transaction.js"),
	/** @see module:vote */
	vote : require("./lib/transactions/vote.js"),
	/** @see module:ipfs */
	ipfs : require("./lib/transactions/ipfs.js"),
	/** @see module:networks */
	networks : require("./lib/networks.js"),
	/** @see module:slots */
	slots : require("./lib/time/slots.js"),

	/** @see ECPair */
	ECPair : require("./lib/ecpair.js"),
	/** @see HDNode */
	HDNode : require("./lib/hdnode.js"),
	/** @see ECSignature */
	ECSignature : require("./lib/ecsignature.js"),
}

// extra aliases for bitcoinlib-js compatibility
var libCrypto = require('./lib/crypto.js')
for (var method in libCrypto) {
	module.exports.crypto[method] = libCrypto[method]
}

/**
 * @typedef ECPoint
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef Network
 * @property {string} messagePrefix
 * @property {object} bip32
 * @property {number} bip32.public
 * @property {number} bip32.private
 * @property {number} pubKeyHash
 * @property {number} wif
 */

/**
 * @typedef Transaction
 * @property {number} amount
 * @property {object} asset
 * @property {string} id
 * @property {number} fee
 * @property {string} recipientId
 * @property {*} senderPublicKey
 * @property {string} signature
 * @property {string} [signSignature]
 * @property {number} timestamp
 * @property {number} type
 * @property {string} [vendorField]
 */

