// components/subject/subject.js
const { colorMap } = require('../../common/js/color')
const { draw } = require('../../common/js/draw')
const { storeBindingsBehavior } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
Component({
  behaviors: [ storeBindingsBehavior ],
  properties: {
    // 科目面板选择信息
    subjectInfo: {
      type: Object
    },
    type: {
      type: String,
      default: 'subject1'
    }
  },
  storeBindings: {
    store,
    fields: ['subject1', 'subject4']
  },
  data: {
    percentage: '0/0'
    // canvasUrl
  },
  lifetimes: {
    attached() {
      const query = this.createSelectorQuery()
      query.select('#order-canvas')
        .fields({ node: true, size: true }, (res) => {
          const urlA = draw({ res })
          const urlB = draw({ res, cirleAColor: colorMap.themeDark, cicleBColor: colorMap.green })
          if (urlA) {
            this.setData({
              canvasUrlA: urlA || '',
              canvasUrlB: urlB || ''
            })
          }
        })
        .exec()
      // console.log(this.data.subject1)
    }
  },
  methods: {
    errorHandle(res) {
      console.log(res)
    },
    tapHandle(e) {
      const { testType } = e.currentTarget.dataset
      this.triggerEvent('openpage', { testType })
    }
  }
})
