// components/jk-nav-bar/jk-nav-bar.js
Component({
  options: {
    pureDataPattern: /^_/,
  },
  properties: {
    iconClass: {
      type: String
    },
    needSlot: {
      type: Boolean,
      default: false
    },
    testType: {
      type: String,
      default: 'order'
    }
  },
  data: {
    activeIndex: 1,
  },
  lifetimes: {
    created() {
    },
    attached() {
      const { statusBarHeight } = wx.getSystemInfoSync()
      const { height, top } = wx.getMenuButtonBoundingClientRect()
      this.setData({
        paddingTop: statusBarHeight,
        height: (top - statusBarHeight) * 2 + height,
        _height: statusBarHeight + (top - statusBarHeight) * 2 + height
      })
    },
    methods: {
      _getHeight() {
        return this.data._height
      }
    }
  },

  methods: {
    back() {
      this.triggerEvent('back')
    },
    toggleHandle(e) {
      const { index, type } = e.currentTarget.dataset
      this.setData({
        activeIndex: index
      })
      if (index === 1) {}
      this.triggerEvent('toggle', { type })
    }
  }
})
