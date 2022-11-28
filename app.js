// app.js
App({
  onLaunch() {
    wx.getSystemInfo({
      success: (result) => {
        const menuBtnInfo = wx.getMenuButtonBoundingClientRect()
        const { top, height } = menuBtnInfo
        const { statusBarHeight, pixelRatio } = result
        const paddingTop = statusBarHeight
        const navHeight = statusBarHeight + height + (top - statusBarHeight) * 2
        this.globalData.navInfo = {
          paddingTop,
          navHeight
        }
      },
      fail: (err) => console.log(err)
    })
    console.log('lanuch')
  },
  onUnhandledRejection(res) {
    console.log(res.reason)
  },
  onPageNotFound(res) {
    console.log('page not found')
    console.log(res)
  },
  globalData: {
    userInfo: null
  }
})
