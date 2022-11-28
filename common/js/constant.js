const keyMap = {
  '1': {
    'c1': {
      // list
      'all': 's-1-c1',
      // 各种类型 的 error，correct 的存储{ order: { error: {}, correct: {} } }
      'type': 's-1-c1-type',
     // 总 error, collect 的存储 { error: {}, collect: {} }
      'info': 's-1-c1-info',
      'exam': 's-1-c1-exam-list'
    },
    'c2': {
      'all': 's-1-c2',
      'type': 's-1-c2-type',
      'info': 's-1-c2-info',
      'exam': 's-1-c2-exam-list'
    },
    'a1': {
      'all': 's-1-a1',
      'type': 's-1-a1-type',
      'info': 's-1-a1-info',
      'exam': 's-1-a1-exam-list'
    },
    'a2': {
      'all': 's-1-a2',
      'type': 's-1-a2-type',
      'info': 's-1-a2-info',
      'exam': 's-1-a2-exam-list'
    },
    'b1': {
      'all': 's-1-b1',
      'type': 's-1-b1-type',
      'info': 's-1-b1-info',
      'exam': 's-1-b1-exam-list'
    },
    'b2': {
      'all': 's-1-b2',
      'type': 's-1-b2-type',
      'info': 's-1-b2-info',
      'exam': 's-1-b2-exam-list'
    },

  },
  '4': {
    'all': 's-4',
    'type': 's-4-type',
    'info': 's-4-info',
    'exam': 's-4-exam-list'
  },
  'webInfo': 'webinfo',
  'answerMap': 'answerMap'
}
const CGI = {
  query: 'http://v.juhe.cn/jztk/query',
  answers: 'http://v.juhe.cn/jztk/answers',
}
const appkey = '325e34a760339c8c8f29c061308e8b55'
const routers = new Map([
  ['vip', '../vip/vip'],
  ['order', '../pratice/pratice'],
  ['rand', '../exam/exam'],
  ['special-pratice', '../special-pratice/special-pratice'],
  ['icon-tricks', '../icon-tricks/icon-tricks'],
  ['secret-papers', '../secret-papers/secret-papers'],
  ['error-set', '../error-set/error-set'],
  ['random', '../pratice/pratice'],
  ['500Topic', '../500Topic/500Topic'],
  ['rankings', '../rankings/rankings'],
  ['error', '../pratice/pratice'],
  ['collect', '../pratice/pratice'],
])
const specialRegs = [
  {
    name: 'word',
    title: '文字题',
    reg: '',
  },
  {
    name: 'image',
    title: '图片题',
    reg: '',
  },
  {
    name: 'correct',
    title: '正确题',
    reg: '',
  },
  {
    name: 'error',
    title: '错误题',
    reg: '',
  },
  {
    name: 'judg',
    title: '判断题',
    reg: '',
  },
  {
    name: 'multi',
    title: '多选题',
    reg: '',
  },
  {
    name: 'singer',
    title: '单选题',
    reg: '',
  },
  {
    name: 'speed',
    title: '速度题',
    reg: /(速度){1,}/,
  },
  {
    name: 'penalty',
    title: '罚款题',
    reg: /(罚款){1,}/,
  },
  {
    name: 'sign',
    title: '标志题',
    reg: /(标志){1,}/,
  },
  {
    name: 'scoring',
    title: '计分题',
    reg: '',
  }
]
const iconTrickRegs = [
  {
    name: 'traffic-sign',
    title: '交通标志大全',
    reg:/(交通标志){1,}/,
  },
  {
    name: 'light',
    title: '汽车仪表指示灯',
    reg: /(指示灯){1,}/,
  },
  {
    name: 'gesture',
    title: '交警手势',
    reg: /(手势){1,}/,
  },
  {
    name: 'accident-ex',
    title: '交通事故图解',
    reg: /(事故){1,}/,
  }
]
const chapterRegs = [
  {
    name: 'manage',
    title: '驾驶证和机动车管理规定',
    reg: /(驾驶证|机动车){1,}/,
  },
  {
    name: 'through',
    title: '道路通行条件及通行规定',
    reg: /(驾驶|规定|道路){1,}/,
  },
  {
    name: 'error',
    title: '道路交通事故处理相关规定',
    reg: /(安全|违法|处罚){1,}/,
  },
  {
    name: 'base',
    title: '机动车基础知识',
    reg: /(机动车){1,}/,
  }
]
const orignAnswer = {
  '1': 'A或者正确',
  '2': 'B或者错误',
  '3': 'C',
  '4': 'D',
  '7': 'AB',
  '8': 'AC',
  '9': 'AD',
  '10': 'BC',
  '11': 'BD',
  '12': 'CD',
  '13': 'ABC',
  '14': 'ABD',
  '15': 'ACD',
  '16': 'BCD',
  '17': 'ABCD'
}
module.exports = {
  storageKey: keyMap,
  CGI,
  appkey,
  routerMap: routers,
  chapterRegs,
  specialRegs,
  orignAnswer,
  iconTrickRegs
}