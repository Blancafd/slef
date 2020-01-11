// pages/roomDetail/roomDetail.js
const app = getApp()
import { config } from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    start_time:'',//预约日期+
    luncth:'',//预约时间
    room_id:"",//房间id
    roomDetail:'',//包间详情
    mealKind:-1,//套餐种类
    mealPrice:0,//套产价格
    is_choose:'',//当前包厢的预约状态（1:空闲中，2：使用中）
  },
  goback(){
    wx.navigateBack({
      data:'1'
    })
  },
  checkMeal(e){
    console.log(e)
    var index = e.currentTarget.dataset.index
    var price = e.currentTarget.dataset.price
    this.setData({
      mealKind: index,
      mealPrice: price
    })
  },
  goMealdetail(e){
    console.log(e)
    var meal_id = e.currentTarget.dataset.mealid
    wx.navigateTo({
      url: '../mealDetail/mealDetail?meal_id='+meal_id,
    })
  },
  comfirmOrder(){
    
    var start_date = this.data.start_time, luncth = this.data.luncth, room_id = this.data.room_id, meal_id = this.data.mealKind
    if (meal_id == -1){
      wx.showModal({
        title: '提示',
        content: '请选择套餐类型',
      })
    }else{
      if(app.globalData.phone){
        wx.navigateTo({
          url: '../orderDetail/orderDetail?start_date=' + start_date + '&&luncth=' + luncth + '&&room_id=' + room_id + '&&meal_id=' + meal_id,
        })
      }else{
        wx.navigateTo({
          url: '../authorization/authorization'
        })
      }
     
    }
   
  },
  /**
   * 生命周期函数--监听页面加载{start_time: "2019-12-19", luncth: "1", room_id: "5"
   */
  onLoad: function (options) {
    console.log(app.globalData.meal_id)
    if(options){
      this.setData({
        start_time: options.start_time,
        luncth: options.luncth,
        room_id: options.room_id,
        is_choose: options.is_choose
    })
    }
  
    this.getDetail(this.data.start_time,this.data.room_id,this.data.luncth)
  },
  getDetail(start_date, room_id, luncth){//获取包间详情
    var url = config.domainCXB + '/bookingRoom_info',
      data = {
        start_date: start_date,
        room_id: room_id,
        luncth: luncth
      },
      that = this
    app.ajaxData(url, data, 'post', function (res) {
      console.log(res)
      if(res.data.code == 200){
        that.setData({
          roomDetail:res.data.data
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
    console.log(app.globalData.meal_id)
    if (app.globalData.meal_id){
      this.setData({
        mealKind: app.globalData.meal_id
      })
    }
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