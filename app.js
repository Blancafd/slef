//app.js
import { config } from './utils/config.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // wx.getLocation({ //获取当前位置
    //   success: (res) => {
    //     console.log(res)
    //     let latitude = res.latitude; // 当前位置纬度
    //     let longitude = res.longitude; // 当前位置经度
    //     that.indexData(latitude, longitude)

    //   },
    // })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        this.getOpenid(res.code)
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log('授权成功')
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData.userInfo)
              // this.globalData.isAuthorization = true
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          console.log('未授权成功')
          console.log(this.globalData.userInfo)
        }
      }
    })
  },
  indexData(lat, lng) {
    var url = config.domain + '/fit_list',
      data = {
        lat: lat,
        lng: lng
      },
      that = this
    that.ajaxData(url, data, 'post', function (res) {
      if (res.data.code == 200) {
        wx.setStorageSync('shop_id', res.data.data.short_distance.id);
      }
    })
  },
  globalData: {
    meal_id:'',//套餐id
    fit_id: '',
    phone: '',
    isAuthorization:false,//用户是否授权
    aa: 1,
    latitude: '',//纬度
    longitude: '',//经度
    openid: '',
    userInfo: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],//获取手机顶部导航栏高度
    nickName: '',
    avatarUrl: '',
    user_id: '',//用户的主键id
    remark:'',//订单备注

    // ///////////////分割线
    paymentcode: 1,//是否支付餐盘
    domain: "https://data.wadd.vip/api/v2.",//后台接口地址
    urlimg: 'https://data.wadd.vip/api/v1.',//图片上传地址
    carts: {}, //用户选择的餐盘
    cartSelected: '',//用户选择购物卷的id
    reduce_prl: 0,//用户优惠价格
    reduce_price: 0,//优惠后的价格
    forinter: {},//选择充值的餐券
    message: 0,//消息提醒
    appId: 'wxf2a7a672a613cd6f',//当前小程序APPID
  },
  getOpenid(code) {//获取openid
    var that = this
    var url = config.domain + '/getinfo',
      data = { code: code },
      that = this
    that.ajaxData(url, data, 'post', function (res) {
      that.globalData.phone = res.data.data.phone
      that.globalData.openid = res.data.data.openid
      that.globalData.avatarUrl = res.data.data.avatarUrl
      that.globalData.nickName = res.data.data.nickName
      that.globalData.member_id = res.data.data.id
      that.globalData.user_id = res.data.data.id
      that.globalData.message = res.data.data.message
    })

  },
  //ajax请求方法封装
  ajaxData: function (url, data, method, callBack) {
    var that = this;
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        //console.log(res);
        // setTimeout(function () {
        //   wx.hideLoading()
        // }, 500)
        callBack(res);
      },
      fail: function (res) {
        console.log(4)
        wx.showToast({
          title: '网络开了小差~',
        })
      },
      complete: function (res) {
        console.log(res)
        setTimeout(function () {
          wx.hideLoading()
        }, 8000)
      }
    })
  },
})