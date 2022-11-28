const baseUrl = 'http://192.168.43.217/'
const { examData, answerData } = require('../common/js/mockData')

const request = (options) => {
  const { url, data } = options 
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
    // if (/\/query/.test(url)) {
    //   resolve(examData)
    // } else if (/\/answer/.test(url)) {
    //   resolve(answerData)
    // } else {
    //   reject({ errMsg: 'request url error' })
    // }
  })
}

const getExamination = (params) => {
  // console.log(params)
  return Promise.resolve(examData)
}
const getAnswerMap = (params) => {
  // console.log(answerData)
  return Promise.resolve(answerData)
}
const queryExamination = (options) => {
  return request(options)
}

const checkKeyExistSave = async (options) => {
  const {key, url, data, complete, fail} = options
  const result = await wx.getStorage({ key })
  return result
}

const orderQueryExam = (options) => {
  const { data = {}, url = '' } = options
  const path = baseUrl + url
  return request({ url: path, data })
}


module.exports = {
  request,
  getExamination,
  getAnswerMap,
  checkKeyExistSave,
  orderQueryExam
}