// pages/boxdetails/boxdetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataobj:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jsonData = options.dataobj
    var dataobj = JSON.parse(jsonData)
    console.log(dataobj)
    this.setData({
      dataobj: dataobj
    })
  },
  addindet(){
    var order_no = this.data.dataobj.id
    wx.navigateTo({
      url: '../addMeal/addMeal?order_id=' + order_no,
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