// components/bottom-select/bottom-select.js
Component({
  properties: {
    isCollect:{
      type: Boolean,
      value: false
    },
    examInfo: {
      type: Object,
      value: null
    },
    btnType: {
      type: String,
      value: 'submit'
    },
    position: {
      type: String,
      value: 'fixed'
    },
    posType: {
      type: String,
      value: 'bottom: 0; left: 0; right: 0;'
    },
    paddingTop: {
      type: String,
      value: ''
    },
    needBorder: {
      type: Boolean,
      value: false
    }
  },
  lifetimes: {
    attached() {
      this.createSelectorQuery()
        .select('.bottom-select')
        .boundingClientRect(res => {
          // console.log(res)
          this.triggerEvent('bsrect', res)
        })
        .exec()
      // console.log(this.selectOwnerComponent())
    }
  },
  methods: {
    showDialog() {
      this.triggerEvent('open')
    },
    clickHandle(e) {
      const { type } = e.currentTarget.dataset
      this.triggerEvent('btnclick', { type })
    }
  }
})
