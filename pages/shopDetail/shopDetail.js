// pages/shopDetail/shopDetail.js
const app = getApp()
import {
  config
} from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    background: ['../../images/kai.png', '../../images/xing.png', '../../images/yu.png'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    fit_id: '', //门店id
    pageData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      fit_id: options.fit_id
    })
    this.getDeail(this.data.fit_id)
  },
  getDeail(fit_id) {
    var url = config.domainCXB + '/store_info',
      data = {
        fit_id: fit_id
      },
      that = this

    app.ajaxData(url, data, 'post', function(res) {
      if (res.data.code == 200) {
        that.setData({
          pageData:res.data.data[0]
        })
      }
    })
  },
  goBack() {
    wx.navigateBack({
      data: '1'
    })
  },
  click: function (e) {//调用地图，导航
    let point_x = parseFloat(e.currentTarget.dataset.x);
    let point_y = parseFloat(e.currentTarget.dataset.y);
    let site = this.data.addr;
    wx.openLocation({
      latitude: point_y,
      longitude: point_x,
      scale: 16,
      address: site
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})