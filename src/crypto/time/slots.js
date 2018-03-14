module.exports = class Slots {
  constructor (config) {
    this.config = config
  }

  getEpochTime (time) {
    if (time === undefined) {
      time = (new Date()).getTime()
    }

    const d = beginEpochTime()
    const t = d.getTime()

    return Math.floor((time - t) / 1000)
  }

  beginEpochTime () {
    return new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0))
  }

  getTime (time) {
    return getEpochTime(time)
  }

  getRealTime (epochTime) {
    if (epochTime === undefined) {
      epochTime = getTime()
    }

    const d = beginEpochTime()
    const t = Math.floor(d.getTime() / 1000) * 1000

    return t + epochTime * 1000
  }

  getSlotNumber (epochTime) {
    if (epochTime === undefined) {
      epochTime = getTime()
    }

    return Math.floor(epochTime / this.config.interval)
  }

  getSlotTime (slot) {
    return slot * this.config.interval
  }

  getNextSlot () {
    return getSlotNumber() + 1
  }

  getLastSlot (nextSlot) {
    return nextSlot + this.config.delegates
  }
}
