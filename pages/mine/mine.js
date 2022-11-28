// pages/mine/mine.js
const { colorMap } = require('../../common/js/color')
const initStoreBehavior = require('../../behaviors/initStoreBehavior')
const { selectList, modelArrMap, modelArr } = require('../../common/js/staticRender')
const { storageKey } = require('../../common/js/constant')
const { checkKeyExist, saveToStorage } = require('../../storage/storage')
const { orderQueryExam } = require('../../request/index')
Component({
  behaviors: [ initStoreBehavior ],
  data: {
    // 占位信息，头部
    styleList: [
      { name: '精简500题', desc: '不够补偿', icon: 'icon-shijuan' },
      { name: '考前两小时', desc: '临阵磨枪', icon: 'icon-lianxi' },
      { name: '考前密卷', desc: '最后冲刺', icon: 'icon-icon_xinyong_xianxing_jijin-' },
    ],
    selectList,
    answerResult: {
      type: 'answer',
      name: 'answer',
      id: 1,
      totalNum: 0,
      correctPercentage: '0%',
      desc: ['累计答题数', '正确率：']
    },
    examResult: {
      type: 'grade',
      name: 'grade',
      id: 2,
      totalNum: 0,
      gradeNum: 0,
      examNum: 0,
      correctPercentage: '0%',
      desc: ['考试平均分', '累计考试：']
    },
    otherResult: {
      type: 'vipCourse',
      name: 'vipCourse',
      id: 3,
      totalNum: 0,
      correctPercentage: '0%',
      descA: ['答题考试必备', '模拟考试通过率']
    },
    // actionshree 数据
    currentModel: {
      name: '小车-c1',
      model: 'c1',
      id: 0,
    }
  },
  lifetimes: {
    onReady() {
      const { subject, model } = this.data.jkInfo
      this._watchUpdateSubject1(this.data[`subject${subject}`])
      this._watchUpdateAllExamInfo(this.data.allExamInfo)
      const keys = { 'c1': '0', 'a1': '1', 'a2': '2' }
      this.setData({
        currentModel: this.data.modelArrMap[keys[model]]
      })
    },
  },
  methods: {
    _watchUpdateSubject1(obj) {
      if (obj) {
        const { totalNum, completeNum, _correctNum} = obj
        const pen = ((_correctNum / totalNum)* 100).toFixed(2)
        this.setData({
          'answerResult.totalNum': completeNum,
          'answerResult.correctPercentage': `${pen}%`
        })
      }
    },
    _watchUpdateSubject4 (obj) {
      this._watchUpdateSubject1(obj)
    },
    _watchUpdateAllExamInfo(arr) {
      console.log(arr)
      if (Array.isArray(arr)) {
        let total = 0, aveGrade = 0
        if (arr.length !== 0) {
          arr.forEach((v, i) => {
            total += parseInt(v.grade)
          })
          aveGrade = (total / arr.length).toFixed()
        }
        this.setData({
          'examResult.gradeNum': aveGrade,
          'examResult.examNum': arr.length
        })
      }
    },
    _watchUpdateJKInfo(obj) {
      const { subject } = this.data.jkInfo
      if ( obj.subject !== subject ) {
        this._watchUpdateSubject1(this.data[`subject${obj.subject}`]) 
      }
    },
    toggleModel() {
      wx.showActionSheet({
        itemList: modelArr,
        itemColor: colorMap.text,
        success: (res) => {
          const currentModel = modelArrMap[res.tapIndex]
          console.log(currentModel)
          const { id } = this.data.currentModel
          if (currentModel.id !== id) {
            this.updateToggle(currentModel.model)
            this.setData({
              currentModel
            })
            this.updateJKInfo({ model: currentModel.model })
          }
        }
      })
    },
    // 服务列表操作
    selectHandle() {
      console.log('fsd')
    },
    updateToggle(model) {
      const key = storageKey[1][model]
      const result = checkKeyExist(key.all)
      const examResult = checkKeyExist(key.exam) || []
      let _subject1
      if (result) {
        const obj = this.exitInit(result.length, key)
        _subject1 = Object.assign({}, obj)
        this.updateSubject1(_subject1)
      } else {
        orderQueryExam({ url: `query-${model}.json` })
          .then((res) => {
            console.log(res)
            _subject1 = this.getInitSubject1()
            _subject1.totalNum = res.result.length
            saveToStorage({
              key: key.all,
              data: res.result
            })
            this.updateSubject1(_subject1)
          })
          .catch((err) => {
            console.log(err)
          })
      }
      this.updateAllExamInfo(examResult, 'toggle')
    },
    exitInit(length, key) {
      const typeResult = checkKeyExist(key.type) || {}
      const infoResult = checkKeyExist(key.info) || {}
      const keys = Object.keys
      const error = infoResult.error || {}
      const collect = infoResult.collect || {}
      const errorNum = keys(error).length
      const collectNum = keys(collect).length
      const _errorNum = keys(typeResult?.order?.error || {}).length
      const _correctNum = keys(typeResult?.order?.correct || {}).length
      return {
        totalNum: length,
        error,
        collect,
        errorNum,
        collectNum,
        _errorNum,
        _correctNum,
        completeNum: _errorNum + _correctNum,
      }
    },
    getInitSubject1() {
      return {
        totalNum: 0,
        error: {},
        collect: {},
        errorNum: 0,
        collectNum: 0,
        _errorNum: 0,
        _correctNum: 0,
        completeNum: 0,
      }
    }
  },
})