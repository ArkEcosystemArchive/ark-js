import Config from '@/config'
import network from '@/networks/devnet'
import networkMainnet from '@/networks/mainnet'

beforeEach(() => Config.setConfig(network))

describe('Configuration', () => {
  it('should be instantiated', () => {
    expect(Config).toBeInstanceOf(Object)
  })

  it('should be set on runtime', () => {
    Config.setConfig(networkMainnet)

    expect(Config.all()).toEqual(networkMainnet)
  })

  it('key should be "set"', () => {
    Config.set('key', 'value')

    expect(Config.get('key')).toBe('value')
  })

  it('key should be "get"', () => {
    expect(Config.get('nethash')).toBe('578e820911f24e039733b45e4882b73e301f813a0d2c31330dafda84534ffa23')
  })

  it('should build constants', () => {
    expect(Config.constants).toEqual(network.constants)
  })

  it('should get constants for height', () => {
    expect(Config.getConstants(75600)).toEqual(network.constants[1])
  })

  it('should set the height', () => {
    Config.setHeight(75600)

    expect(Config.getHeight()).toEqual(75600)
  })
})
