
/**
 * Format the number
 * @param {number|string} num The number to be formatted
 * @param {number} digit Maximum faction digits
 * @return {string} Formatted number
 */
export function format(num, digit) {
  return new Intl.NumberFormat(
    undefined,
    { maximumFractionDigits: digit || 4 },
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
