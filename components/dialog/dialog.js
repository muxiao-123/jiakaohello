// const { storeBindingsBehavior } = require('mobx-miniprogram-bindings')
// const computedBehavior = require('miniprogram-computed').behavior
// const { store } = require('../../store/index')
Component({
  // behaviors: [ storeBindingsBehavior, computedBehavior ],
  properties: {
    isCollect: {
      type: Boolean,
      value: false
    },
    examInfo: {
      type: Object,
      value: null
    },
    list: {
      type: Array,
      value: []
    }
  },
  data: {
    dialog: false,
    // 控制离开动画
    show: true,
    // 滚动到第几个
    fixName: 'item0',
    pannelData: [],
    c_subject: {}
  },
  lifetimes: {
    attached() {}
  },
  methods: {
    showDialog() {
      const pannelData = this.initPannelList()
      wx.nextTick(() => {
        this.setData({
          dialog: true,
          show: true
        })
        this.getBoundingRectInfo()
      })
      this.setData({
        pannelData: [ pannelData ]
      })
    },
    closeDialog() {
      this.setData({
        show: false
      })
    },
    // 关闭dialog 触发动画
    animationend() {
      if (!this.data.show) {
        this.setData({
          dialog: false
        })
      }
    },
    // 触发选中题目
    tapHandle(e) {
      const { index } = e.target.dataset
      this.triggerEvent('selectTap', { index })
      this.closeDialog()
    },
    // 滚动操作 吸顶
    dragendHandle(e) {
      const { scrollTop } = e.detail
      const scrollItems = this.scrollItems
      const { title } = this.data.nodeInfo
      let i = 0, length = scrollItems.size
      while (i < length) {
        if (scrollTop < scrollItems.get(`item${i}`) - title.height + 2) {
          // console.log(`item${i}`)
          this.data.fixName !== `item${i}` && this.setData({fixName: `item${i}`})
          break;
        } else if (scrollTop < scrollItems.get(`item${i}`)) {
          console.log(`temproty`)
          this.data.fixName !== 'temproty' && this.setData({fixName: 'temproty'})
          break;
        } else {
          i++
        }
      }
    },
    // 滚动子项rect数据
    getBoundingRectInfo() {
      const query = this.createSelectorQuery().in(this)
      const promise1 = new Promise((resolve, reject) => {
        query.selectAll('.scroll-item')
          .boundingClientRect((res) => {
            const scrollItems = res.map((v, i) => {
              return { height: v.height, id: v.id }
            })
            resolve({ scrollItems })
          })
          .exec()
      })
      const promise2 = new Promise((resolve, reject) => {
        query.select('.scroll-item-title')
          .boundingClientRect((res) => {
            resolve({ title: res })
          })
          .exec()
      })
      Promise.all([promise1, promise2])
        .then((res) => {
          const nodeInfo = res.reduce((pre, cur, i) => {
            if (cur.scrollItems) {
              cur.scrollItems.forEach((v, i) => {
                pre[v.id] = { height: v.height }
              })
            } else {
              pre.title = { height: cur.title.height }
            }
            return pre
          }, {})
          let scrollItems = this.getScrollItems(nodeInfo)
          scrollItems.delete('total')
          this.scrollItems = scrollItems
          this.setData({
            nodeInfo
          })
          this.nodeInfo = nodeInfo
        })
    },
    // 滚动内容子项height数据
    getScrollItems(nodeInfo) {
      const { pannelData } = this.data
      return pannelData.reduce((pre, cur, i) => {
        if (nodeInfo[cur.name]) {
          pre.set('total', pre.get('total') + nodeInfo[cur.name].height)
          pre.set(cur.name, pre.get('total'))
        }
        return pre
      }, new Map([['total', 0]]))
    },
    initPannelList() {
      const { list, examInfo } = this.data
      const pannelList = list.map((v, i) => {
        const question = {}
        question.id = v.id
        if (examInfo.correct[v.id]) {
          question.answerResult = 'correct'
        } else if (examInfo.error[v.id]) {
          question.answerResult = 'error'
        } else {
          question.answerResult = 'none'
        }
        question.index = i
        return question
      })
      return {
        id: 2,
        lists: pannelList.slice(),
        name: 'item0',
        title: '第一章 基础知识问答'
      }
    },
    btnclick(e) {
      console.log(e.detail)
      this.triggerEvent('btnclick', { type: e.detail.type })
    }
  }
})