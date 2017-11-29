/**
 * The arkjs exported object.
 *
 * @module arkjs
 */
module.exports = {
	crypto : require("./lib/transactions/crypto.js"),
	delegate : require("./lib/transactions/delegate.js"),
	signature : require("./lib/transactions/signature.js"),
	multisignature : require("./lib/transactions/multisignature.js"),
	transaction : require("./lib/transactions/transaction.js"),
	vote : require("./lib/transactions/vote.js"),
	ipfs : require("./lib/transactions/ipfs.js"),
	networks : require("./lib/networks.js"),
	slots : require("./lib/time/slots.js"),

	ECPair : require("./lib/ecpair.js"),
	HDNode : require("./lib/hdnode.js"),
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

