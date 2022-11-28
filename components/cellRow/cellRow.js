// components/cellRow/cellRow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    }
  },
  observers: {
    info: function(newValue, oldValue) {
      if (newValue) {
        const indexType = this.getIndexType(newValue.index)
        this.setData({
          showInfo: newValue,
          indexType
        })
      }
    }
  },
  data: {
    // showInfo
    indexType: '',
    indexTypeArr: ['frist-top', 'two-top', 'three-top']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getIndexType(index) {
      if (index > 3) {
        return ''
      }
      return this.data.indexTypeArr[index - 1] || ''
    }
  }
})
