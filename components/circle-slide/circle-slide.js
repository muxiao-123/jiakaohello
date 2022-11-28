// components/circle-slide/circle-slide.js
Component({
  properties: {
    num: {
      type: Number,
      value: 100
    },
    lineWidth: {
      type: Number,
      value: 1
    },
    activeColor: {
      type: String,
      value: '#308ce2'
    },
    placeColor: {
      type: String,
      value: 'rgba(205, 225, 241, .2)'
    }
  },
  lifetimes: {
    attached() {},
    ready() {
      let { num } = this.data
      if (typeof num !== 'number' || num > 100 || num < 0) {
        num = 0
      }
      this.paintCanvas(num * 3.6)
    },
  },
  methods: {
    getOriginNode(selector) {
      return new Promise((resolve) => {
        const query = this.createSelectorQuery().in(this)
        query.select(selector)
          .fields({ node: true, size: true }, (res) => {
            resolve(res)
          })
          .exec()
      })
    },
    async initCanvas() {
      const result = await this.getOriginNode('#circle-slide')
      /**@type {HTMLCanvasElement}*/
      const canvas = result.node
      const { width, height } = result
      const cirlceX = width / 2
      const cirlceY = height / 2
      const { pixelRatio } = wx.getSystemInfoSync()
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      const ctx = canvas.getContext('2d')
      ctx.scale(pixelRatio, pixelRatio)
      ctx.save()
      return { ctx, width, height, cirlceX, cirlceY }
    },
    async paintCanvas(num = 360) {
      const result = await this.initCanvas()
      const radix = Math.PI / 180
      const { ctx, cirlceX, cirlceY } = result
      const { lineWidth, activeColor, placeColor } = this.data
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = activeColor
      ctx.lineCap = 'round'
      let time = 0
      let timer = setInterval(() => {
        if (time > num) {
          clearInterval(timer)
          timer = null
          return
        }
        ctx.beginPath()
        ctx.arc(
          cirlceX,
          cirlceY,
          cirlceX - 2 * lineWidth,
          time * radix,
          (time + 6) * radix
        )
        ctx.stroke()
        // ctx.restore()
        time += 6
      }, 20)
    }
  }
})
