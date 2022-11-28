const { isEmpty, isObject } = require('../../utils/helper')
const { saveToStorage, checkKeyExist } = require('../../storage/storage')
const { dealQuestionInfo } = require('../../service/exam')
const { getInitData, initSlideInfo } = require('../../service/do-qs')
const { createStoreBindings } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
const { storageKey } = require('../../common/js/constant')
const { navHeight } = getApp().globalData.navInfo
Page({
  data: {
    navHeight: navHeight,
    loading: true,
    isCollect: false,
    question: null,
    questionA: null,
    canLeft: false,
    canRight: false,
    pageData: null,
    list: [],
    maxHeight: '70vh',
    actionType: 'none',
    currentName: 'questionA',
    fristInit: 'none',
    startTime: 0,
    currentModel: 'answer',
  },
  // testType subject model
  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['jkInfo', 'subject1', 'subject4', 'completeInfo'],
      actions: ['updateSubject1', 'updateSubject4', 'updateCompleteInfo']
    })
    if (isEmpty(options)) {
      const eventChannel = this.getOpenerEventChannel()
      if (!isEmpty(eventChannel)) {
        eventChannel.on('acceptFromPage', (res) => {
          // listObj{2: 2} testType subject, model
          this.initPageData(res)
        })
      }
    } else {
      this.initPageData(options)
    }
  },
  onReady() {
    this.setData({
      startTime: Date.now()
    })
  },
  onHide() {
    console.log('hide')
  },
  onUnload() {
    this.leaveSave()
    this.storeBindings.destroyStoreBindings()
  },
  initPageData(params) {
    // pageData, answerMap, completeMap,question, allError, allCollect, list
    const originData = getInitData(params)
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
  // 答题了操作
  answerHandle(e) {
    const { question, id, correct, name } = e.detail
    this.saveAnswerResult({ hasCorrect: correct, id, question })
    const _key = name === 'question' ? 'questionA' : 'question'
    const { totalNum, correctNum, errorNum, testType } = this.data.pageData
    if (totalNum === (correctNum + errorNum)) {
      if (testType === 'order' || testType === 'random') {
        this.toResultPage()
      }
      console.log('全部完成了')
      return
    }
    // console.log(pageData)
    if (correct) {
      // 自动下一题
      this.nextQuestion('next', _key)
    } else {
    }
  },
  // 下一题数据处理 key用来标识当前活动question
  nextQuestion(type = 'next', key) {
    let { currentIndex, totalNum } = this.data.pageData
    let { list, completeMap, canLeft, canRight,
      currentName,
      allCollect,
      answerMap
    } = this.data
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
      question = dealQuestionInfo({ target, answerMap })
    }
    const sData = initSlideInfo(currentIndex, totalNum)
    const name = currentName === 'question' ? 'questionA' : 'question'
    if (this.data.currentModel === 'backQuestion') {
      this.updateQuestion(question)
    }
    this.setData({
      [key]: question,
      canLeft: sData.canLeft,
      canRight: sData.canRight,
      currentName: name,
      isCollect: !!allCollect[question.id],
      'pageData.currentIndex': currentIndex,
      // 待优化
      actionType: type
    })
  },
  // 弹窗选择下标 切题
  selectTapHandle(e) {
    const { index } = e.detail
    const { currentIndex, totalNum } = this.data.pageData
    const { completeMap, answerMap, list, currentName, currentModel } = this.data
    if (index === currentIndex) {
      return
    }
    let question = completeMap[index]
    if (!question) {
      const target = list[index]
      question = dealQuestionInfo({ target, answerMap })
    }
    if (currentModel === 'backQuestion') {
      this.updateQuestion(question)
    }
    const { canLeft, canRight } = initSlideInfo(index, totalNum)
    const actionType = currentIndex < index ? 'next' : 'pre'
    const name = currentName === 'question' ? 'questionA' : 'question'
    this.setData({
      [currentName]: question,
      'pageData.currentIndex': index,
      canRight,
      canLeft,
      // 待优化 下两者
      actionType,
      currentName: name
    })
  },
  // 将correct, error的问题保存到对应Map中 纯数据中, 返回数据大小
  saveAnswerResult(options = {}) {
    const { hasCorrect, id, question } = options
    const { correct, error, currentIndex } = this.data.pageData
    const { allError, completeMap } = this.data

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
    // 待优化 index = id - 1
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
  // 离开保存所有 all|error|collect singer|error|collect 更新store
  leaveSave() {
    const { testType } = this.data.pageData
    // order||random rand error||todayError collect other
    if (testType === 'rand') {
      return
    }
    const { subject, model } = this.data.jkInfo
    const { allError, allCollect, completeMap } = this.data
    // info
    const key = subject == 1 ? storageKey[subject][model] : storageKey[subject]
    // 只保存
    if (isEmpty(completeMap)) {
      saveToStorage({key: key.info, data: { error: allError, collect: allCollect } })
      return
    }
    const { errorNum, correctNum, correct, error } = this.data.pageData
    const _testType = testType === 'random' ? 'order' : testType
    const _result = Object.assign(
      {},
      checkKeyExist(key.type) || {},
      { [_testType]: { error, correct } }
    )
    saveToStorage({key: key.type, data: _result})
    saveToStorage({key: key.info, data: { error: allError, collect: allCollect } })
    const updateObj = {}
    updateObj.error = allError
    updateObj.errorNum = Object.keys(allError).length
    updateObj.collect = allCollect
    updateObj.collectNum = Object.keys(allCollect).length
    if (_testType === 'order') {
      updateObj.completeNum = errorNum + correctNum
      updateObj._errorNum = errorNum
      updateObj._correctNum = correctNum
    }
    this[`updateSubject${subject}`](updateObj)
  },
  // 打开弹窗
  showDialog(e) {
    this.selectComponent('#dialog').showDialog()
  },
  // 上下题 处理从 question组件触发的操作, 保留 按钮操作
  handlePreNext(e) {
    // const { type } = e.detail
    this.nextQuestion(e.detail.type, 'question')
  },
  // 收藏 胶卷 || 其他
  btnClickHandle(e) {
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
    }
    console.log(e.detail)
  },
  // 动画结束后，设状态
  animateEnd() {
    this.setData({
      actionType: 'none'
    })
  },
  // 修改类型 针对回退
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
  // 返回主页面
  backHandle() {
    const { testType } = this.data.pageData
    const { completeMap } = this.data
    switch (testType) {
      case 'order':
        if (Object.keys(completeMap).length !== 0) {
          this.toResultPage()
        } else {
          wx.navigateBack()
        }
        break;
      case 'random':
        this.toResultPage()
        break;
      case 'rand':
        break;
      default:
        wx.navigateBack()
        break; 
    }
  },
  // 切换模式
  toggleHandle(e) {
    const { type } = e.detail
    this.setData({
      currentModel: type
    })
    this.updateQuestion(type)
  },
  getOpeKey() {
    const { currentName } = this.data
    return currentName === 'question' ? 'questionA' : 'question'
  },
  updateQuestion(obj) {
    if (obj && isObject(obj)) {
      obj.isLock = false
      obj.userSelect = Object.assign({}, obj._userSelect)
      obj.isLockAnswer = true
    } else {
      const _key = this.getOpeKey()
      const isLock = `${_key}.isLock`
      const isLockAnswer = `${_key}.isLockAnswer`
      const userSelect = `${_key}.userSelect`
      const _isLock = obj === 'answer'
      const _isLockAnswer = obj !== 'answer'
      console.log(this.data[_key])
      const _userSelect = obj === 'answer'
        ? {}
        : Object.assign({}, this.data[_key]._userSelect)

      this.setData({
        [isLock]: _isLock,
        [userSelect]: _userSelect,
        [isLockAnswer]: _isLockAnswer
      })
    }
  },
  // order | random
  toResultPage() {
    const { startTime, completeMap, allError } = this.data
    const { totalNum, errorNum, correctNum } = this.data.pageData
    const keys = Object.keys
    const _completeNum = keys(completeMap).length
    const _error = {}
    keys(completeMap).forEach((v, i) => {
      if (allError[v]) {
        _error[v] = allError[v]
      }
    })
    const _errorNum = keys(_error).length
    const completeInfo = {
      totalNum,
      completeNum: errorNum + correctNum,
      _completeNum,
      // 本次错题
      _error,
      _errorNum,
      _correctNum: _completeNum - _errorNum,
      p_time: Date.now() - startTime
    }
    this.updateCompleteInfo(completeInfo)  
    wx.redirectTo({
      url: '../praticeA/praticeA?type=complete'
    })
  }
})