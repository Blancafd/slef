// pages/newPay/newPay.js
const app = getApp()
const domain = app.globalData.domain
var timer
var count = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow:1,//扫码
    is: 2,//付款码
    domain: "https://hxx.wadd.vip/api/v2.",
    openid: '',
  
    action: 0,
    src: '',
    star:'',
    money:'',
    ScreenBrightness:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var isshow = options.isshow;//扫码  2 
    var is = options.is;//付款码 1 亮
    console.log(options)
    if (isshow==2){
      that.setData({
        isshow: isshow
      })
    }
    if (is==1){
      that.setData({
        is: is
      })
    }
    that.setData({
      openid: app.globalData.openid,
      domain: app.globalData.domain,
     

    })
    that.getstar();
    // wx.setScreenBrightness({
    //   value: 1
    // })
  
  },

  //get
  getstar(){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'newgoods/getUserPoint',
      method: "post",
      data: {
        openid: app.globalData.openid
      }, success: function (res) {
        if (res.data.code == 200) {
          app.globalData.star = res.data.data.xmoney;
          that.setData({
            star: res.data.data.xmoney,
            money: res.data.data.money
          })
        } else {
          that.setData({
            star: '无数据'
          })
        }

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
    var that = this;


    // wx.setScreenBrightness({
    //   value: 1,//屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮
    //   success(res) {
    //     console.log(res)
    //   }
    // })
    wx.setScreenBrightness({
     value: 1

    })
  
  
   
    timer = setInterval(function () {
      console.log(1232312313)
      count++
      that.setData({
        isRefresh: false,
        action: count
      })
    }, 180000)

    that.getstar();
    // that.changeScreenLight();
  },




  refresh() {
    count++
    var that = this
    that.setData({
      isRefresh: false,
      action: count
    })
  },
  ///扫码
  sweepcodes(e) {
    var that =this;
    var status = e.currentTarget.dataset.id;
    console.log(status);
    that.setData({
      isshow: status,
      is:2
    })


      if (app.globalData.phonenumber) {
        wx.scanCode({
          success(res) {
            console.log(res);
            var path = res.path;
            var device_id = res.path.split("=")[1];
            wx.request({
              url: 'https://hxx.wadd.vip/api/v2.newgoods/getDeviceImg',
              data: { device_id: device_id },
              header: {
                'content-type': 'application/json'
              },
              success: res => {
                // console.log(res)
              }
            })
          }
        })
      } else {
        wx.showToast({
          title: '请登录',
          icon: 'none'
        })
      }

    
  },
  payment(e){
    var that = this;
    var status =  e.currentTarget.dataset.id;
    that.setData({
      is: status,
      isshow:1
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer)
    wx.setScreenBrightness({
      value: 0.5,
      success(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer)
    wx.setScreenBrightness({
      value: 0.5,
      success(res) {
        console.log(res)
      }
    })

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