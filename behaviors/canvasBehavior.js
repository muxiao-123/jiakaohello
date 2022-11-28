module.exports = Behavior({
  methods: {
    getOriginNode(selector) {
      if (!selector) {
        selector = 'canvas'
      }
      return new Promise((resolve) => {
        const query = this.createSelectorQuery().in(this)
        query.select(selector)
          .fields({ node: true, size: true }, (res) => {
            resolve(res)
          })
          .exec()
      })
    },
    async initCanvas(selector) {
      const result = await this.getOriginNode(selector)
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
      return { canvas, ctx, width, height, cirlceX, cirlceY }
    },
  }
})