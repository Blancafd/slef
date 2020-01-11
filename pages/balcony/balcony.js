// pages/balcony/balcony.js
const app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    listarr: [],//储存数据
    order_no: '',//订单号
  },
  boxiang() {
    wx.switchTab({
      url: '../appointroom/appointroom',
    });
  },
  //

  boxdetails(e) {
    var dataobj = e.currentTarget.dataset.item
    var dataobj = JSON.stringify(dataobj)
    // console.log(dataobj)
    wx.navigateTo({
      url: '../boxdetails/boxdetails?dataobj=' + dataobj,
    })
  },
  //取消预约
  showPopup(e) {
    // console.log(e.currentTarget.dataset.order_no)
    this.setData({
      order_no: e.currentTarget.dataset.order_no
    })
    this.popup.showPopup();
  },
  //取消事件
  _error() {
    this.popup.hidePopup();
  },
  //确认事件
  _success() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'reserve/refund_apply',
      method: "post",
      data: {
        order_no: that.data.order_no
      }, success: function (res) {
        console.log(res.data)
        if (res.data.code == 200) {

          wx.showToast({
            title: '取消成功',
            icon: 'none',
          })
          that.myReserve()
        } else {

          wx.showToast({
            title: '取消失败',
            icon: 'none',
          })
        }
        // that.setData({
        //   listarr: res.data.data
        // })

      }
    })
    that.popup.hidePopup();
  },
  //点击切换
  currentTab(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.id,
    })
    this.myReserve()
  },
  //获取列表数据
  myReserve() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'reserve/myReserve',
      method: "post",
      data: {
        member_id: app.globalData.user_id,
        order_status: that.data.currentIndex
      }, success: function (res) {
        // console.log(res.data.data)
        that.setData({
          listarr: res.data.data
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myReserve()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popup = this.selectComponent("#popup");
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