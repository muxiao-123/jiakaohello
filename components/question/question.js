// components/question/question.js
const { getAnswerMap } = require('../../service/answer')
const { userSelectHandle } = require('../../service/exam')
Component({
  properties: {
    question: {
      type: Object,
      value: null
    },
    name: {
      type: String,
      value: 'question'
    },
    height: {
      type: String,
      value: '70vh'
    }
  },
  observers: {
    question(newValue) {
      this.resetQuestionData(newValue)
    }
  },
  data: {
    questionData: null,
    itemMap: {
      item1: 'A',
      item2: 'B',
      item3: 'C',
      item4: 'D',
      item1judg: '正确',
      item2judg: '错误'
    },
    answerMap: {
      '1': 'A',
      '2': 'B',
      '3': 'C',
      '4': 'D',
      '1judg': '正确',
      '2judg': '错误'
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        answerMap: getAnswerMap()
      })
    }
  },
  pageLifetimes: {},
  methods: {
    resetQuestionData(obj) {
      this.setData({
        questionData: obj
      })
    },
    // 单选操作逻辑 多选其他为选
    clickHandle(e) {
      const { itemMap, question } = this.data
      // if () {

      // }
      const { item } = e.currentTarget.dataset
      const obj = userSelectHandle(item, itemMap, question)
      if (obj === null) {
        return
      }
      this.setData({
        'questionData.userSelect': obj.userSelect,
        'questionData.isShowAnswer': obj.isShowAnswer,
        'questionData.isLockAnswer': obj.isLockAnswer,
        'questionData.answerResult': obj.correct,
        'questionData.isLock': obj.correct,
        'questionData.yourAnswer': obj.yourAnswer,
        'questionData.correctAnswer': obj.correctAnswer
      })
      this.triggerEvent('answer', {
        question: this.data.questionData,
        correct: obj.correct,
        id: obj.id,
        name: this.data.name     
      })
    },
    handleNextPre(e) {
      const { type } = e.currentTarget.dataset
      console.log(type)
      if (this.data.questionData.isLock) {
        return
      }
      // 上下题事件
      this.triggerEvent('toggle', { type })
    }
  },
})
