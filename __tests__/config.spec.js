import Config from '../src/config'
import network from '../src/networks/mainnet'
import networkDevnet from '../src/networks/devnet'

beforeEach(() => Config.setConfig(network))

test('config is instantiated', () => {
  expect(Config).toBeInstanceOf(Object)
})

test('config can be set on runtime', () => {
  Config.setConfig(networkDevnet)

  expect(Config.all()).toEqual(networkDevnet)
})

test('config key can be retrieved', () => {
  expect(Config.get('nethash')).toBe('6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988')
})

test('config can build constants', () => {
  expect(Config.constants).toEqual(network.constants)
})

test('config can get constants for height', () => {
  expect(Config.getConstants(75600)).toEqual(network.constants[1])
})
