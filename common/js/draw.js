const { colorMap } = require('./color')

// 第一个参数为nodeRef { node }
const draw = function (options) {
  const { res, cirleAColor = '#cef4f4', cicleBColor = '#6fa8dc'} = options
  /**@type {HTMLCanvasElement}**/
  if (!res) {
    return
  }
  const canvas = res.node
  const dpr = wx.getSystemInfoSync().pixelRatio
  // canvas.width = res.width * dpr
  // canvas.height = res.height * dpr
  canvas.width = 100 * dpr
  canvas.height = 100 * dpr
  
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  const radix = Math.PI / 180
  ctx.save()
  ctx.lineWidth = 10
  ctx.strokeStyle = cirleAColor
  ctx.beginPath()
  ctx.arc(50, 50, 40, 0, 360 * radix)
  ctx.stroke()
  ctx.restore()
  ctx.save()
  
  ctx.fillStyle = cicleBColor
  ctx.beginPath()
  ctx.arc(50, 50, 33, 0, 360 * radix)
  ctx.fill()
  ctx.restore()
  ctx.save()
  
  ctx.strokeStyle = 'rgba(0,0,0,0.05)'
  ctx.translate(50, 50)
  for (let i = 0; i <= 49; ++i) {
    ctx.beginPath()
    if (i === 0) {
      ctx.rotate(12 * radix)
    } else {
      ctx.rotate(6 * radix)
    }
    ctx.moveTo(35, 0)
    ctx.lineTo(45, 0)
    ctx.stroke()
  }
  ctx.restore()
  ctx.save()
  ctx.globalAlpha = 0.6
  const linear = ctx.createLinearGradient(50, 10, 90, 50)
  linear.addColorStop(0, cirleAColor)
  linear.addColorStop(1, cicleBColor)
  
  ctx.lineWidth = 10
  ctx.lineCap = 'round'
  ctx.strokeStyle = linear
  ctx.beginPath()
  ctx.arc(50, 50, 40, 270 * radix, 360 * radix)
  ctx.stroke()
  ctx.restore()
  ctx.save()

  const url = canvas.toDataURL('png', 1)
  // console.log(url)
  return url
}

const drawBgImage = (res) => {
  const { pixelRatio, windowWidth } = wx.getSystemInfoSync()

  const [ width, height ] = [ 355, 100 ]

  /**@type {HTMLCanvasElement}**/
  const canvas = res.node
  canvas.width = width * pixelRatio
  canvas.height = height * pixelRatio
  
  const ctx = canvas.getContext('2d')
  const raidx = Math.PI / 180
  ctx.scale(pixelRatio, pixelRatio)
  ctx.save()

  const drawCicle = (x, y, r) => {
    const colorB = ctx.createRadialGradient(x, y, r, x, y, 0)
    colorB.addColorStop(0, colorMap.themeDark)
    colorB.addColorStop(1, '#ddf0f0')
    ctx.fillStyle = colorB
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 360 * raidx)
    ctx.fill()
    ctx.restore()
    ctx.save()
  }
  drawCicle(50, 30, 10)
  drawCicle(80, 60, 20)
  drawCicle(120, 80, 5)
  drawCicle(120, 20, 10)
  drawCicle(250, 10, 10)
  drawCicle(240, 80, 5)
  drawCicle(315, 30, 20)
  drawCicle(295, 70, 10)

  return canvas.toDataURL()
}
const drawError = (res) => {
  const [ width, height ] = [200, 200]
  /**@type {HTMLCanvasElement}**/
  const canvas = res.node
  const dpr = wx.getSystemInfoSync().pixelRatio
  const radix = Math.PI / 180
  let radius = 90
  const [x, y] = [width / 2, height / 2]

  canvas.width = width * dpr
  canvas.height = height * dpr

  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.save()

  const color = ctx.createLinearGradient(x, y - radius, x, y + radius)
  color.addColorStop(0, colorMap.themeDarkA)
  color.addColorStop(1, colorMap.themeDark)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 360 * radix)
  ctx.fill()
  ctx.restore()
  ctx.save()

  const colorA = ctx.createLinearGradient(x - radius, y, y + radius, x + radius)
  colorA.addColorStop(0, colorMap.themeLight)
  colorA.addColorStop(1, colorMap.themeDark)
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.strokeStyle = colorA
  ctx.beginPath()
  ctx.arc(x, y, radius + 4, 180 * radix, 360 * radix)
  ctx.stroke()
  ctx.restore()
  ctx.save()

  ctx.translate(x, y)
  ctx.lineWidth = 2
  ctx.strokeStyle = '#ffffff'
  for (let i = 0; i < 60; ++i) {
    ctx.beginPath()
    ctx.rotate(6 * radix)
    ctx.moveTo(0, radius - 15)
    ctx.lineTo(0, radius - 5)
    ctx.stroke()
  }
  ctx.restore()
  ctx.save()

  ctx.translate(x, y)
  ctx.fillStyle = colorMap.themeDarkA
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.rotate(180 * radix)
  ctx.moveTo(-60, 30)
  ctx.quadraticCurveTo(-60, -40, 0, -65)
  ctx.quadraticCurveTo(60, -40, 60, 30)
  ctx.quadraticCurveTo(5, 80, -60, 30)
  ctx.fill()
  ctx.restore()
  ctx.save()
  
  const colorC = ctx.createLinearGradient(x, y - 60, x, y + 70)
  colorC.addColorStop(0, colorMap.themeDarkA)
  colorC.addColorStop(1, colorMap.themeLight)
  ctx.fillStyle = colorC
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(x - 60, y + 30)
  ctx.quadraticCurveTo(x - 60, y - 40, x, y - 65)
  ctx.quadraticCurveTo(x + 60, y - 40, x + 60, y + 30)
  ctx.quadraticCurveTo(x + 5, y + 80, x - 60, y + 30)
  ctx.fill()
  ctx.restore()
  ctx.save()

  return canvas.toDataURL()
}

