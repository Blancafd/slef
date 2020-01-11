// pages/orderAddmeal/orderAddmeal.js
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
    order_no: '', //订单号
    orderDetail: '', //订单详情
    remark:''
  },
  goremark() {//写备注
    wx.navigateTo({
      url: '../mealRemarks/mealRemarks',
    })
  },
  goaddMeal(e) {
    wx.navigateTo({
      url: '../addMeal/addMeal?order_id=' + e.currentTarget.dataset.orderid,
    })
  },
  goback() {
    // wx.navigateBack({
    //   data: '1'
    // })
    wx.switchTab({
      url: '../index/index',
    })
  },
  cancelOrder(){//取消订单
    var url = config.domainCXB + '/refund_apply',
      data = {
        order_no: this.data.order_no,
      },
      that = this
    app.ajaxData(url, data, 'post', function (res) {
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '../index/index',
          })
        },1500)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.order_no) {
      this.setData({
        order_no: options.order_no
      })
    }
    this.orderDetail(this.data.order_no)
  },
  orderDetail(orser_no) {
    var url = config.domainCXB + '/myReserve_info',
      data = {
        order_no: orser_no,
      },
      that = this
    app.ajaxData(url, data, 'post', function(res) {
      if (res.data.code == 200) {
        that.setData({
          orderDetail: res.data.data[0],
          remark: res.data.data[0].remark
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