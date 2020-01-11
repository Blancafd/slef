// pages/addMealconfirm/addMealconfirm.js
const app = getApp()
import {
  config
} from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:true,
    statusBarHeight: app.globalData.statusBarHeight,
    order_id: "",
    dishlist: '',
    pageData:'',
    payType:1,
    money:'',
    remark: ''
  },
  goremark() {//写备注
    wx.navigateTo({
      url: '../mealRemarks/mealRemarks',
    })
  },
  creatOrder(){
    var url = config.domainCXB + '/addDish_pay',
      data = {
        openid:app.globalData.openid,
        order_id:this.data.order_id,
        dish: this.data.dishlist,
        pay_status: this.data.payType,
        money: this.data.money,
        remark: this.data.remark
      },
      that = this
    if (that.data.flag == true) {
      app.ajaxData(url, data, 'post', function (res) {
        if (res.data.code == 200) {
          that.setData({
            order_no: res.data.data.orser_no//子订单订单号
          })
          if (res.data.data.pay_status == 1) {//余额支付
            that.balance(res.data.data.orser_no, res.data.data.money, res.data.data.openid)
          } else if (res.data.data.pay_status == 2) { //微信支付
            console.log('微信支付')
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
          flag: true
        })
      }, 3000)
    }





    
  },
  balance(orser_no, money, openid) {//余额支付
    var orderMainid = wx.getStorageSync('mainorder_id')
    var url = config.domainCXB + '/balancePay_add',
      data = {
        orser_no: orser_no,
        money: money,
        openid: openid
      },
      that = this
    app.ajaxData(url, data, 'post', function (res) {
      if (res.data.code == 200) {
        app.globalData.remark=''
        wx.navigateTo({
          url: '../orderAddmeal/orderAddmeal?order_no=' + orderMainid,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  wxPay(orser_no, money, openid) {//微信支付
    var orderMainid = wx.getStorageSync('mainorder_id')

    var url = config.domainwxpay + '/Pay',
      data = {
        orser_no: orser_no,
        money: money,
        openid: openid
      },
      that = this
    console.log('wxPaywxPaywxPaywxPaywxPay')

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
            url: '/pages/orderAddmeal/orderAddmeal?order_no=' + orderMainid
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)

    this.setData({
      order_id: options.order_id,
      dishlist: options.list
    })
    this.getIndexdata()
  },
  goback(){
    wx.navigateBack({
      data:'1'
    })
  },
  checktype(e) { //选择切换方式
    console.log(e)
    this.setData({
      payType: e.currentTarget.dataset.type
    })
  },
  getIndexdata() {
    console.log('123123')
    var fit_id = wx.getStorageSync('shop_id')
    // this.getIndexdata(fit_id)
    var url = config.domainCXB + '/confirmationOrder_add',
      data = {
        fit_id: fit_id,
        dish: this.data.dishlist
      },
      that = this
    app.ajaxData(url, data, 'post', function(res) {
      if (res.data.code == 200) {
        that.setData({
          pageData:res.data.data,
          money: res.data.data.money
        })
      }
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
    if (app.globalData.remark) {
      this.setData({
        remark: app.globalData.remark
      })
      console.log(app.globalData.remark)
    } else {
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