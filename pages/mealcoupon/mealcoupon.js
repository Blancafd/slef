// pages/mealcoupon/mealcoupon.js
const app = getApp();
Page({


  /**
   * 页面的初始数据
   */
  data: {
    isshopder: -1,
    coupon_arr: [],

  },
  //星圆
  starcircle() {
    wx.navigateTo({
      url: '../starcircle/starcircle',
    })
  },
  //点击说明规则
  inder_iss(e) {
    var that = this
    var ids = e.currentTarget.dataset.id

    var list = this.data.coupon_arr;
    list[ids].isshow = !list[ids].isshow
    this.setData({
      coupon_arr: list
    })

  },
  //充值就餐劵
  mealvoucherselection() {
    wx.navigateTo({
      url: '../mealvoucherselection/mealvoucherselection',
    })
  },
  //就餐劵列表
  coupon_list() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'cook/user_voucher',
      method: "post",
      data: {
        user_id: app.globalData.user_id
      },
      success: function (res) {
        console.log(res.data.data)
        let arr = res.data.data;

        arr.forEach(function (i, o) {
          i.isshow = false
        })

        that.setData({
          coupon_arr: arr,
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
    this.coupon_list()
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