const drawFinishBg = (obj) => {
  const radix = Math.PI / 180
  const { width, height, cirlceX, cirlceY } = obj
  /**@type {CanvasRenderingContext2D}**/
  const ctx = obj.ctx
  const color =
    ctx.createLinearGradient(cirlceX, 0, cirlceX, height)
  color.addColorStop(0, '#ff4500')
  color.addColorStop(1, '#f07c52')
  ctx.fillStyle = color
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(0, height - 20)
  ctx.quadraticCurveTo(60, height - 50, 120, height - 20)
  ctx.quadraticCurveTo(180, height, 220, height - 30)
  ctx.quadraticCurveTo(240, height - 50, 280, height - 20)
  ctx.quadraticCurveTo(300, height, width, height - 20)
  ctx.lineTo(width, 0)
  ctx.lineTo(0, 0)
  ctx.lineTo(0, height - 40)
  ctx.fill()
  ctx.beginPath()
  ctx.restore()
  ctx.save()
  ctx.moveTo(0, 50)
  ctx.lineTo(50, 0)
  ctx.lineTo(200, 200)
  ctx.lineTo(150, 200)
  ctx.lineTo(0, 50)
  ctx.fillStyle = 'rgba(228, 152, 124, .2)'
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(0, 150)
  ctx.lineTo(50, 180)
  ctx.lineTo(200, 200)
  ctx.lineTo(160, 150)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(width, 100)
  ctx.lineTo(width - 50, 0)
  ctx.lineTo(width / 2, 100)
  ctx.lineTo(160, 150)
  ctx.fill()
  ctx.restore()
  ctx.save()
  ctx.beginPath()
  ctx.arc(cirlceX, cirlceY - 40, 50, 0, 360 * radix)
  ctx.fillStyle = 'rgba(228, 152, 124, .8)'
  ctx.fill()
  ctx.restore()
  ctx.save()
  ctx.lineWidth = 10
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cirlceX, cirlceY - 40, 65, 120 * radix, 60 * radix)
  ctx.strokeStyle = 'rgba(143, 38, 6, .2)'
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cirlceX, cirlceY - 40, 65, 120 * radix, 180 * radix)
  ctx.strokeStyle = '#ffffff'
  ctx.stroke()
  ctx.restore()
  ctx.save()
  const url = obj.canvas.toDataURL()
  ctx.clearRect(0, 0, width, height)
  return url
}

module.exports = {
  draw,
  drawError,
  drawBgImage,
  drawFinishBg
}