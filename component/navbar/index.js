// component/navbar/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{//页面名称
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,//设备获取的顶部栏高度
  },
  attached: function (e) {
    // console.log(this.properties.title)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back: function () {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
