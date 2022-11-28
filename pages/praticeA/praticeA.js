// pages/praticeA/praticeA.js
const { storeBindingsBehavior } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
const { formatNumber } = require('../../utils/util')
const { routerMap, storageKey } = require('../../common/js/constant')
const { saveToStorage, checkKeyExist } = require('../../storage/storage')
Component({
  behaviors: [ storeBindingsBehavior ],
  storeBindings: {
    store,
    fields: ['completeInfo', 'jkInfo']
  },
  lifetimes: {
    attached() {
      const {
        completeNum,
        p_time,
        totalNum,
        _completeNum,
        _correctNum,
        _errorNum
      } = this.data.completeInfo
      console.log(this.data.completeInfo)
      const _correctPen = ((_correctNum / _completeNum) * 100).toFixed()
      const completePen = ((completeNum / totalNum) * 100).toFixed(2)
      const restNum = totalNum - completeNum
      const s = formatNumber(Math.floor((p_time / 1000) % 60))
      const m = formatNumber(Math.floor((p_time / 60000) % 60))
      this.setData({
        showInfo: {
          _correctPen,
          completePen,
          _errorNum,
          _completeNum,
          restNum,
          completeNum,
          p_time: `${m}:${s}`
        }
      })
      const { subject, model } = this.data.jkInfo
      const key = subject === 1
        ? storageKey[subject][model]
        : storageKey[subject]
      const result = checkKeyExist(key.type)
      if (result) {
        result['current-error'] = {}
        saveToStorage({ key: key.type, data: result })
      }
    }
  },
  methods: {
    checkError() {
      const { _errorNum, _error } = this.data.completeInfo
      const { subject, model } = this.data.jkInfo
      if (_errorNum === 0) {
        console.log('没有错题')
        return
      }
      wx.navigateTo({
        url: '../pratice/pratice',
        success(res) {
          res.eventChannel.emit('acceptFromPage', {
            testType: 'current-error',
            subject,
            model,
            listObj: _error
          })
        }
      })
    },
    tapHandle(e) {
      const { type } = e.currentTarget.dataset
      const { subject, model } = this.data.jkInfo
      const params =
        `?testType=${type}&subject=${subject}&model=${model}`
      wx.redirectTo({
        url: routerMap.get(type) + params,
      })
    }
  }
})