import Config from '../src/config'
import network from '../src/networks/mainnet'
import networkDevnet from '../src/networks/devnet'

beforeEach(() => Config.setConfig(network))

describe('Configuration', () => {
  test('should be instantiated', () => {
    expect(Config).toBeInstanceOf(Object)
  })

  test('should be set on runtime', () => {
    Config.setConfig(networkDevnet)

    expect(Config.all()).toEqual(networkDevnet)
  })

  test('key should be retrieved', () => {
    expect(Config.get('nethash')).toBe('6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988')
  })

  test('should build constants', () => {
    expect(Config.constants).toEqual(network.constants)
  })

  test('should get constants for height', () => {
    expect(Config.getConstants(75600)).toEqual(network.constants[1])
  })
})
