// pages/mealvoucherselection/mealvoucherselection.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon:[],
  },
  monter(e){
    
    app.globalData.forinter = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../voucherrecharge/voucherrecharge',
    })
  },


//拿到充值的列表
  coupon_list() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'cook/coupon_list',
      method: "post",
       success: function (res) {
        // console.log(res.data.data.res)
        that.setData({
          coupon: res.data.data.res
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.coupon_list()
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