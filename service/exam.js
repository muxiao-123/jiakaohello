const { isEmpty } = require('../utils/helper')
const { orignAnswer } = require('../common/js/constant')

const getAnswerText = (answer, item3, item4) => {
  let answerText = orignAnswer[answer]
  if (answer <= 2) {
    if (!item3 || !item4) {
      answerText = answerText.slice(-2)
    } else {
      answerText = answerText.slice(0, 1)
    }
  }
  return answerText
}
// 单选操作逻辑 多选其他为选
const userSelectHandle = (item, itemMap, question) => {
  let {
    userSelect,
    singerType,
    judgType,
    // 答案上锁, 不允许做答了
    isLockAnswer,
    isShowAnswer,
    answerMap,
    answer,
    yourAnswer,
    correctAnswer,
    id
  } = question
  if (isLockAnswer) {
    return null
  }
  if (judgType) {
    yourAnswer = itemMap[`${item}judg`]
    correctAnswer = itemMap[`item${answer}judg`]
  }
  if (singerType) {
    yourAnswer = itemMap[item]
    correctAnswer = itemMap[`item${answer}`]
  }
  // 单选，清空选择
  userSelect = {}
  userSelect[item] = true
  isShowAnswer = true
  isLockAnswer = true
  let correct = true
  const keys = Object.keys(answerMap)
  for (let index in keys) {
    if (answerMap[keys[index]] === 'correct') {
      userSelect[keys[index]] = true
    }
  }
  const userSlectKeys = Object.keys(userSelect)
  for (let key in userSlectKeys) {
    if (answerMap[userSlectKeys[key]] === 'in-correct') {
      correct = false
      break
    }
  }
  return {
    userSelect,
    isShowAnswer,
    isLockAnswer,
    correct,
    correct,
    yourAnswer,
    correctAnswer,
    id
  }
}
// 处理单个题目 初始化
const dealQuestionInfo = (params) => {
  let { target, answerMap } = params
  if (isEmpty(target)) {
    return target
  }
  // let target = obj
  const answer = answerMap[target.answer]
  const tempObj = {
    judgType: false,
    singerType: false,
    doubleType: false,
    multiType: false,
    topicType: 'singer',
    answerMap: {
      item1: 'in-correct',
      item2: 'in-correct',
      item3: 'in-correct',
      item4: 'in-correct',
    },
    _userSelect: {}
  }
  switch(answer[0].length) {
    case 1:
      if (target.item3) {
        tempObj.singerType = true
      } else {
        tempObj.judgType = true
        tempObj.topicType = 'judg'
      }
      break;
    case 2:
      tempObj.doubleType = true
      tempObj.topicType = 'multi'
      break;
    default:
      tempObj.multiType = true
      tempObj.topicType = 'all'
      break;
  }
  answer[0].split('').forEach((v, i) => {
    if (tempObj.answerMap[`item${v}`]) {
      tempObj.answerMap[`item${v}`] = 'correct'
    }
    tempObj._userSelect[`item${v}`] = true
  })
  tempObj.isLock = true
  tempObj.isLockAnswer = false
  tempObj.isShowAnswer = false
  tempObj.userSelect = {}
  tempObj.answerResult = null
  tempObj.yourAnswer = null
  tempObj.correctAnswer = null
  tempObj.originInfo = JSON.parse(JSON.stringify(target))
  tempObj.answerText =
    getAnswerText(target.answer, target.item3, target.item4)
  // console.log(!target.item1)
  if (!target.item1 || !target.item2) {
    target.item1 = '正确'
    target.item2 = '错误'
  }
  Object.assign(target, tempObj)
  return target
}

module.exports = {
  userSelectHandle,
  dealQuestionInfo
}
