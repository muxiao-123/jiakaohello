// pages/rankings/rankings.js
const { storeBindingsBehavior } = require('mobx-miniprogram-bindings')
const { store } = require('../../store/index')
const { storageKey } = require('../../common/js/constant')
const { checkKeyExist } = require('../../storage/storage')
const { formatTime } = require('../../utils/util')
const { queryRanking } = require('../../request/index')
Component({
  behaviors: [ storeBindingsBehavior ],
  data: {
    tabList: [
      {
        name: '考试记录',
        id: 1,
        value: '1',
        code: 'record'
      },
      {
        name: '月排行榜',
        id: 2,
        value: '2',
        code: 'rank'
      },
    ],
    rankList: [],
    examList: [],
    userInfo: {
      id: 0,
      userImage: '',
      userName: 'muxiao',
      maxGrade: 90,
      type: 'header',
      examNum: 0
    }
  },
  storeBindings: {
    store,
    fields: {
      examInfo: () => store.examInfo,
      jkInfo: () => store.jkInfo
    }
  },
  lifetimes: {
    attached() {
      const { subject, model } = this.data.jkInfo
      const key = subject === 1 ? storageKey[subject][model] : storageKey[subject]
      const result = checkKeyExist(key.exam) || []
      let maxGrade = 0
      result.forEach((v, i) => {
        result[i].date = formatTime(new Date(v.date))
        maxGrade = Math.max(maxGrade, v.grade)
      })
      this.setData({
        examList: result,
        'userInfo.maxGrade': maxGrade,
        'userInfo.examNum': result.length
      })
    }
  },
  methods: {
    onLoad() {
      queryRanking({ url: 'rank.json' })
        .then((res) => {
          this.initRankData(res.result)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toggleHandle(e) {
      // console.log(e)
    },
    initRankData(result) {
      result.sort((a, b) => {
        if (b.grade === a.grade) {
          return a.time.localeCompare(b.time)
        } else {
          return b.grade - a.grade
        }
      })
      console.log(result)
      
      this.setData({
        rankList: result
      })
    }
  }
})