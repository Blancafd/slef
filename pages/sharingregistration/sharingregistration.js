// pages/authorization/authorization.js
const app = getApp()
import {
  config
} from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    getPhone: false,
    user_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      user_id: options.user_id
    })
    console.log(that.data.user_id)
    wx.getLocation({ //获取当前位置
      success: (res) => {
        console.log(res)
        let latitude = res.latitude; // 当前位置纬度
        let longitude = res.longitude; // 当前位置经度
        wx.setStorageSync('latitude', latitude);
        wx.setStorageSync('longitude', longitude);
      },
    })
  },
  getPhoneNumber: function (e) { //获取手机号
    var that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        var that = this
        var url = config.domain + '/getPhoneNumber',
          data = {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },
          that = this
        app.ajaxData(url, data, 'post', function (res) {
          console.log(res)
          if (res.data.code == 200) {
            that.regiest(res.data.data.phoneNumber)
            app.globalData.phone = res.data.data.phoneNumber
          }
        })
      }
    })
    console.log(e)
  },

  getUserInfo: function (e) {//授权获取微信信息
    let that = this;
    // console.log(e)
    // 获取用户信息
    wx.getSetting({
      success(res) {
        // console.log("res", res)
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log("获取用户信息成功", res)
              that.setData({
                userInfo: res.userInfo,
                getPhone: true
              })
            },
            fail(res) {
              console.log("获取用户信息失败", res)
            }
          })
        } else {

        }
      }
    })
  },
  regiest(phone) { //授权获取的信息传给后台保存用户信息
    let that = this
    console.log(that.data.user_id)
    var url = config.domain + '/register',
      data = {
        avatarUrl: that.data.userInfo.avatarUrl,
        nickName: that.data.userInfo.nickName,
        phone: phone,
        invitation_id: that.data.user_id,
        openid: app.globalData.openid,

      }
    app.ajaxData(url, data, 'post', function (res) {
      console.log(res)
      if (res.data.code == 200) {
        wx.switchTab({
          url: '../index/index',
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