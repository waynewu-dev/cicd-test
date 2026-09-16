/**
 * 对一组数字求和，忽略非数字项。
 * @param {number[]} numbers
 * @returns {number}
 */
export function sum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('sum() 需要一个数组参数');
  }
  return numbers.reduce((acc, n) => (typeof n === 'number' && Number.isFinite(n) ? acc + n : acc), 0);
}

/**
 * 生成发布版本号：主版本 + 构建号。
 * @param {string} version
 * @param {number|string} buildNumber
 * @returns {string}
 */
export function buildTag(version, buildNumber) {
  return `${version}+${buildNumber}`;
}
