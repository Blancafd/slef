// pages/mealDetail/mealDetail.js
const app = getApp()
import { config } from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    mealDetail:'',
    meal_id:''
  },
  goback(){
    wx.navigateBack({
      data:'1'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.meal_id){
      this.mealDetail(options.meal_id)
      this.setData({
        meal_id: options.meal_id
      })
    }
  },
  checkMeal(){
   
    wx.navigateBack({
      data:'1'
    })
  },
  mealDetail(meal_id){
  var url = config.domainCXB + '/meal_info',
    data = {
      meal_id: meal_id
    },
    that = this
  app.ajaxData(url, data, 'post', function (res) {
    if(res.data.code == 200){
      console.log(res)
      that.setData({
        mealDetail:res.data.data
      })
    }
  })
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