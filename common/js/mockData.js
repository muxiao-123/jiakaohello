// home page select
const funList = {
  left: [
    { name: 'VIP', type: 'vip', iconClass: 'icon-VIP', color: '#6fa8dc', id: 1 },
    { name: '专项练习', type: 'special-pratice', iconClass: 'icon-lianxi', color: '#FF6666', id: 2 },
    { name: '图标技巧', type: 'icon-tricks', iconClass: 'icon-tubiao', color: '#66CC99', id: 3 },
    { name: '考前密卷', type: 'secret-papers', iconClass: 'icon-icon_xinyong_xianxing_jijin-', color: '#FFCC33', id: 4 },
  ],
  right: [
    { name: '错题*收藏', type: 'error-set', iconClass: 'icon-cuotiben', color: '#FFCC33', id: 5 },
    { name: '随机练习', type: 'random', iconClass: 'icon-suiji', color: '#66CC99', id: 6 },
    { name: '考前500题', type: '500Topic', iconClass: 'icon-shijuan', color: '#FF6666', id: 7 },
    { name: '成绩排行', type: 'rankings', iconClass: 'icon-paihangbang', color: '#6fa8dc', id: 8 },
  ]
}
// 答题弹窗数据
const getListData = () => {
  let pannelData = []
  for (let i = 0; i < 3; ++i) {
    let temp = Object.create(null)
    switch (i) {
      case 0:
        temp.name = `item${i}`
        temp.title = '第一章 基础知识回答'
        temp.id = i + 1
        let j = 1, lists = []
        while (j < 30) {
          let obj = Object.create(null)
          obj.complete = false
          obj.correct = true
          obj.id = j
          if ( j % 2 === 0) {
            obj.complete = true
            obj.correct = false                
          } else if (j % 3 === 0) {
            obj.complete = true
          }
          lists.push(obj)
          j++
        }
        temp.lists = lists
        break;
      case 1:
        temp.name = `item${i}`
        temp.title = '第二章 图标技巧精选'
        temp.id = i + 1
        let k = 30, listsA = []
        while (k < 90) {
          let obj = Object.create(null)
          obj.complete = false
          obj.correct = true
          obj.id = k
          if ( k % 5 === 0) {
            obj.complete = true
            obj.correct = false
          } else if (k % 7 === 0) {
            obj.complete = true
          }
          listsA.push(obj)
          k++
        }
        temp.lists = listsA
        break;
      case 2:
        temp.name = `item${i}`
        temp.title = '第三章 单元图标技巧精选'
        temp.id = i + 1
        let p = 90, listsB = []
        while (p < 150) {
          let obj = Object.create(null)
          obj.complete = false
          obj.correct = true
          obj.id = p
          if ( p % 8 === 0) {
            obj.complete = true
            obj.correct = false
          } else if (p % 9 === 0) {
            obj.complete = true
          }
          listsB.push(obj)
          p++
        }
        temp.lists = listsB
        break;
      default:
        break;
    }
    pannelData.push(temp)
  }
  return pannelData
}

module.exports = {
  funList,
  getListData
}
