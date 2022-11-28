const { funList } = require('../../common/js/mockData')
const { getAnswerMapData } = require('../../service/answer')
const { checkKeyExist, saveToStorage } = require('../../storage/storage')
const { orderQueryExam, queryAnswer } = require('../../request/index')
const { routerMap, storageKey } = require('../../common/js/constant')
const { storeBindingsBehavior } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [ storeBindingsBehavior, computedBehavior ],
  data: {
    tabList: [
      {
        name: '科目一',
        id: 1,
        value: 1
      },
      {
        name: '科目四',
        id: 4,
        value: 4
      },
    ],
    subjectPannel: [
      { 
        code: 'subject1',
        textArr: [ '顺序学习', '仿真冲刺' ],
        textPlace: 'go-1-go',
        funList: funList
      },
      { 
        code: 'subject4',
        textArr: [ '顺序学习', '仿真冲刺' ],
        textPlace: 'go-4-go',
        funList: funList
      }
    ]
  },
  storeBindings: {
    store,
    fields: {
      subject1: 'subject1',
      subject4: 'subject4',
      jkInfo: 'jkInfo',
      allExamInfo: 'allExamInfo'
    },
    actions: ['updateJKInfo', 'updateSubject1', 'updateSubject4', 'updateAnswerMap', 'updateAllExamInfo' ]
  },
  lifetimes: {
    detached() {
      this.saveWebInfo()
    }
  },
  pageLifetimes: {
    hide() {
      this.saveWebInfo()
    }
  },
  methods: {
    onLoad() {
      console.log('load')
      this.initPageInfo()
    },
    // 科目切换
    toggleHandle(e) {
      const { data, index } = e.detail
      const { model } = this.data.jkInfo
      // console.log(data, index)
      const key = data.value === 1
        ? storageKey[data.value][model]
        : storageKey[data.value]
      const result = checkKeyExist(key.exam) || []
      this.updateAllExamInfo(result, 'toggle')
      this.updateJKInfo({ subject: data.value })
    },
    // 一系列初始化 userInfo answerMap total question
    initPageInfo() {
      const webInfo = checkKeyExist(storageKey.webInfo)
      webInfo && this.initFromStore(webInfo)
      const subject = webInfo ? webInfo.jkInfo.subject : 1
      const model = webInfo ? webInfo.jkInfo.model : 'c1'
      const key = subject === 1 ? storageKey[subject][model] : storageKey[subject]
      const examList = checkKeyExist(key.exam)
      if (examList && Array.isArray(examList)) {
        this.updateAllExamInfo(examList)
      }
      this.reqeustDataInit(subject, webInfo, model)
    },
    // 跳转页面
    openPage(e) {
      const { testType } = e.detail
      const { jkInfo } = this.data
      const url = this.getRouteUrl(testType)
      wx.navigateTo({
        url,
        success(res) {
          res.eventChannel.emit('acceptFromHome', {
            testType,
            subject: jkInfo.subject,
            model: jkInfo.model
          })
        },
        fail(res) {
          wx.showToast({
            title: res.errMsg,
            icon: 'error'
          })
        }
      })
    },
    // question, answerMap
    reqeustDataInit(subject, webInfo, model) {
      const answer = checkKeyExist(storageKey.answerMap)
      if (!answer) {
        queryAnswer({ url: 'answers.json' })
          .then((res) => {
            const result = getAnswerMapData(res.result)
            saveToStorage({ key: storageKey.answerMap, data: result })
            this.updateAnswerMap(result)
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.updateAnswerMap(answer)
      }
      const key = subject === 4
        ? storageKey[subject]
        : storageKey[subject][model]
      const exam = checkKeyExist(key.all)
      if (!webInfo && exam) {
        this.updateInfoFromStore(['1','4'], model)
      }
      if (!exam) {
        this.updateAllSubject(subject, model)
      }
    },
    // jkInfo, subject1, subject4
    initFromStore(result = {}) {
      const { jkInfo, subject1, subject4 } = result
      this.updateJKInfo(jkInfo)
      this.updateSubject1(subject1)
      this.updateSubject4(subject4)
    },
    // 网页用户状态
    saveWebInfo() {
      const { jkInfo, subject1, subject4 } = this.data
      saveToStorage({
        key: storageKey.webInfo,
        data: { jkInfo, subject1, subject4 }
      })
    },
    saveAllSubject(result, subject, model) {
      const key = subject === 1 ? storageKey[subject][model] : storageKey[subject]
      saveToStorage({
        key: key.all,
        data: result
      })
      this[`updateSubject${subject}`]({
        totalNum: result.length || 0
      })
    },
    // 更新题库 all 所有, 请求
    updateAllSubject(subject, model) {
      const promise1 = orderQueryExam({ url: `query-${model}.json` })
      const promise2 = orderQueryExam({ url: 'query-4.json' })
      promise1
        .then((res) => {
          this.saveAllSubject(res.result, 1, model)
        })
        .catch((err) => {
          console.log(err)
        })
      promise2
        .then((res) => {
          this.saveAllSubject(res.result, 4, model)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 更新webInfo信息
    updateInfoFromStore(arr = ['1', '4'], model = 'c1') {
      arr.forEach((v) => {
        const key = v === '1' ? storageKey[v][model] : storageKey[v]
        const list = checkKeyExist(key.all) || []
        const type = checkKeyExist(key.type) || {}
        const info = checkKeyExist(key.info) || {}
        const _error = type.order?.error || {}
        const _correct = type.order?.correct || {}
        const error = info.error || {}
        const collect = info.collect || {}
        const keys = Object.keys
        this[`updateSubject${v}`]({
          totalNum: list.length || 0,
          _errorNum: keys(_error).length,
          _correctNum: keys(_correct).length,
          completeNum: keys(_error).length + keys(_correct).length,
          error,
          collect,
          errorNum: keys(error).length,
          collectNum: keys(collect).length
        })
      })
    },
    getRouteUrl(testType) {
      const url = routerMap.get(testType)
      const { subject, model } = this.data.jkInfo
      const search = `?testType=${testType}&subject=${subject}&model=${model}`
      switch (testType) {
        case 'order':
          return url + search
        case 'random':
          return url + search
        case 'rand':
          return url + search
        case 'error':
          return url + search
        case 'special-pratice':
          return url + search
        case 'icon-tricks':
          return url + search
        default:
          return url
      }
    }
  }
})