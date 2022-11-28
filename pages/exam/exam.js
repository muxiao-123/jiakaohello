// pages/exam/exam.js
const { isEmpty } = require('../../utils/helper')
const { dealQuestionInfo } = require('../../service/exam')
const { getInitData, initSlideInfo } = require('../../service/do-qs')
const { navHeight } = getApp().globalData.navInfo
const { createStoreBindings } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
const { storageKey } = require('../../common/js/constant')
const { saveToStorage } = require('../../storage/storage')
Page({
  data: {
    navHeight: navHeight,
    question: null,
    questionA: null,
    isCollect: false,
    endDesc: '',
    canLeft: false,
    canRight: false,
    pageData: null,
    list: [],
    examInfo: null,
    maxHeight: '70vh',
    actionType: 'none',
    // 即需辅助的值
    currentName: 'questionA',
    fristInit: 'none',
    startTime: 0,
    isBack: false,
    countTime: 3000 * 1000
  },
  onLoad(options) {
    console.log(options)
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['examInfo', 'answerMap', 'jkInfo'],
      actions: ['updateExamInfo', 'updateSubject1', 'updateSubject4']
    })
    if (isEmpty(options)) {
      const eventChannel = this.getOpenerEventChannel()
      if (!isEmpty(eventChannel)) {
        eventChannel.on('acceptFromAnimate', (res) => {
          console.log(res)
          this.initData(res)
        })
      }
    } else {
      this.initPageData(options)
    }
  },
  onUnload() {
    this.saveCEMap()
    this.storeBindings.destroyStoreBindings()
    const { totalNum, correctNum, errorNum } = this.data.pageData
    const completeNum = correctNum + errorNum
    if (completeNum > 0 && completeNum !== totalNum) {
      const pauseTime = this.stopCount()
      if (!this.data.isBack) {
        wx.showModal({
          title: 'tip',
          content: '你还有未完成的考试，确定离开吗',
          cancelText: '继续考试',
          confirmText: '结束考试',
          success: (res) => {
            if (res.confirm) {
              console.log('confirm')
              // 卸载内容
            }
            if (res.cancel) {
              console.log('cancel')
              const data = JSON.parse(JSON.stringify(this.data))
              delete data.__webviewId__
              data.pauseTime = pauseTime
              wx.navigateTo({
                url: '../exam/exam',
                success(res) {
                  res.eventChannel.emit('acceptFromAnimate', data)
                }
              })
              // 回到考试
            }
          }
        })
      }
    }
  },
  onReady() {
    this.setData({
      startTime: Date.now()
    })
    // this.selectComponent('#count-down')
    //   .startCount()
  },
  onSaveExitState() {
    console.log('come on')
  },
  // 通过参数初始化
  initPageData(params) {
    // pageData, answerMap, completeMap,question, allError, allCollect, list
    const originData = getInitData(params)
    // debugger
    const { canLeft, canRight } = initSlideInfo(originData.pageData)
    originData.isCollect = !!originData.allCollect[originData.question.id]
    originData.canLeft = canLeft
    originData.canRight = canRight
    this.setData({...originData})
    // 待优化
    this.setData({
      loading: false
    })
  },
  // 下一题数据处理
  nextQuestion(type = 'next', key) {
    let { currentIndex, totalNum } = this.data.pageData
    let { list, completeMap, canLeft, canRight, currentName, allCollect } = this.data
    let question
    if (type === 'next' && !canLeft) {
      return
    }
    if (type === 'pre' && !canRight) {
      return
    }
    currentIndex = type === 'next' ? ++currentIndex : --currentIndex
    // 优先从完成Map中取
    if (completeMap[currentIndex]) {
      question = completeMap[currentIndex]
    } else {
      const target  = Object.assign({}, list[currentIndex])
      question = dealQuestionInfo({ target, answerMap: this.data.answerMap })
    }
    const sData = initSlideInfo(currentIndex, totalNum)
    const name = currentName === 'question' ? 'questionA' : 'question'
    this.setData({
      [key]: question,
      'pageData.currentIndex': currentIndex,
      canLeft: sData.canLeft,
      canRight: sData.canRight,
      currentName: name,
      isCollect: !!allCollect[question.id],
      // 待优化
      actionType: type
    })
  },
  // 将correct, error的问题保存到对应Map中 纯数据中, 返回数据大小
  saveAnswerResult(options = {}) {
    const { hasCorrect, id, question } = options
    const { correct, error, currentIndex } = this.data.pageData
    const { completeMap, allError } = this.data

    if (hasCorrect) {
      correct[id] = id
      if (error[id]) {
        delete error[id]
      }
    } else {
      error[id] = id
      allError[id] = { date: Date.now() }
      if (correct[id]) {
        delete correct[id]
      }
    }
    // 待优化
    completeMap[currentIndex] = Object.assign({}, question, { isLock: false })
    // 更新
    this.setData({
      allError,
      'pageData.correct': correct,
      'pageData.error': error,
      'pageData.errorNum': Object.keys(error).length,
      'pageData.correctNum': Object.keys(correct).length,
      completeMap
    })
  },
  // 离开保存所有
  saveCEMap() {
    const { subject, model } = this.data.jkInfo
    const { allError, allCollect, completeMap } = this.data
    const key = subject == 1 ? storageKey[subject][model] : storageKey[subject]
    // 只保存
    saveToStorage({key: key.info, data: { error: allError, collect: allCollect } })
    saveToStorage({key: key.info, data: { error: allError, collect: allCollect } })
    const updateObj = {}
    updateObj.error = allError
    updateObj.errorNum = Object.keys(allError).length
    updateObj.collect = allCollect
    updateObj.collectNum = Object.keys(allCollect).length
    this[`updateSubject${subject}`](updateObj)
  },
  // 打开弹窗
  showDialog() {
    console.log('click')
    this.selectComponent('#dialog').showDialog()
  },
  // 待处理
  selectTapHandle(e) {
    const { index } = e.detail
    const { currentIndex, totalNum } = this.data.pageData
    const { completeMap, answerMap, list, currentName } = this.data

    if (index === currentIndex) {
      return
    }
    let question = completeMap[index]
    if (!question) {
      const target = list[index]
      question = dealQuestionInfo({ target, answerMap })
    }
    const { canLeft, canRight } = initSlideInfo(index, totalNum)
    this.setData({
      [currentName]: question,
      'pageData.currentIndex': index,
      canRight,
      canLeft
    })
    const actionType = currentIndex < index ? 'next' : 'pre'
    const name = currentName === 'question' ? 'questionA' : 'question'
    this.setData({
      actionType,
      currentName: name
    })
  },
  // 答题了操作
  answerHandle(e) {
    const { question, id, correct, name } = e.detail
    this.saveAnswerResult({ hasCorrect: correct, id, question })
    const _key = name === 'question' ? 'questionA' : 'question'
    const { totalNum, correctNum, errorNum, testType } = this.data.pageData
    if (totalNum === (correctNum + errorNum)) {
      const restTime = this.stopCount()
      const completeRef = this.selectComponent('#complete-dialog')
      completeRef.showDialog({ restTime, totalNum, correctNum, errorNum, testType })
      return
    }
    if (correct) {
      // 自动下一题
      this.nextQuestion('next', _key)
    } else {
      this.nextQuestion('next', _key)
    }
  },
  // 返回主页面
  backHandle() {
    const restTime = this.selectComponent('#count-down').stopCount()
    const { totalNum, correctNum, errorNum, testType } = this.data.pageData
    const completeNum = correctNum + errorNum
    if (completeNum === 0) {
      wx.navigateBack()
    } else {
      const completeRef = this.selectComponent('#complete-dialog')
      completeRef.showDialog({ totalNum, correctNum, errorNum, testType, restTime }, 'continue')
      console.log('okok')
      // 弹窗
    }
  },
  // from bottom-select || dialog],bottom-select
  btnClick(e) {
    // submit collect
    const { type } = e.detail
    if (type === 'collect') {
      const { currentName, allCollect } = this.data
      const name = currentName === 'question' ? 'questionA' : 'question'
      const id = this.data[name].id
      let isCollect = false
      if (allCollect[id]) {
        delete allCollect[id]
      } else {
        allCollect[id] = id
        isCollect = true
      }
      this.setData({
        isCollect,
        allCollect
      })
    } else if (type === 'submit') {
      // 停止计时 可得到时间
      const restTime = this.stopCount()
      const { totalNum, correctNum, errorNum, testType } = this.data.pageData
      const completeRef = this.selectComponent('#complete-dialog')
      completeRef.showDialog({ totalNum, correctNum, errorNum, testType, restTime })
    }
  },
  // from complte-dialog
  btnClickHandle(e) {
    // console.log(e.detail)
    switch (e.detail.type) {
      case 'submit':
        // 保存数据
        const restTime = this.selectComponent('#count-down').getCountTime()
        this.updateExamInfo(
          Object.assign(
            {},
            this.data.pageData,
            { 
              restTime,
              list: this.data.list,
              date: Date.now(),
              completeMap: this.data.completeMap
            }
          )
        )
        wx.redirectTo({
          url: '../finish/finish',
        })
        break;
      case 'back':
        this.setData({
          isBack: true
        })
        wx.nextTick(() => {
          wx.navigateBack()
            .catch((err) => {
              console.log('失败了')
              console.log(err)
            })
        })
        break;
      case 'continue':
        this.selectComponent('#count-down').startCount()
        break;
      default:
        break;
    }
  },
  // wanchengle
  completeAll() {
    console.log('complete all')
  },
  // 返回重置数据
  getResetInfo() {
    const target = {}
    target.error = {}
    target.correct = {}
    target.errorNum = 0
    target.correctNum = 0
    target.totalNum = 0
    target.currentIndex = 0
    target.isCollect = false
    return target
  },
  // 初始数据
  initData(options) {
    // 返回考试初始化
    const { currentName } = options
    if (currentName !== 'questionA') {
      options.fristInit = 'question'
    }
    options.countTime = options.pauseTime
    delete options.pauseTime
    this.setData({...options})
  },
  // 动画结束后，设状态
  animateEnd() {
    this.setData({
      actionType: 'none'
    })
  },
  modifyClass() {
    this.setData({
      fristInit: 'none'
    })
  },
  // 滑动动画前操作
  beforeSlide(options) {
    const { type, key } = options
    const _key = key === 'question' ? 'questionA' : 'question'
    this.nextQuestion(type, _key)
  },
  // 获取底部rect info
  handlebsRect(e) {
    const { height, bottom } = e.detail
    this.setData({
      maxHeight: bottom - height - navHeight + 'px'
    })
  },
  // 提交考试记录
  toFinishPage() {
    // to do showdialog 确认胶卷状态
    console.log('to do')
  },
  saveExamInfo() {
    this.updateExamInfo(this.data.pageData)
  },
  stopCount() {
    return this.selectComponent('#count-down').stopCount()
  }
})