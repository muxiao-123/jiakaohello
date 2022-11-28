// pages/icon-tricks/icon-tricks.js
const { checkKeyExist } = require('../../storage/storage')
const { iconTrickRegs, storageKey } = require('../../common/js/constant')
const { storeBindingsBehavior } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
const { getColor } = require('../../common/js/color')
const { routerMap } = require('../../common/js/constant')
Component({
  behaviors: [ storeBindingsBehavior ],
  data: {
    list: [
      {
        id: 1,
        name: 'ok',
        title: '建通标志大全',
        nums: 78,
        color: 'yellow'
      },
      {
        id: 2,
        name: 'ok',
        title: '建通Dsada标志大全',
        nums: 8,
        color: 'orange'
      },
      {
        id: 3,
        name: 'ok',
        title: '发到付建通标志大全',
        nums: 78,
        color: 'blue'
      },
      {
        id: 4,
        name: 'ok',
        title: '建通标志大发放的全',
        nums: 78,
        color: 'red'
      },
    ],
    iconTrickMap: null
  },
  storeBindings: {
    store,
    fields: {
      jkInfo: 'jkInfo',
    }
  },
  methods: {
    onLoad(options) {
      const { subject = 1, model = 'c1' } = options
      const key = parseInt(subject) === 1
      ? storageKey[subject][model]
      : storageKey[subject]
      const result = checkKeyExist(key.all) || []
      this.imageOpe(result)
    },
    tapHandle(e) {
      const { value } = e.currentTarget.dataset
      this.toPracticePage(this.data.iconTrickMap[value])
    },
    imageOpe(result) {
      const temp = result.reduce((pre, cur, i) => {
        const { question, explains, id, url } = cur
        for (const iconTrick of iconTrickRegs) {
          if (this.checkReg(question, explains, iconTrick.reg, url)) {
            this.checkKey(pre, iconTrick)
            pre[iconTrick.name].list[id] = url
          }
        }
        return pre
      }, {})
      this.extendInfo(temp)
      this.setData({
        iconTrickMap: temp
      })
    },
    checkReg(question, explains, reg, url) {
      if (url) {
        return question.search(reg) > -1 || explains.search(reg) > -1
      } else {
        return false
      }
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
    extendInfo(target) {
      const keys = Object.keys
      keys(target).forEach((v, i) => {
        target[v].size = keys(target[v].list).length
        target[v].id = i + 1
        target[v].color = getColor(i + 1)
        target[v]._list = this.getshowList(target[v].list)
      })
      return target
    },
    getshowList(obj) {
      const temp = []
      for (const v in obj) {
        if (temp.length >= 4) {
          break
        }
        temp.push(obj[v])
      }
      return temp.slice()
    },
    toPracticePage(obj) {
      const { subject, model } = this.data.jkInfo
      const url = routerMap.get('order')
      wx.navigateTo({
        url,
        success(res) {
          res.eventChannel.emit('acceptFromPage', {
            testType: `${obj.name}-icon`,
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
  }
})