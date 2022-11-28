const { observable, action } = require('mobx-miniprogram')
const { deepAssign } = require('../utils/deep-assign')
const { isEmpty } = require('../utils/helper')
const store = observable({
  jkInfo: {
    subject: 1,
    model: 'c1',
    geolocation: 'hello市',
  },
  subject1: {
    totalNum: 0,
    completeNum: 0,
    error: {},
    collect: {},
    // 错误总数不是单个order || random 中的
    errorNum: 0,
    collectNum: 0,
    // 针对单个 order | random
    _errorNum: 0,
    _correctNum: 0
  },
  subject4: {
    totalNum: 0,
    completeNum: 0,
    errorNum: 0,
    collectNum: 0,
    error: {},
    collect: {},
    _errorNum: 0,
    _correctNum: 0
  },
  // 考试数据 单一考试
  examInfo: null,
  allExamInfo: [],
  // 完成数据 order | random 重定向使用
  completeInfo: {},
  answerMap: null,
  get c_subject() {
    return this.jkInfo.subject === 1 ? this.subject1 : this.subject4
  },
  updateAnswerMap: action(function(step) {
    this.answerMap = step
  }),
  updateJKInfo: action(function(step = {}) {
    console.log(step)
    this.jkInfo = Object.assign({}, deepAssign(this.jkInfo, step))
  }),
  updateSubject1: action(function(step = {}) {
    if (!isEmpty(step)) {
      this.subject1 = Object.assign({}, this.subject1, step)
    }
  }),
  updateSubject4: action(function(step = {}) {
    if (!isEmpty(step)) {
      this.subject4 = Object.assign({}, this.subject4, step)
    }
  }),
  updateExamInfo: action(function(step) {
    this.examInfo = step || {}
  }),
  updateAllExamInfo: action(function(step, type = 'concat') {
    if (type === 'concat') {
      this.allExamInfo = this.allExamInfo.concat(step)
    }
    if (type === 'toggle') {
      this.allExamInfo = step
    }
  }),
  updateCompleteInfo: action(function(step) {
    this.completeInfo = Object.assign({}, this.completeInfo, step)
  })
})
module.exports = {
  store
}