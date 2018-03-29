import ConfigManager from '@/managers/config'
import network from '@/networks/devnet'
import networkMainnet from '@/networks/mainnet'

beforeEach(() => ConfigManager.setConfig(network))

describe('Configuration', () => {
  it('should be instantiated', () => {
    expect(ConfigManager).toBeInstanceOf(Object)
  })

  it('should be set on runtime', () => {
    ConfigManager.setConfig(networkMainnet)

    expect(ConfigManager.all()).toEqual(networkMainnet)
  })

  it('key should be "set"', () => {
    ConfigManager.set('key', 'value')

    expect(ConfigManager.get('key')).toBe('value')
  })

  it('key should be "get"', () => {
    expect(ConfigManager.get('nethash')).toBe('578e820911f24e039733b45e4882b73e301f813a0d2c31330dafda84534ffa23')
  })

  it('should build constants', () => {
    expect(ConfigManager.constants).toEqual(network.constants)
  })

  it('should get constants for height', () => {
    expect(ConfigManager.getConstants(75600)).toEqual(network.constants[1])
  })

  it('should set the height', () => {
    ConfigManager.setHeight(75600)

    expect(ConfigManager.getHeight()).toEqual(75600)
  })
})
