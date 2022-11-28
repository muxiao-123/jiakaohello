const { isObject, isFunction } = require('../utils/helper')
const setStorage = (...rest) => {
  // console.log(rest)
  try {
    if (rest.length === 1 && isObject(rest[0])) {
      wx.setStorage(...rest)
      // console.log(rest[0])
    } else if (rest.length > 1) {
      for (let value of rest) {
        wx.setStorage(value)
      }
      // console.log(rest)
    } else {
      console.log('params not Object || object],object')
    }
  } catch (error) {
    console.log(error)
  }
}

const checkKeyExist = (key) => {
  if (typeof key !== 'string') {
    throw new TypeError(`key not is a ${typeof key} type`)
  }
  return wx.getStorageSync(key)
}

const saveToStorage = (options) => {
  const { key, data, complete, fail } = options
  wx.setStorage({
    key,
    data,
    success: (res) => {
      if (isFunction(complete)) {
        complete(res)
      }
    },
    fail: (err) => {
      console.log(err)
      if (isFunction(fail)) {
        fail(err)
      }
    }
  })
}

// 从本地通过key拉取数据
const fetchPassKey = (key) => {
  return wx.getStorageSync(key)
}

module.exports = {
  setStorage,
  checkKeyExist,
  saveToStorage,
  fetchPassKey
}