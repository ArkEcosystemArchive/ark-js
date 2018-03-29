import Config from '@/config'
import network from '@/networks/mainnet'
import networkDevnet from '@/networks/devnet'

beforeEach(() => Config.setConfig(network))

describe('Configuration', () => {
  test('should be instantiated', () => {
    expect(Config).toBeInstanceOf(Object)
  })

  test('should be set on runtime', () => {
    Config.setConfig(networkDevnet)

    expect(Config.all()).toEqual(networkDevnet)
  })

  test('key should be "set"', () => {
    Config.set('key', 'value')

    expect(Config.get('key')).toBe('value')
  })

  test('key should be "get"', () => {
    expect(Config.get('nethash')).toBe('6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988')
  })

  test('should build constants', () => {
    expect(Config.constants).toEqual(network.constants)
  })

  test('should get constants for height', () => {
    expect(Config.getConstants(75600)).toEqual(network.constants[1])
  })
})
