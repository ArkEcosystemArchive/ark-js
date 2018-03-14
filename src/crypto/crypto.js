const createHash = require('create-hash')

exports.ripemd160 = (buffer) => createHash('rmd160').update(buffer).digest()
exports.sha1 = (buffer) => createHash('sha1').update(buffer).digest()
exports.sha256 = (buffer) => createHash('sha256').update(buffer).digest()
exports.hash160 = (buffer) => ripemd160(sha256(buffer))
exports.hash256 = (buffer) => sha256(sha256(buffer))
