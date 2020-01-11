// pages/stardetail/stardetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [['2019', '2020', '2021'], ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']],
    multiIndex: [0, 0],
    currentIndex:3,
    bieomter:'',
    iassho:true,
    ifdata:'',//年
    date:"",
    listdata:[],//星圆明细
  },
   
  //时间
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    this.setData({
      iassho:false,
      bieomter: e.detail.value.substring(5, 7),
      ifdata: e.detail.value.substring(0, 4)
    })
  
    var ifdata = e.detail.value.substring(0, 4)
    this.data.bieomter = e.detail.value.substring(5, 7);
    console.log(this.data.ifdata)
    this.star_detail()
  },
  //滑动
  currentTab(e){
    this.setData({
      currentIndex: e.currentTarget.dataset.id,
    })  
    this.star_detail()

  },
  getDateTime(){
    console.log(this.data.date)
    
  },
  //星圆明细数据
  star_detail(){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'cook/star_detail',
      data: {
        id: app.globalData.user_id,
        year: that.data.ifdata,
        month: that.data.bieomter,
        type: that.data.currentIndex
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

     

        that.setData({
          listdata: res.data.data.list
        })


      },

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.star_detail()
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