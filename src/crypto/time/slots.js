import Config from '@/config'

class Slots {
  getEpochTime (time) {
    if (time === undefined) time = (new Date()).getTime()

    const start = this.beginEpochTime().getTime()

    return Math.floor((time - start) / 1000)
  }

  beginEpochTime () {
    return new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0))
  }

  getTime (time) {
    return this.getEpochTime(time)
  }

  getRealTime (epochTime) {
    if (epochTime === undefined) epochTime = this.getTime()

    const start = Math.floor(this.beginEpochTime().getTime() / 1000) * 1000

    return start + epochTime * 1000
  }

  getSlotNumber (epochTime) {
    if (epochTime === undefined) epochTime = this.getTime()

    return Math.floor(epochTime / Config.get('interval'))
  }

  getSlotTime (slot) {
    return slot * Config.get('interval')
  }

  getNextSlot () {
    return this.getSlotNumber() + 1
  }

  getLastSlot (nextSlot) {
    return nextSlot + Config.get('delegates')
  }
}

export default new Slots()
