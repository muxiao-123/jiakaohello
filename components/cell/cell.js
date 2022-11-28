// components/cell/cell.js
Component({
  options: {
    pureDataPattern: /^cellValue$/,
  },
  properties: {
    direction: {
      type: String,
      default: 'column'
    },
    cellValue: {
      type: Object
    }
  },
  data: {
    cellData: {
      name: '驾考hello',
      id: 1,
      url: 'http://192.168.43.217/update.png',
      color: '#cef4f4',
      desc: ''
    }
  },
  observers: {
    cellValue: function(newOld) {
      if (newOld) {
        this.setData({
          cellData: this.properties.cellValue
        })
      }
    }
  }
})
