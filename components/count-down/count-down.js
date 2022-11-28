// components/count-down/count-down.js
Component({
  properties: {
    allTime: {
      type: Number
    }
  },
  observers: {
    allTime(newValue) {
      if (newValue && typeof newValue === 'number') {
        this.setData({
          time: newValue
        })
        this.startCount()
      }
    }
  },
  data: {
    // time: 3000 * 1000,
    time: '--:--',
  },
  lifetimes: {
    ready() {
      // this.startCount()
    },
    detached() {
      this.stopCount()
    }
  },
  methods: {
    startCount() {
      this.timer = setInterval(() => {
        const { time } = this.data
        if (time <= 0) {
          clearInterval(this.timer)
          this.timer = null
        } else {
          this.setData({
            time: this.data.time - 100
          })
        }
      }, 100)
    },
    stopCount() {
      clearInterval(this.timer)
      this.timer = null
      return this.data.time
    },
    getCountTime() {
      return 3000 * 1000 - this.data.time
    }
  }
})
