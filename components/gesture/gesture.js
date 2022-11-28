// components/gesture/gesture.js
// 左滑，油滑， 阈值80
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    canLeft: {
      type: Boolean,
      value: true
    },
    canRight: {
      type: Boolean,
      value: true
    },
    propagation: {
      type: Boolean,
      value: true
    }
  },
  methods: {}
})
