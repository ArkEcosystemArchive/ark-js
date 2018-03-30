import fg from 'fast-glob'
import path from 'path'

const entries = fg.sync([path.resolve(__dirname, '../../src/networks/**/*.json')])

let networks = {}
entries.forEach(file => (networks[path.parse(file).name] = require(file)))

export default networks
