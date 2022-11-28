const isObject = function (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
  // return typeof val === 'object' && val !== null
}
const isFunction = function (val) {
  return typeof val === 'function'
}
const isDef = function (val) {
  return val !== undefined || val !== null
}
const isEmpty = (val) => {
  return !val || Object.keys(val).length === 0
}

module.exports = {
  isObject,
  isFunction,
  isDef,
  isEmpty
}