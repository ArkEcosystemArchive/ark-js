/** @module slots */

/**
 * @param {Date} [time]
 * @returns {number}
 */
exports.getEpochTime = (time) => {
  if (time === undefined) {
    time = (new Date()).getTime()
  }

  const d = beginEpochTime()
  const t = d.getTime()

  return Math.floor((time - t) / 1000)
}

/**
 * @returns {Date}
 */
exports.beginEpochTime = () => {
  return new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0))
}

const interval = 8, delegates = 51 // TODO: move this to the configuration

/**
 * @param {Date} [time]
 * @returns {number}
 */
exports.getTime = (time) => {
  return getEpochTime(time)
}

/**
 * @param {number} [epochTime]
 * @returns {number}
 */
exports.getRealTime = (epochTime) => {
  if (epochTime === undefined) {
    epochTime = getTime()
  }

  const d = beginEpochTime()
  const t = Math.floor(d.getTime() / 1000) * 1000

  return t + epochTime * 1000
}

/**
 * @param {number} [epochTime]
 * @returns {number} an integer
 */
exports.getSlotNumber = (epochTime) => {
  if (epochTime === undefined) {
    epochTime = getTime()
  }

  return Math.floor(epochTime / interval)
}

/**
 * @param {number} slot
 * @returns {number}
 */
exports.getSlotTime = (slot) => {
  return slot * interval
}

/**
 * @returns {number}
 */
exports.getNextSlot = () => {
  return getSlotNumber() + 1
}

/**
 * @param {number} nextSlot
 * @returns {number}
 */
exports.getLastSlot = (nextSlot) => {
  return nextSlot + delegates
}
