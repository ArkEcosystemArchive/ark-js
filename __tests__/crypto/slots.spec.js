import getType from 'jest-get-type'
import configManager from '@/managers/config'
import network from '@/networks/ark/devnet'
import slots from '@/crypto/slots'

beforeEach(() => configManager.setConfig(network))

describe('Slots', () => {
  describe('getEpochTime', () => {
    test('should be a function', () => {
      expect(getType(slots.getEpochTime)).toBeFunction()
    })

    test('return epoch datetime', () => {
      expect(getType(slots.getEpochTime())).toBeNumber()
    })
  })

  describe('beginEpochTime', () => {
    test('should be a function', () => {
      expect(getType(slots.beginEpochTime)).toBeFunction()
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
      expect(getType(slots.getTime)).toBeFunction()
    })

    test('return epoch time as number', () => {
      const result = slots.getTime(1490101210000)

      expect(getType(result)).toBeNumber()
      expect(result).toEqual(10)
    })
  })

  describe('getRealTime', () => {
    test('should be a function', () => {
      expect(getType(slots.getRealTime)).toBeFunction()
    })

    test('return return real time', () => {
      expect(slots.getRealTime(10)).toBe(1490101210000)
    })
  })

  describe('getSlotNumber', () => {
    test('should be a function', () => {
      expect(getType(slots.getSlotNumber)).toBeFunction()
    })

    test('return slot number', () => {
      expect(slots.getSlotNumber(10)).toBe(1)
    })
  })

  describe('getSlotTime', () => {
    test('should be a function', () => {
      expect(getType(slots.getSlotTime)).toBeFunction()
    })

    test('returns slot time', () => {
      expect(slots.getSlotTime(19614)).toBe(156912)
    })
  })

  describe('getNextSlot', () => {
    test('should be a function', () => {
      expect(getType(slots.getNextSlot)).toBeFunction()
    })

    test('returns next slot', () => {
      expect(getType(slots.getNextSlot())).toBeNumber()
    })
  })

  describe('getLastSlot', () => {
    test('should be a function', () => {
      expect(getType(slots.getLastSlot)).toBeFunction()
    })

    test('returns last slot', () => {
      expect(slots.getLastSlot(1)).toBe(52)
    })
  })

  describe('getConstant', () => {
    test('should be a function', () => {
      expect(getType(slots.getConstant)).toBeFunction()
    })

    test('returns constant', () => {
      expect(slots.getConstant('epoch')).toBe('2017-03-21T13:00:00.000Z')
    })
  })
})
