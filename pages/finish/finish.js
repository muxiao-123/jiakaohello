// pages/finish/finish.js
const { storeBindingsBehavior } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
const { formatRestTime } = require('../../utils/util')
const { routerMap } = require('../../common/js/constant')
const { saveToStorage, checkKeyExist } = require('../../storage/storage')
const { storageKey } = require('../../common/js/constant')
const canvasBehavior = require('../../behaviors/canvasBehavior')
const { drawFinishBg } = require('../../common/js/draw')
Component({ 
  behaviors: [ storeBindingsBehavior, canvasBehavior ],
  data: {
    selectArr: [
      { name: 'once-error', iconLeft: 'icon-cuotiben', id: 1, item1: '本次错题', item2: '练习本次错题', iconRight: 'icon-guanyuwomen' },
      { name: 'read-exam', iconLeft: 'icon-chakan', id: 2, item1: '回顾试卷', item2: '查看本次考试情况', iconRight: 'icon-guanyuwomen' },
      { name: 'rand', iconLeft: 'icon-lianxi', id: 3, item1: '重新考试', item2: '成绩不满意再考一次', iconRight: 'icon-guanyuwomen' },
    ],
    pageData: {
      examId: '',
      grade: 89,
      name: '马路杀手',
      completeMap: {},
      totalNum: '',
      errorNum: '',
      error: {},
      correct: {},
      correctNum: '',
      examDate: '',
      completeDate: '',
    },
    _pageData: null,
  },
  lifetimes: {
    attached() {
      this.initData()
    },
    ready() {
     this.drawBackground()
    },
    detached() {
      console.log('detached')
      const { subject, model } = this.data.jkInfo
      const key = subject === 1
        ? storageKey[subject][model]
        : storageKey[subject]
      saveToStorage({ key: key.exam, data: this.data.allExamInfo })
      const result = checkKeyExist(key.type)
      if (result) {
        result['once-error'] = {}
        saveToStorage({ key: key.type, data: result })
      }
      this.updateExamInfo({})
    }
  },
  storeBindings: {
    store,
    fields: ['examInfo', 'jkInfo', 'allExamInfo'],
    actions: ['updateExamInfo', 'updateAllExamInfo']
  },
  methods: {
    showHandle(e) {
      const { value } = e.currentTarget.dataset
      const { errorNum, error, _list, correct, completeMap } = this.data._pageData
      const { subject, model } = this.data.jkInfo
      switch (value) {
        case 'once-error':
          if (errorNum === 0) {
            console.log('no error')
            return
          }
          this.toPraticePage(value, subject, model, error)
          break;
        case 'read-exam':
          this.toPraticePage(value, subject, model, _list, error, correct, completeMap)
          break;
        case 'rand':
          const key = `?testType=rand&subject=${subject}&model=${model}`
          wx.redirectTo({
            url: routerMap.get('rand') + key,
          })
          console.log('radn')
          break;
      }
      // console.log(value)
      // this.showCDialg()
    },
    initData() {
      const {
        correct,
        error,
        date,
        errorNum,
        correctNum,
        list,
        restTime,
        totalNum,
        completeMap
       } = this.data.examInfo
       const timeText = formatRestTime(restTime, 'text')
       const grade = ((correctNum / totalNum) * 100).toFixed()
       const name = this.getName(grade)
       const gradeText = this.getGradeText(grade)
       const _list = list.reduce((pre, cur, i) => {
          pre[cur.id] = cur.id
          return pre
       }, {})
       const target = { completeMap, timeText, grade, gradeText, name, _list, error,correct, date, errorNum }
       this.setData({
         _pageData: Object.assign({}, target)      
       })
       delete target.completeMap
       delete target.error
       delete target.correct
       delete target._list
       console.log(target)
       this.updateAllExamInfo([target])

       console.log(timeText)
    },
    getName(grade) {
      if (grade === 100) {
        return '秋名山车神'
      } else if (grade >= 80) {
        return '荡秋千'
      } else if (grade >= 60) {
        return '正规驾驶员'
      } else {
        return '马路杀手'
      }
    },
    getGradeText(grade) {
      if (grade == 100) {
        return '满分'
      } else if (grade >= 80) {
        return '优秀'
      } else if (grade >= 60) {
        return '及格'
      } else {
        return '不及格'
      }
    },
    toPraticePage(testType, subject, model, listObj, error, correct, completeMap) {
      wx.navigateTo({
        url: routerMap.get('order'),
        success(res) {
          res.eventChannel.emit('acceptFromPage', {
            testType,
            subject,
            model,
            listObj,
            error,
            correct,
            completeMap
          })
        }
      })
    },
    async drawBackground() {
      const obj = await this.initCanvas('.finish-canvas')
      const url = drawFinishBg(obj)
      this.setData({
        bgImage: url
      })
    }
  }
})