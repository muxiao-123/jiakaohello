// components/completeDialog/completeDialog.js
const { formatRestTime } = require('../../utils/util')
Component({
  properties: {
    showData: {
      type: Object,
    }
  },
  data: {
    dialog: false,
    themeColor: 'red',
    // completeData: null,
    completeData: {
      totalNum: 0,
      errorNum: 0,
      correctNum: 0,
      completeNum: 0,
      restNum: 0,
      e_pencentage: 0,
      c_pencentage: 0,
      testType: 'rand'
    },
    // submit 胶卷(胶卷||继续) continue 继续作答
    actionType: 'continue'
  },
  methods: {
    showDialog(pageData, actionType, time) {
      // actionType default submit
      this.calcPageInfo(pageData, actionType)
      this.setData({
        dialog: true
      })
    },
    closeDialog() {
      this.setData({
        dialog: false
      })
    },
    calcPageInfo(pageData, actionType) {
      // pageData, type || submit || continue
      const { totalNum, errorNum, correctNum, testType, restTime } = pageData
      const c_pencentage = (correctNum / totalNum * 100 ).toFixed(2)
      const e_pencentage = (errorNum / totalNum * 100 ).toFixed(2)
      const completeNum = errorNum + correctNum
      const restNum = totalNum - completeNum
      this.setData({
        completeData: {
          totalNum,
          errorNum,
          correctNum,
          completeNum,
          restNum,
          e_pencentage,
          c_pencentage,
          testType,
          restTime: formatRestTime(restTime)
        },
        actionType: actionType ? actionType : 'submit'
      })
    },
    // 按钮操作
    tapHandle(e) {
      const { value } = e.currentTarget.dataset
      this.closeDialog()
      this.triggerEvent('btnclick', { type: value })
    },
    startCanvas() {
      // const { totalNum, restNum } = this.data.completeData
      // const num = ((restNum / totalNum) * 100).toFixed() * 3.6
      // console.log(this.selectComponent('#circle-slide'))
      // this.selectComponent('#circle-slide').paintCanvas(num)
    }
  }
})
