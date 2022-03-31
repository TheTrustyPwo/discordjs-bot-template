/**
 * Returns a random number below a max
 * @param {Number} max
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Checks if a string is a valid Hex color
 * @param {string} text
 */
function isHex(text) {
    return /^#[0-9A-F]{6}$/i.test(text);
}

/**
 * Returns hour difference between two dates
 * @param {Date} dt2
 * @param {Date} dt1
 */
function diffHours(dt2, dt1) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
}

/**
 * Returns remaining time in days, hours, minutes and seconds
 * @param {number} timeInSeconds
 */
function timeFormat(timeInSeconds) {
    const days = Math.floor((timeInSeconds % 31536000) / 86400);
    const hours = Math.floor((timeInSeconds % 86400) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.round(timeInSeconds % 60);
    return (
        (days > 0 ? `${days} days, ` : "") +
        (hours > 0 ? `${hours} hours, ` : "") +
        (minutes > 0 ? `${minutes} minutes, ` : "") +
        (seconds > 0 ? `${seconds} seconds` : "")
    );
}

/**
 * Converts duration to milliseconds
 * @param {string} duration
 */
const durationToMillis = (duration) =>
    duration
        .split(":")
        .map(Number)
        .reduce((acc, curr) => curr + acc * 60) * 1000;

/**
 * Returns time remaining until provided date
 * @param {Date} timeUntil
 */
function getRemainingTime(timeUntil) {
    const seconds = Math.abs((timeUntil - new Date()) / 1000);
    const time = timeFormat(seconds);
    return time;
}

module.exports = {
    getRandomInt,
    isHex,
    diffHours,
    timeFormat,
    durationToMillis,
    getRemainingTime,
};
