
/**
 * Format the number
 * @param {number|string} num The number to be formatted
 * @return {string} Formatted number
 */
export function format(num) {
  return new Intl.NumberFormat(
    undefined,
    { maximumFractionDigits: 4 },
  ).format(num);
}

/**
 * Round off to the 2nd decimal place
 * @param {number|string} num1 The first number
 * @param {number|string} num2 The second number
 * @return {number} Formatted number
 */
export function toFixed(num1, num2) {
  return +(+num1 + +num2).toFixed(2);
}
