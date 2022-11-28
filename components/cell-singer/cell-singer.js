// components/cell-singer/cell-singer.js
Component({
  options: {
    pureDataPattern: /^_/
  },
  properties: {
    info: {
      type: Object
    },
    needBottom: {
      type: Boolean,
      value: true
    }
  },
  data: {
    _showInfo: {
      id: 2,
      color: 'yellow',
      nums: 34,
      title: '驾驶证和机动车管理',
      name: 'koijj',
      icon: ''
    }
  },
  methods: {
    tapHandle(e) {
      this.triggerEvent('tap', e.currentTarget.dataset)
    }
  }
})
