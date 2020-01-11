// pages/starcircle/starcircle.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonshow:'',//星圆使用数据
    my_for:'',//总星圆
  },
  stardetail(){
    wx.navigateTo({
      url: '../stardetail/stardetail',
    })
  },
  //就餐劵
  mealcoupon() {
    console.log(11)
    wx.navigateTo({
      url: '../mealcoupon/mealcoupon',
    })
  },
  //星币获取
  getuserstar() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'cook/my_info',
      data: {
        id: app.globalData.user_id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        // console.log(res.data.data)

        that.setData({
          my_for: res.data.data
        })
      },

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.my_star()
    this.getuserstar()
  },
  //星圆接口
  my_star(){
     var that = this;
     wx.request({
       url: app.globalData.domain + 'cook/my_star',
       data: {
         id: app.globalData.user_id,
       },
       header: {
         'content-type': 'application/json'
       },
       success: function (res) {

         console.log(res.data.data)

           that.setData({
             buttonshow: res.data.data
           })
        
      
       },

   })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getuserstar()
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