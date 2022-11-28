const { checkKeyExist } = require('../../storage/storage')
Component({
  properties: {
    tabList: {
      type: Array
    },
    height: {
      type: String
    }
  },
  options: {
    multipleSlots: true
  },
  data: {
    show: true,
    scrollIntoId: 'subject-a',
    currentIndex: 0
  },
  lifetimes: {
    ready() {
      const webInfo = checkKeyExist('webInfo')
      if (webInfo) {
        const { subject } = webInfo.jkInfo
        subject === 4 && this.setData({
          currentIndex: 1
        })
      }
    }
  },
  methods: {
    // 滑动 点击都触发 => 双向绑定
    changeHandle(e) {
      const { current } = e.detail
      // console.log(current)
      // if (current === this.data.currentIndex) {
      //   return
      // }
      this.setData({
        currentIndex: current
      })
      this._triggerEvent(current, e.type)
    },
    // 点击触发
    toggleSubject(e) {
      // debugger
      const { index } = e.currentTarget.dataset
      // console.log(index)
      if (index === this.data.currentIndex) {
        return
      }
      this.setData({
        currentIndex: index
      })
      this._triggerEvent(index, e.type)
    },
    _triggerEvent(index, type) {
      if (type === 'change') {
        this.triggerEvent(
          'toggle',
          { data: this.properties.tabList[index], index }
        ) 
      }
    }
  }
})