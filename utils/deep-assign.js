const { isDef, isObject } = require('./helper')
const { hasOwnProperty } = Object.prototype
function assignKey(to, from, key) {
  const val = from[key]
  if (!isDef(key)) {
    return
  }
  if (!hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val
  } else {
    to[key] = deepAssign(Object(to[key]), val)
  }
}

function deepAssign(to, from) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key)
  })
  return to
}
module.exports = {
  deepAssign
}