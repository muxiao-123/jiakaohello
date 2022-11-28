const { storeBindingsBehavior } = require('mobx-miniprogram-bindings')
const computedBehavior = require('miniprogram-computed').behavior
const { store } = require('../store/index')
const { navInfo } = getApp().globalData
const { isFunction } = require('../utils/helper')
module.exports = Behavior({
  options: {
    pureDataPattern: /(subject1|subject4|jkInfo|allExamInfo)/
  },
  behaviors: [ storeBindingsBehavior, computedBehavior ],
  storeBindings: {
    store,
    fields: [
      'jkInfo',
      'subject1',
      'subject4',
      'c_subject',
      'allExamInfo'
    ],
    actions: [
      'updateSubject1',
      'updateSubject4',
      'updateJKInfo',
      'updateAllExamInfo'
    ]
  },
  data: {
    navInfo,
    userInfo: {
      userImage: '',
      userName: 'muxiao',
      desc: '找驾考 考驾照 就用 驾考hello',
      color: ''
    }
  },
  watch: {
    'subject1.**': function(newValue) {
      console.log('subject1')
      if (this.data.jkInfo.subject == 1) {
        if (newValue) {
          const { _watchUpdateSubject1 } = this
          if (_watchUpdateSubject1 && isFunction(_watchUpdateSubject1)) {
            _watchUpdateSubject1.call(this, newValue)
          }
        }
      }
    },
    'subject4.**': function(newValue) {
      console.log('subject4')

      if (this.data.jkInfo.subject == 4) {
        if (newValue) {
          const { _watchUpdateSubject4 } = this
          if (_watchUpdateSubject4 && isFunction(_watchUpdateSubject4)) {
            _watchUpdateSubject4.call(this, newValue)
          }
        }
      }
    },
    'allExamInfo.**': function(newValue) {
      if (!newValue) {
        return
      }
      const { _watchUpdateAllExamInfo } = this
      if (_watchUpdateAllExamInfo && isFunction(_watchUpdateAllExamInfo)) {
        _watchUpdateAllExamInfo.call(this, newValue)
      }
    },
    'jkInfo.**': function(newValue) {
      if (!newValue) {
        return
      }
      const { subject } = this.data.jkInfo
      if (subject === newValue.subject) {
        return
      }
      const { _watchUpdateJKInfo } = this
      if (_watchUpdateJKInfo && isFunction(_watchUpdateJKInfo)) {
        _watchUpdateJKInfo.call(this, newValue)
      }
    },
  },
  methods: {
    // _watchUpdateSubject1() {},
    // _watchUpdateSubject4() {},
    // _watchUpdateJKInfo() {},
    // _watchUpdateAllExamInfo() {}
  }
})
