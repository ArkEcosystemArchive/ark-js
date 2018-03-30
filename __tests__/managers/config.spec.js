import configManager from '@/managers/config'
import network from '@/networks/devnet'
import networkMainnet from '@/networks/mainnet'

beforeEach(() => configManager.setConfig(network))

describe('Configuration', () => {
  it('should be instantiated', () => {
    expect(configManager).toBeInstanceOf(Object)
  })

  it('should be set on runtime', () => {
    configManager.setConfig(networkMainnet)

    expect(configManager.all()).toEqual(networkMainnet)
  })

  it('key should be "set"', () => {
    configManager.set('key', 'value')

    expect(configManager.get('key')).toBe('value')
  })

  it('key should be "get"', () => {
    expect(configManager.get('nethash')).toBe('578e820911f24e039733b45e4882b73e301f813a0d2c31330dafda84534ffa23')
  })

  it('should build constants', () => {
    expect(configManager.constants).toEqual(network.constants)
  })

  it('should get constants for height', () => {
    expect(configManager.getConstants(75600)).toEqual(network.constants[1])
  })

  it('should set the height', () => {
    configManager.setHeight(75600)

    expect(configManager.getHeight()).toEqual(75600)
  })
})
