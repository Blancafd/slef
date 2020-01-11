// pages/searchpage/searchpage.js
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
    searchWord:'',
    pageData:[]
  },
  getsrarchword(e){
    console.log(e)
    this.setData({
      searchWord: e.detail.value
    })
    var fit_id = wx.getStorageSync('shop_id')
    var url = config.domainCXB + '/addDish_search',
      data = {
        fit_id: fit_id,
        dish_name: this.data.searchWord
      },
      that = this
    app.ajaxData(url, data, 'post', function (res) {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})