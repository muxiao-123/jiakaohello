// pages/error-set/error-set.js
const { drawBgImage, drawError } = require('../../common/js/draw')
const { checkKeyExist, saveToStorage } = require('../../storage/storage')
const { createStoreBindings } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
// const { routerMap } = require('../../common/js/router-map')
const { storageKey, routerMap } = require('../../common/js/constant')
const { isEmpty } = require('../../utils/helper')
const { todayTime } = require('../../utils/util')
Page({
  data: {
    tabList: [
      {
        name: '错题本',
        id: 1,
        value: '1'
      },
      {
        name: '收藏列表',
        id: 2,
        value: '2'
      },
    ],
    pageData: {
      errorList: [
        {
          id: 1,
          name: 'itemA',
          title: '%驾驶证-机动车-管理%',
          num: 0
        },
        {
          id: 2,
          name: 'itemB',
          title: '%图标-技巧-识别%',
          num: 0
        },
        {
          id: 3,
          name: 'itemC',
          title: '%判断-题-会中%',
          num: 0
        },
      ],
    },
    today: {
      error: {},
      errorNum: 0
    }
  },
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['jkInfo', 'c_subject'],
      actions: ['updateSubject1', 'updateSubject4']
    })
  },
  onShow() {
    // if (this.data.jkInfo) {
    //   this.initPageData()
    // }
  },
  onReady() {
    console.log(this.data.jkInfo)
    this.initImageFromCanvas()
    this.initPageData()
  },
  onHide() {
    console.log('hide')
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  initImageFromCanvas() {
    const selector = [ '.error-canvas', '.error-canvas-A' ]
    const query = this.createSelectorQuery()
    const promise = new Promise((resolve, reject) => {
      query.select(selector[0])
        .fields({ node: true, size: true }, (res) => {
          resolve(res)
        })
        .exec() 
    })
    const promise1 = new Promise((resolve, reject) => {
      query.select(selector[1])
        .fields({ node: true, size: true }, (res) => {
          resolve(res)
        })
        .exec() 
    })
    Promise.all([promise, promise1])
      .then((res) => {
        const image = drawError(res[0])
        const imageBg = drawBgImage(res[1])
        this.setData({
          url: image,
          urlA: imageBg
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  initPageData() {
    const { error } = this.data.c_subject
    if (!isEmpty(error)) {
      const { today } = this.data
      const tempObj = this.getTodayError(error)
      today.error = tempObj.error
      today.errorNum = tempObj.errorNum
      console.log(today)
      this.setData({ today })
    }
  },
  checkError(type) {
    const { errorNum, error } = this.data.c_subject
    const { today } = this.data
    if (type === 'all' && errorNum === 0) {
      console.log('你没有错误哟')
      return
    }
    if (type === 'today' && today.errorNum === 0) {
      console.log('你今天没有错误哟')
      return
    }
    const { subject, model } = this.data.jkInfo
    const url = routerMap.get('error')
    wx.navigateTo({
      url,
      success(res) {
        res.eventChannel.emit('acceptFromPage', {
          testType: type === 'today' ? 'todayError' : 'error',
          subject,
          model,
          listObj: type === 'today' ? today.error : error
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  checkCollect() {
    const { collectNum, collect } = this.data.c_subject
    if (collectNum === 0) {
      console.log('你没有收藏哟')
      return
    }
    const { subject, model } = this.data.jkInfo
    const url = routerMap.get('collect')
    wx.navigateTo({
      url,
      success(res) {
        res.eventChannel.emit('acceptFromPage', {
          testType: 'collect',
          subject,
          model,
          listObj: collect
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  checkHandle(e) {
    const { type } = e.currentTarget.dataset
    if (type === 'all' || type === 'today') {
      this.checkError(type)
    } else if ( type === 'collect') {
      this.checkCollect(type)
    }
  },
  clearAll(e) {
    const { type } = e.currentTarget.dataset
    const { errorNum } = this.data.c_subject
    console.log(type)
    if (errorNum === 0) {
      console.log('你没有错误哟')
      return
    }
    wx.showModal({
      title: 'tip',
      'content': '确定要清空错题本吗',
      cancelColor: 'cancelColor',
      success: (res) => {
        if (res.confirm) {
          this.clearUpdate()
          console.log('clear success')
        }
      }
    })
  },
  clearUpdate() {
    const { subject, model } = this.data.jkInfo
    const key = subject === 1
      ? storageKey[subject][model]
      : storageKey[subject]
    const info = checkKeyExist(key.info)
    this[`updateSubject${subject}`]({
      errorNum: 0,
      error: {}
    })
    info.error = {}
    saveToStorage({ key, info })
    this.setData({
      'today.error': {},
      'today.errorNum': 0
    })
  },
  getTodayError(error = {}) {
    const preTime = todayTime()
    const todayError = {}
    Object.keys(error).forEach((v, i) => {
      if (error[`${v}`].date > preTime) {
        todayError[`${v}`] = v
      }
    })
    return {
      error: todayError,
      errorNum: Object.keys(todayError).length
    }
  }
})