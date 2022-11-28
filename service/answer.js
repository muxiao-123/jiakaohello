const { checkKeyExist } = require('../storage/storage')
const getAnswerMapData = (res) => {
  const keyMap = {
    A:  "1",
    B:  "2",
    C:  "3",
    D:  "4",
    AB: "12",
    AC: "13",
    AD: "14",
    BC: "23",
    BD: "24",
    CD: "34",
    ABC: "123",
    ABD: "124",
    ACD: "134",
    BCD: "234",
    ABCD: "1234",
    "正确": "1",
    "错误": "2"
  }
  let choices = res
  // console.log(choices)
  const values = Object.entries(res)

  for (let v in values) {
    const [ key, value ] = values[v]
    let tempArr = []
    const or = '或者'

    if (value.includes(or)) {
      value.split(or).forEach((v, i) => {
        if (keyMap[v]) {
          tempArr.push(keyMap[v])
        }
      })
    }
    if (keyMap[value]) {
      tempArr.push(keyMap[value])
    }
    choices[key] = tempArr
  }
  return choices
}
const getAnswerMap = (key = 'answerMap') => {
  return checkKeyExist(key)
}

module.exports = {
  getAnswerMap,
  getAnswerMapData
}