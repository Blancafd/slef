// pages/orderDetail/orderDetail.js
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
    payType: '1', //支付方式
    orderDetail:'',//订单详情
    money:'',//订单金额
    remark:'',//订单备注
    flag:true
  },
  checktype(e) { //选择切换方式
    console.log(e)
    this.setData({
      payType: e.currentTarget.dataset.type
    })
  },
  goback() {
    wx.navigateBack({
      data: '1'
    })
  },
  goremark(){//写备注
    wx.navigateTo({
      url: '../mealRemarks/mealRemarks',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var start_date = options.start_date,
      room_id = options.room_id,
      luncth = options.luncth,
      meal_id = options.meal_id
    this.confirmationOrder(start_date, room_id, luncth, meal_id)
  },
  confirmationOrder(start_date, room_id, luncth, meal_id) {
    var url = config.domainCXB + '/confirmationOrder',
      data = {
        start_date: start_date,
        room_id: room_id,
        luncth: luncth,
        meal_id: meal_id
      },
      that = this
    app.ajaxData(url, data, 'post', function (res) {
      if (res.data.code == 200) {
        that.setData({
          orderDetail: res.data.data,
          money: res.data.data.meal[0].meal_price
        })
      }
    })
  },
  creatOrder(){
    console.log(this.data.orderDetail)
    console.log(app.globalData.userInfo)
    console.log(app.globalData.member_id)

    var url = config.domainCXB + '/pay_order',
      data = {
        member_id: app.globalData.member_id,
        member_name: app.globalData.nickName,
        room_id: this.data.orderDetail.id,
        room_name: this.data.orderDetail.name,
        meal_id: this.data.orderDetail.meal[0].id,
        meal_name: this.data.orderDetail.meal[0].meal_name,
        appointment_id: this.data.orderDetail.appointment_id,
        pay_status: this.data.payType,
        money: this.data.money,
        openid:app.globalData.openid,
        remark: this.data.remark
      },
      that = this
    if (that.data.flag == true) {
      app.ajaxData(url, data, 'post', function (res) {
        if (res.data.code == 200) {
          that.setData({
            order_no: res.data.data.orser_no
          })
          wx.setStorageSync('mainorder_id', that.data.order_no)
          if (res.data.data.pay_status == 1) {//余额支付
            that.balance(res.data.data.orser_no, res.data.data.money, res.data.data.openid)
          } else if (res.data.data.pay_status == 2) { //微信支付
            that.wxPay(res.data.data.orser_no, res.data.data.money, res.data.data.openid)
          }
        }
      })
      that.setData({
        flag: false
      })
      // that.data.flag = false
    } else {
      setTimeout(function () {
        that.setData({
          flag:true
        })
      }, 3000)
    }
    
  },
  balance(orser_no, money, openid){//余额支付
    var url = config.domainCXB + '/balancePay',
      data = {
        orser_no: orser_no,
        money: money,
        openid: openid
      },
      that = this
    app.ajaxData(url, data, 'post', function (res) {

      if(res.data.code == 200){
        app.globalData.remark = ''
        wx.navigateTo({
          url: '../orderAddmeal/orderAddmeal?order_no=' + that.data.order_no,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  wxPay(orser_no, money, openid) {//微信支付
    var url = config.domainpay + '/Pay',
      data = {
        orser_no: orser_no,
        money: money,
        openid: openid
      },
      that = this
    app.ajaxData(url, data, 'post', function (res) {
      console.log(res)
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success: (res) => {
          app.globalData.remark = '' 
          wx.navigateTo({
            url: '/pages/orderAddmeal/orderAddmeal?order_no=' + that.data.order_no 
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.remark){
      this.setData({
        remark: app.globalData.remark
      })
      console.log(app.globalData.remark)
    }else{
      console.log('123123132132311')
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})