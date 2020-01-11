// pages/dinnerplate/dinnerplate.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:1,
    paymentcode:1,
    canarr: [],//餐盘列表
    currentxfont:1,
  },
  currentTab(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
    })
   
  },
  botonmer(e){
    this.setData({
      currentxfont: e.currentTarget.dataset.id,
    })
  },
  in_weeta(e){
   
    var ids = e.currentTarget.dataset.id//获取用户点击的id
    // console.log(e.currentTarget.dataset.item)
    app.globalData.carts=e.currentTarget.dataset.item

    wx.navigateTo({
      url: '../orderlist/orderlist',
    })
  },

  //拾味堂餐盘列表
  box_list(fit_id){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'meal/box_list',
      method: "post",
      data: {
        fit_id: fit_id
      }, success: function (res) {
               console.log(res.data.data.res)
              that.setData({
                canarr: res.data.data.res
              })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var fit_id = wx.getStorageSync('shop_id')
    this.box_list(fit_id)
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
       this.setData({
         paymentcode: app.globalData.paymentcode
       })
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