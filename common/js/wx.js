const { appKey } = require('./constant.js')
const { isObject, isFunction } = require('../../utils/helper.js')
const requestQueue = require('../js/request-queue')
const { answerData } = require('../js/mockData')

class MYWX {
  constructor() {
    // 最多5个异步并行请求
    this.callNum = 0
  }
  // 对象参数
  request(...rest) {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    })
    const ajaxQueue = requestQueue.getQueue('wxAjaxQueue')
    const exec = () => {
      if (this.callNum < 5 && ajaxQueue.callbackArray.length > 0) {
        ajaxQueue.exec()
        this.callNum++
      }
    }
    const query = (...args) => {
      const [ requestOptions ] = [...args]
      if (!isObject(requestOptions)) {
        return
      }
      const { url = '', data = {}, complete, fail, method = 'GET' } = requestOptions
      const header = {
        'content-Type': 'application/x-www-form-urlencoded'
      }
      const options = {
        url,
        data: Object.assign(data, { key: appKey }),
        success: (res) => {
          exec()
          if (isFunction(complete)) {
            complete(res)
          }
          if (ajaxQueue.getSize() === 0) {
            wx.hideToast()
          }
          this.callNum--
        },
        fail,
        header,
        method
      }
      console.log(answerData.result)
      // wx.request(options)
    }
    if (ajaxQueue) {
      ajaxQueue.add(query, ...rest)
      exec()
    }
  }
}
// 对象参数
const getStorage = (options) => {
  const { key, complete, fail: failFn } = options
  wx.getStorage({
    key,
    success(res) {
      if (isFunction(complete)) {
        complete(res)
      }
    },
    fail(res) {
      if (isFunction(failFn)) {
        failFn(res)
      }
    }
  })
}

const setStorage = (options) => {
  // 对象参数
  const { key, data = null, complete, fail: failFn } = options
  if (!data) {
    return
  }
  wx.setStorage({
    key,
    data,
    success(res) {
      if (isFunction(complete)) {
        complete(res)
      }
    },
    fail(res) {
      wx.showToast({
        title: res.errMsg,
        icon: 'error',
      })
      if (isFunction(failFn)) {
        failFn(res)
      }
    }
  })
}

const myWx = new MYWX()

module.exports = {
  myWx,
  getStorage,
  setStorage
}