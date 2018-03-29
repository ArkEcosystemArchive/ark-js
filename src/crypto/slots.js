import moment from 'moment'
import ConfigManager from '../managers/config'

class Slots {
  getEpochTime (time) {
    if (time === undefined) time = moment().valueOf()

    const start = this.beginEpochTime().valueOf()

    return Math.floor((time - start) / 1000)
  }

  beginEpochTime () {
    return moment(this.getConstant('epoch')).utc()
  }

  getTime (time) {
    return this.getEpochTime(time)
  }

  getRealTime (epochTime) {
    if (epochTime === undefined) epochTime = this.getTime()

    const start = Math.floor(this.beginEpochTime().valueOf() / 1000) * 1000

    return start + epochTime * 1000
  }

  getSlotNumber (epochTime) {
    if (epochTime === undefined) epochTime = this.getTime()

    return Math.floor(epochTime / this.getConstant('blocktime'))
  }

  getSlotTime (slot) {
    return slot * this.getConstant('blocktime')
  }

  getNextSlot () {
    return this.getSlotNumber() + 1
  }

  getLastSlot (nextSlot) {
    return nextSlot + this.getConstant('activeDelegates')
  }

  getConstant (key) {
    return ConfigManager.getConstants(1)[key]
  }
}

export default new Slots()
