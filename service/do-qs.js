const { checkKeyExist } = require('../storage/storage')
const { isEmpty } = require('../utils/helper')
const { createRandom } = require('../utils/util')
const { storageKey } = require('../common/js/constant')
const { dealQuestionInfo } = require('./exam')


const getRandomList = (arr) => {
  const randomArr = createRandom(arr.length, 100)
  const list = []
  randomArr.forEach((v, i) => {
    if (arr[v]) {
      list.push(arr[v])
    }
  })
  return list.slice()
}
// 额外信息 两者组成新数据
const initExamInfo = (error = {}, correct = {}, totalNum = 0) => {
  const errorNum = Object.keys(error).length
  const correctNum = Object.keys(correct).length
  return {
    error,
    correct,
    totalNum,
    errorNum,
    correctNum,
  }
}
// 构建页面初始化信息 pageData
const initPageData = (testType, subject, model) => {
  const pageData = {}
  // 测试类型 总题数 完成数 当前问题index(第几个!== id) 正确数 错题数
  pageData.testType = testType
  pageData.currentIndex = 0
  pageData.isCollect = false
  pageData.subject = subject
  pageData.model = model
  return pageData
}
// 得到目标list
const getTargetList = (options) => {
  // idMap 类型中问题的id映射 { '22': 22 }
  const { testType, key, listObj } = options
  // 下标映射id index + 1 = id []
  const allList = checkKeyExist(key) || []
  const list = []
  if (listObj && !isEmpty(listObj)) {
    Object.keys(listObj).forEach((v) => {
      if (allList[v-1]) {
        list.push(allList[v-1])
      }
    })
  } else {
    switch(testType) {
      case 'order':
        list.push(...allList)
        break;
      case 'random':
        list.push(...allList.slice().reverse())
        break;
      case 'rand':
        list.push(...getRandomList(allList))
        break;
      default:
        break;
    }
  }
  return list.slice()
}
// 得到通用页面信息 originInfo, allError, allCollect, list
const getTargetExam = (options = {}) => {
  const { testType, subject, model, listObj } = options
  const key = subject == 1 ? storageKey[subject][model] : storageKey[subject] 
  const allInfo = checkKeyExist(key.info)
  const allError = allInfo?.error || {}
  const allCollect = allInfo?.collect || {}
  const list = getTargetList({testType, key: key.all, listObj })
  // 对应pageData
  let error = options.error
  let correct = options.correct
  if (!error && !correct) {
    const type = checkKeyExist(key.type) || {}
    const _testType = testType === 'random' ? 'order' : testType
    error = type[_testType]?.error || {}
    correct = type[_testType]?.correct || {}
  }
  const originInfo = initExamInfo(error, correct, list.length)
  return { examInfo: originInfo, allCollect, allError, list }
}
// pageData, all-error, all-collect, answerMap, list, question,
const getInitData = (options = {}) => {
  const {
    testType = 'order',
    subject = '1',
    model = 'c1',
    listObj,
    error,
    correct,
    completeMap
  } = options
  let answerMap = options.answerMap
  const {
    examInfo,
    allCollect,
    allError,
    list
  } = getTargetExam({ testType, subject, model, listObj, correct, error })
  if (!answerMap) {
    answerMap = checkKeyExist(storageKey.answerMap)
  }
  const pageData = initPageData(testType, subject, model)
  let question = null
  if (completeMap && !isEmpty(completeMap) && completeMap['0']) {
    question = completeMap['0']
  } else {
    question = dealQuestionInfo({
      target: Object.assign({}, list[0]),
      answerMap: answerMap
    })
  }
  return {
    pageData: Object.assign({}, pageData, examInfo),
    answerMap,
    completeMap: completeMap || {},
    question,
    allError,
    allCollect,
    list
  }
}
// 左右滑动判断
const initSlideInfo = (...rest) => {
  // pageData
  // index, totalNum
  const [pageData, totalNum] = [...rest]
  let _index, _totalNum
  if (rest.length === 1) {
    _index = pageData.currentIndex
    _totalNum = pageData.totalNum
  } else {
    _index = pageData
    _totalNum = totalNum
  }
  let canLeft = false, canRight = false
  if (_totalNum > 1 && _index < (_totalNum - 1)) {
    canLeft= true
  }
  if (_totalNum > 1 && _index !== 0) {
    canRight = true
  }
  return {
    canLeft,
    canRight
  }
}
module.exports = {
  getInitData,
  initSlideInfo
}