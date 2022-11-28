// pages/500Topic/500Topic.js
const { createRandom } = require('../../utils/util')
const { storeBindingsBehavior } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
const { storageKey, routerMap } = require('../../common/js/constant')
const { checkKeyExist } = require('../../storage/storage')
Component({
  behaviors: [ storeBindingsBehavior ],
  storeBindings: {
    store,
    fields: {
      jkInfo: () => store.jkInfo
    }
  },
  methods: {
    onLoad() {},
    payHandle() {
      wx.showModal({
        title: 'tip',
        content: '确定真的需要吗',
        cancelColor: 'cancelColor',
        cancelText: '太low了',
        confirmText: '秋秋了',
        success: (res) => {
          if (res.confirm) {
            this.toPraticePage()
          }
        }
      })
    },
    toPraticePage() {
      const random = createRandom(1000, 500)
      const listObj  = random.reduce((pre, cur, i) => {
        pre[cur] = cur
        return pre
      }, {})
      console.log(listObj)
      wx.navigateBack()
    }
  }
})