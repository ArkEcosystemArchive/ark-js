import Config from '@/config'
import network from '@/networks/devnet'
import networkMainnet from '@/networks/mainnet'

beforeEach(() => Config.setConfig(network))

describe('Configuration', () => {
  test('should be instantiated', () => {
    expect(Config).toBeInstanceOf(Object)
  })

  test('should be set on runtime', () => {
    Config.setConfig(networkMainnet)

    expect(Config.all()).toEqual(networkMainnet)
  })

  test('key should be "set"', () => {
    Config.set('key', 'value')

    expect(Config.get('key')).toBe('value')
  })

  test('key should be "get"', () => {
    expect(Config.get('nethash')).toBe('578e820911f24e039733b45e4882b73e301f813a0d2c31330dafda84534ffa23')
  })

  test('should build constants', () => {
    expect(Config.constants).toEqual(network.constants)
  })

  test('should get constants for height', () => {
    expect(Config.getConstants(75600)).toEqual(network.constants[1])
  })
})
