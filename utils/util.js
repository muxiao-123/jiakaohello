const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const createRandom = (length = 1000, n_num = 100) => {
  length < 100 && (length = 1000)
  // if (length < 100) {
  //   length = 1000
  // }
  let randomArr = []
  const cnum = n_num
  let timer = setTimeout(() => {
    let i = 0, temp = []
    while (i < cnum) {
      temp.push(i)
      i++
    }
    randomArr = temp
  }, 20)
  while (randomArr.length < cnum) {
    const num = Math.floor((Math.random() * length))
    !randomArr.includes(num) && randomArr.push(num)
  }
  clearTimeout(timer)
  timer = null
  return randomArr.slice()
}

const todayTime = () => {
  const date = new Date()
  const dateA = new Date(date.toLocaleDateString())
  // 当日凌晨
  return dateA.getTime()
}
const formatRestTime = (time, type) => {
  if (typeof time !== 'number') {
    return '--:--'
  }
  const ms = formatNumber((time % 1000) / 10)
  const s = formatNumber(Math.floor((time / 1000) % 60))
  const m = formatNumber(Math.floor((time / 60000) % 60))
  if (type && type === 'text') {
    return `${m}分${s}秒`
  }
  return m + ':' + s + ':' + ms
}

module.exports = {
  formatTime,
  createRandom,
  todayTime,
  formatRestTime,
  formatNumber
}
