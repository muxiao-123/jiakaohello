// pages/special-pratice/special-pratice.js
const { checkKeyExist } = require('../../storage/storage')
const { chapterRegs, specialRegs, storageKey } = require('../../common/js/constant')
const { storeBindingsBehavior } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
const { getColor } = require('../../common/js/color')
const { routerMap } = require('../../common/js/constant')
Component({
  behaviors: [ storeBindingsBehavior ],
  data: {
    tabList: [
      {
        name: '章节练习',
        id: 1,
        value: '1',
        code: 'chapter'
      },
      {
        name: '专项训练',
        id: 2,
        value: '2',
        code: 'special'
      },
    ],
    current: {
      name: '章节练习',
      id: 1,
      value: '1',
      code: 'chapter'
    },
    chapterMap: null,
    specialMap: null
  },
  storeBindings: {
    store,
    fields: {
      jkInfo: 'jkInfo',
    }
  },
  lifetimes: {
    attached() {
      console.log(typeof this.data.jkInfo.subject)
    }
  },
  methods: {
    onLoad(options) {
      const { subject = 1, model = 'c1' } = options
      const key = parseInt(subject) === 1
      ? storageKey[subject][model]
      : storageKey[subject]
      const result = checkKeyExist(key.all) || []
      this.chapterOpe(result)
      wx.nextTick(() => {
        this.specialOpe(result)
      })
    },
    chapterOpe(result) {
      const temp = result.reduce((pre, cur, i) => {
        const { question, explains, id } = cur
        for (const chapter of chapterRegs) {
          if (this.checkReg(question, explains, chapter.reg)) {
            this.checkKey(pre, chapter)
            pre[chapter.name].list[id] = id
          }
        }
        return pre
      }, {})
      this.extendInfo(temp)
      this.setData({
        chapterMap: temp
      })
    },
    specialOpe(result) {
      const temp = result.reduce((pre, cur, i) => {
        const { question, explains, id } = cur
        for (const special of specialRegs) {
          const { reg, name } = special
          if (special.reg) {
            if (this.checkReg(question, explains, reg)) {
              this.checkKey(pre, special)
              pre[name].list[id] = id
            }
          } else {
            this.checkMulti(pre, cur, special)
          }
        }
        return pre
      }, {})
      this.extendInfo(temp)
      this.setData({
        specialMap: temp
      })
    },
    checkKey(orign, target) {
      if(!orign[target.name]) {
        orign[target.name] = {
          name: target.name,
          title: target.title,
          list: {},
        }
      }
    },
    checkReg(question, explains, reg) {
      return question.search(reg) > -1 || explains.search(reg) > -1
    },
    checkMulti(pre, cur, special) {
      switch(special.name) {
        case 'word':
          if (!cur.url) {
            this.checkKey(pre, special)
            pre[special.name].list[cur.id] = cur.id
          }
          break;
        case 'image':
          if (cur.url) {
            this.checkKey(pre, special)
            pre[special.name].list[cur.id] = cur.id
          }
          break;
        case 'singer':
          if (cur.answer <= 4) {
            this.checkKey(pre, special)
            pre[special.name].list[cur.id] = cur.id
          }
          break;
        case 'judg':
          if (!cur.item3 && !cur.item4) {
            this.checkKey(pre, special)
            pre[special.name].list[cur.id] = cur.id
          }
          break;
        case 'correct':
          if (cur.answer == 1 && !cur.item3) {
            this.checkKey(pre, special)
            pre[special.name].list[cur.id] = cur.id
          }
          break;
        case 'error':
          if (cur.answer == 2 && !cur.item3) {
            this.checkKey(pre, special)
            pre[special.name].list[cur.id] = cur.id
          }
          break;
      }
    },
    extendInfo(target) {
      const keys = Object.keys
      keys(target).forEach((v, i) => {
        target[v].size = keys(target[v].list).length
        target[v].id = i + 1
        target[v].color = getColor(i + 1)
      })
      return target
    },
    toggle(e) {
      const { index } = e.detail
      const { tabList } = this.data
      this.setData({
        current: tabList[index]
      })
    },
    cellTapHandle(e) {
      const { name } = e.detail
      const { current, specialMap, chapterMap } = this.data
      const obj = current.code === 'special'
        ? specialMap[name]
        : chapterMap[name]
      this.toPracticePage(obj)
    },
    toPracticePage(obj) {
      const { subject, model } = this.data.jkInfo
      const { current } = this.data
      const url = routerMap.get('order')
      wx.navigateTo({
        url,
        success(res) {
          res.eventChannel.emit('acceptFromPage', {
            testType: `${obj.name}-${current.code}`,
            subject,
            model,
            listObj: obj.list
          })
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  },
})