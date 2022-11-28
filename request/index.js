const baseUrl = 'http://192.168.43.217/'
// query + c1 |c2 |a1 | a2 | b1 | b2 | 4,
// answers
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
  })
}
const orderQueryExam = (options) => {
  const { data = {}, url = '' } = options
  const path = baseUrl + url
  return request({ url: path, data })
}
const queryAnswer = (options) => {
  const { data = {}, url = '' } = options
  const path = baseUrl + url
  return request({ url: path, data })
}
const queryRanking = (options) => {
  const { data = {}, url = '' } = options
  const path = baseUrl + url
  return request({ url: path, data })
}

module.exports = {
  orderQueryExam,
  queryAnswer,
  queryRanking
}