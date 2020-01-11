// pages/Invitation/Invitation.js
const app = getApp();
import { config } from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_for:'',
    datearr:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.login({
      success: res => {
        wx.request({
          url: config.domain + '/getinfo',
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {

            that.setData({
              datearr: res.data.data
            })
            if (that.data.datearr.id == options.user_id) {
           
              that.invitation_award()
            } else if (that.data.datearr.phone) {
             
             
              wx.switchTab({
                url: '../index/index',
              })
            } else {
             
              wx.navigateTo({
                url: '../sharingregistration/sharingregistration?user_id=' + options.user_id ,
              })
            }
          },
        })
      }
    })

  },

  // getOpenid(code) {//获取openid
  //   var that = this
   

  // },
  
  invitation_award(){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'cook/invitation_award',
      data: {
        member_id: that.data.datearr.id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          my_for: res.data.data
        })
      },

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
    // this.invitation_award()
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
    return {
      title: '拾味堂好友分享',
      path: 'pages/Invitation/Invitation?user_id=' + app.globalData.user_id,
      imageUrl: 'http://image.sportfox.cn/b93c7201912251545058046lALPDgQ9rYqlMnnMwMzw_240_192.png'
    }
  }
})