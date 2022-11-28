// mine-select-list
const selectList = [
  {
    icon: 'icon-baoming',
    id: 1,
    color: '',
    title: '报名驾校',
    nums: ''
  },
  {
    icon: 'icon-shoucang',
    id: 2,
    color: '',
    title: '我的收藏',
    nums: ''
  },
  {
    icon: 'icon-guanyuwomen',
    id: 3,
    color: '',
    title: '关于我们',
    nums: ''
  },
  {
    icon: 'icon-weibiaoti-',
    id: 4,
    color: '',
    title: '客服',
    nums: ''
  }
]
// mine-model-arr
// const modelArr = ['小车-c1', '小车-c2', '客车-a1', '客车-a2','货车-b1','货车-b2']
const modelArr = ['小车-c1', '客车-a1', '客车-a2' ]
// mine-model-map
const modelArrMap = {
  '0': {
    name: '小车-c1',
    model: 'c1',
    id: 0,
  },
  // '1': {
  //   name: '小车-c2',
  //   model: 'c2',
  //   id: 1,
  // },
  '1': {
    name: '客车-a1',
    model: 'a1',
    id: 2,
  },
  '2': {
    name: '客车-a2',
    model: 'a2',
    id: 3,
  },
  // '4': {
  //   name: '货车-b1',
  //   model: 'b1',
  //   id: 4,
  // },
  // '5': {
  //   name: '货车-b2',
  //   model: 'b2',
  //   id: 5,
  // }
}

module.exports = {
  selectList,
  modelArr,
  modelArrMap
}
