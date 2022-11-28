const color = {
  themeColor: '#cef4f4',
  themeColorDark: '#6fa8dc',
  bgRed: 'red',
  bgDark: '#cef4f4',
  bgLight: '#6fa8dc',
  bgTeal: '#008080'
}

const colorMap = {
  'default': '#6fa8dc',
  'blue': '#6666FF',
  'red': '#FF6666',
  'yellow': '#FFCC33',
  'green': '#66CC99',
  'blueDark': '#66CCFF',
  'themeLight': '#6fa8dc',
  'themeDark': '#cef4f4',
  'themeDarkA': '#97c1e7',
  'text': '#cccccc',
  '1': '#6666FF',
  '2': '#FF6666',
  '3': '#FFCC33',
  '4': '#66CC99',
  '5': '#66CCFF',
  '6': '#6fa8dc',
  '7': '#cef4f4',
  '8': '#97c1e7',
  '9': '#6666FF',
}
const getColor = (name) => {
  if (typeof name === 'string') {
    return colorMap[name] || colorMap.default
  } else if (typeof name === 'number') {
    const numKey = name % 10
    return colorMap[numKey] || colorMap.default
  } else {
    return colorMap.default
  }
}

module.exports = {
  colorMap,
  getColor
}