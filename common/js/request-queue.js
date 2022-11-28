class Queue {
  constructor(name) {
    this.name = name
    this.callbackArray = []
  }
  getName() {
    return this.name
  }
  // 添加请求到队列中
  add(...rest) {
    // 第一个参数为对象
    const [ callback, args ] = [...rest]
    if (!callback || typeof callback !== 'function') {
      throw new TypeError('First params must is a Function Type')
    }
    this.callbackArray.push({
      callback,
      args
    })
  }
  // 执行队列中的请求,先进先出
  exec() {
    const execObj = this.callbackArray.shift()
    if (execObj) {
      execObj.callback(execObj.args)
    }
  }
  // 返回请求队列长度
  getSize() {
    return this.callbackArray.length
  }
}

const queues = {
  wxAjaxQueue: new Queue('wxAjaxQueue')
}

const getQueue = function (name) {
  if (queues[name]) {
    return queues[name]
  } else {
    return new Queue(name)
  }
} 

module.exports = {
  getQueue
}