/** @module slots */

/**
 * @static
 * @param {Date=} time
 * @returns {number}
 */
function getEpochTime(time) {
	if (time === undefined) {
		time = (new Date()).getTime();
	}
	const d = beginEpochTime();
	const t = d.getTime();
	return Math.floor((time - t) / 1000);
}

/**
 * @static
 * @returns {Date}
 */
function beginEpochTime() {
	const d = new Date(Date.UTC(2017,2,21,13,0,0,0))

	return d;
}

const interval = 8,
      delegates = 51;

/**
 * @static
 * @param {Date=} time
 * @returns {number}
 */
function getTime(time) {
	return getEpochTime(time);
}

/**
 * @static
 * @param {number=} epochTime
 * @returns {number}
 */
function getRealTime(epochTime) {
	if (epochTime === undefined) {
		epochTime = getTime()
	}
	const d = beginEpochTime();
	const t = Math.floor(d.getTime() / 1000) * 1000;
	return t + epochTime * 1000;
}

/**
 * @static
 * @param {number} epochTime
 * @returns {number}
 */
function getSlotNumber(epochTime) {
	if (epochTime === undefined) {
		epochTime = getTime()
	}

	return Math.floor(epochTime / interval);
}

/**
 * @static
 * @param {number} slot
 * @returns {number}
 */
function getSlotTime(slot) {
	return slot * interval;
}

/**
 * @static
 * @returns {number}
 */
function getNextSlot() {
	const slot = getSlotNumber();

	return slot + 1;
}

/**
 * @static
 * @param {number} nextSlot
 * @returns {number}
 */
function getLastSlot(nextSlot) {
	return nextSlot + delegates;
}

module.exports = {
	interval,
	delegates,
	getTime,
	getRealTime,
	getSlotNumber,
	getSlotTime,
	getNextSlot,
	getLastSlot
}
