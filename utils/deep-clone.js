const { isDef, isObject } = require('./helper')
const deepClone = (obj) => {
  if (!isDef(obj)) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item))
  }
  if (isObject(obj)) {
    const to = {}
    Object.keys(obj).forEach((key, i) => {
      to[key] = deepClone(obj[key])
    })
    return to
  }
  return obj
 }

 module.exports = {
   deepClone
 }