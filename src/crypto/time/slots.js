import Config from '@/config'

export default class Slots {
  getEpochTime (time) {
    if (time === undefined) time = (new Date()).getTime()

    const start = beginEpochTime().getTime()

    return Math.floor((time - start) / 1000)
  }

  beginEpochTime () {
    return new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0))
  }

  getTime (time) {
    return getEpochTime(time)
  }

  getRealTime (epochTime) {
    if (epochTime === undefined) epochTime = getTime()

    const start = Math.floor(beginEpochTime().getTime() / 1000) * 1000

    return start + epochTime * 1000
  }

  getSlotNumber (epochTime) {
    if (epochTime === undefined) epochTime = getTime()

    return Math.floor(epochTime / Config.get('interval'))
  }

  getSlotTime (slot) {
    return slot * Config.get('interval')
  }

  getNextSlot () {
    return getSlotNumber() + 1
  }

  getLastSlot (nextSlot) {
    return nextSlot + Config.get('delegates')
  }
}
