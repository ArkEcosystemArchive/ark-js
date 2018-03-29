import getType from 'jest-get-type'
import Config from '../../src/config'
import network from '../../src/networks/devnet'
import slots from '../../src/crypto/slots'

beforeEach(() => Config.setConfig(network))

describe('Slots', () => {
  describe('getEpochTime', () => {
    test('should be a function', () => {
      expect(getType(slots.getEpochTime)).toBe('function')
    })

    test('return epoch datetime', () => {
      expect(getType(slots.getEpochTime())).toBe('number')
    })
  })

  describe('beginEpochTime', () => {
    test('should be a function', () => {
      expect(getType(slots.beginEpochTime)).toBe('function')
    })

    test('return epoch datetime', () => {
      expect(slots.beginEpochTime().format()).toBe('2017-03-21T13:00:00Z')
    })

    test('return epoch datetime', () => {
      expect(slots.beginEpochTime().unix()).toBe(1490101200)
    })
  })

  describe('getTime', () => {
    test('should be a function', () => {
      expect(getType(slots.getTime)).toBe('function')
    })

    test('return epoch time as number', () => {
      const result = slots.getTime(1490101210000)

      expect(getType(result)).toBe('number')
      expect(result).toEqual(10)
    })
  })

  describe('getRealTime', () => {
    test('should be a function', () => {
      expect(getType(slots.getRealTime)).toBe('function')
    })

    test('return return real time', () => {
      expect(slots.getRealTime(10)).toBe(1490101210000)
    })
  })

  describe('getSlotNumber', () => {
    test('should be a function', () => {
      expect(getType(slots.getSlotNumber)).toBe('function')
    })

    test('return slot number', () => {
      expect(slots.getSlotNumber(10)).toBe(1)
    })
  })

  describe('getSlotTime', () => {
    test('should be a function', () => {
      expect(getType(slots.getSlotTime)).toBe('function')
    })

    test('returns slot time', () => {
      expect(slots.getSlotTime(19614)).toBe(156912)
    })
  })

  describe('getNextSlot', () => {
    test('should be a function', () => {
      expect(getType(slots.getNextSlot)).toBe('function')
    })

    test('returns next slot', () => {
      expect(getType(slots.getNextSlot())).toBe('number')
    })
  })

  describe('getLastSlot', () => {
    test('should be a function', () => {
      expect(getType(slots.getLastSlot)).toBe('function')
    })

    test('returns last slot', () => {
      expect(slots.getLastSlot(1)).toBe(52)
    })
  })

  describe('getConstant', () => {
    test('should be a function', () => {
      expect(getType(slots.getConstant)).toBe('function')
    })

    test('returns constant', () => {
      expect(slots.getConstant('epoch')).toBe('2017-03-21T13:00:00.000Z')
    })
  })
})
