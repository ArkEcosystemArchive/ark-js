const createHash = require('create-hash')

/**
 * @memberof module:crypto
 * @param {string|Buffer} buffer
 * @returns {Buffer}
 */
exports.ripemd160 = (buffer) => {
  return createHash('rmd160').update(buffer).digest()
}

/**
 * @memberof module:crypto
 * @param {string|Buffer} buffer
 * @returns {Buffer}
 */
exports.sha1 = (buffer) => {
  return createHash('sha1').update(buffer).digest()
}

/**
 * @memberof module:crypto
 * @param {string|Buffer} buffer
 * @returns {Buffer}
 */
exports.sha256 = (buffer) => {
  return createHash('sha256').update(buffer).digest()
}

/**
 * @memberof module:crypto
 * @param {string|Buffer} buffer
 * @returns {Buffer}
 */
exports.hash160 = (buffer) => {
  return ripemd160(sha256(buffer))
}

/**
 * @memberof module:crypto
 * @param {string|Buffer} buffer
 * @returns {Buffer}
 */
exports.hash256 = (buffer) => {
  return sha256(sha256(buffer))
}
