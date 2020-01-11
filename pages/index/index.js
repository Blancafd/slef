//index.js
//获取应用实例
const app = getApp()
import {
  config
} from '../../utils/config.js'
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    background: ['../../images/kai.png', '../../images/xing.png', '../../images/yu.png'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    month: [], //未来一周时间
    week: [], //未来一周星期
    date: [], //未来一周完整日期
    checkDate: '', //预约就餐日期
    current: 0,
    currentTab: 1, //预约包间切换（中餐、晚餐）
    name: '拾味堂',
    indexData: {}, //首页信息
    src: "../../images/xing.png",
    fit_id: '', //门店id
    roomlist: [], //包间列表
    dishlist: [], //精选菜品列表
    userInfo: '',
    news:'',//未读消息
    is_line:'',//是否营业
    listarr:[],//我的订单列表
    listarrLength:false,//是否有订单，有为true
  },
  //事件处理函数
  //消息中心
  messagecenter() {
    wx.navigateTo({
      url: '../messagecenter/messagecenter',
    })
  },
  goerCode(){
    wx.navigateTo({
      url: '../newPay/newPay',
     
    })
  },
  goroomlist(){
    console.log('123456')
    wx.switchTab({
      url: '/pages/appointroom/appointroom',
    })
  },
  // pages/chooseFoods/chooseFoods
  gochooseFoods(){
    wx.navigateTo({
      url: '../chooseFoods/chooseFoods',
    })
  },
  goMenu(){
    wx.switchTab({
      url: '../menu/menu',
    })



    //  wx.requestSubscribeMessage({
    //    tmplIds: ["ojygpvQ9rzVrkAeL-EEjNvFpG8zBS33KcbTEgZ4zE7U"],
    //   success: (res) => {
    //     console.log(res)
    //     var url = 'http://192.168.1.133/api/index/sendSubMessage',
         
    //       data = {
    //         // openid: app.globalData.openid
    //       },
    //       that = this
    //     console.log(url)
    //     app.ajaxData(url, data, 'post', function (res) {
    //       console.log(res)
    //     })
    //   },
    //   fail: (res) => {
    //     console.log(res)
    //    }
    // })
  },
  mydate: function(e) { //获取未来一周时间
    let dd = new Date();
    let year = dd.getFullYear();
    let monu = dd.getMonth() + 1;
    if (monu < 10) monu = '0' + monu;
    let day = dd.getDate();
    if (day < 10) day = '0' + day;
    let evr = monu + '.' + day;
    let ery = year + '-' + monu + '-' + day;
    let date = [];
    let weeks = [];
    let month = [];
    let time = [];
    let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    let first = weekday[dd.getDay()];
    var ceshi = 1

    for (var i = 0; i < 7; i++) {
      var weekDayArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] //星期映射数组
      var myDate1 = new Date()
      var milliseconds = myDate1.getTime() + 1000 * 60 * 60 * 24 * i; //当i为0代表当前日期，为1时可以得到明天的日期，以此类推
      var newMyDate = new Date(milliseconds);
      var weekDay = newMyDate.getDay(); //获取当前星期X(0-6,0代表星期天)
      var year1 = newMyDate.getFullYear(); //获取当前年
      var month1 = newMyDate.getMonth() + 1; //获取当前月
      var day1 = newMyDate.getDate(); //获取当前日
      if (month1 < 10) month1 = '0' + month1;
      if (day1 < 10) day1 = '0' + day1;
      month.push(month1 + "." + day1)
      date.push(year1 + '-' + month1 + "-" + day1)
      weeks.push(weekDayArr[weekDay])
    }




    // for (var i = 0; i < 6; i++) {
    //   dd.setDate(dd.getDate() + 1);
    //   let myddy = dd.getDay()
    //   let mon = dd.getMonth() + 1;
    //   let dat = dd.getDate();
    //   // if()
      // if (mon < 10) mon = '0' + mon;
      // if (dat < 10) dat = '0' + dat;
    //   weeks.push(weekday[myddy])
    //   month.push(mon + "." + dat)
    //   date.push(year + '-' + mon + "-" + dat)
    // }
    weeks.unshift('今天')
    month.unshift(evr)
    date.unshift(ery)
    this.setData({
      date: date,
      week: weeks,
      month: month
    })
  },
  select: function(e) { //选择当前一周的时间
    console.log(e)
    let i = e.currentTarget.dataset.index;
    this.setData({
      current: i,
      checkDate: this.data.date[i]
    })

    console.log(this.data.date[i])
    this.appointmentroom(this.data.date[i], this.data.fit_id)
  },
  goSmartbox() {
    if (!app.globalData.phone) {
      wx.navigateTo({
        url: '../authorization/authorization',
      })
    } else {
      wx.navigateTo({
        url: '../dinnerplate/dinnerplate',
      })
    }
  },
  checkTime(e) { //预约包厢的时间切换
    var that = this
    let type = e.currentTarget.dataset.type
    that.setData({
      currentTab: type
    })
  },
  goStorelist() { //门店切换
    if (app.globalData.phone){
      wx.getSetting({
        success:(res)=>{
          if (!res.authSetting['scope.userLocation']) {
            wx.openSetting({
              success: (res) => {
                console.log(res)
                wx.getLocation({
                  success: function(res) {
                    console.log(res)
                    let latitude = res.latitude; // 当前位置纬度
                    let longitude = res.longitude; // 当前位置经度
                    wx.setStorageSync('latitude', latitude);
                    wx.setStorageSync('longitude', longitude);
                  },
                })
              }
            })
          }else{
            wx.navigateTo({
              url: '../storelist/storelist',
            })
          }
        }
      })
      
    }else{
      wx.navigateTo({
        url: '../authorization/authorization',
      })
    }
    
  },
  appointmentroom(start_date, fit_id) { //预约包厢
    var url = config.domainCXB + '/bookingRoom',
      data = {
        start_date: start_date,
        fit_id: fit_id,
        is_index: 1
      },
      that = this
    app.ajaxData(url, data, 'post', function(res) {
      if (res.data.code == 200) {
        that.setData({
          roomlist: res.data.data
        })
        console.log(that.data.roomlist)
      }
    })
  },

  bastDiesh(fit_id) { //精选菜品
    var url = config.domainHYP + '/boutiqueDish',
      data = {
        fit_id: fit_id
      },

      that = this
    app.ajaxData(url, data, 'post', function(res) {
      if (res.data.code == 200) {
        that.setData({
          dishlist: res.data.data
        })
      }
    })
  },
  goroomDetail(e) {
    console.log(e)
    var room_id = e.currentTarget.dataset.roomid
    var is_choose = e.currentTarget.dataset.ischoose
     wx.requestSubscribeMessage({
       tmplIds: ["ojygpvQ9rzVrkAeL-EEjNvFpG8zBS33KcbTEgZ4zE7U"],
      success: (res) => {
        console.log(res)
        wx.navigateTo({
          url: '../roomDetail/roomDetail?start_time=' + this.data.checkDate + '&&luncth=' + this.data.currentTab + '&&room_id=' + room_id + '&&is_choose=' + is_choose,
        })
        // var url = 'http://192.168.1.133/api/index/sendSubMessage',

        //   data = {
        //     openid: app.globalData.openid
        //   },
        //   that = this
        // console.log(url)
        // app.ajaxData(url, data, 'post', function (res) {
        //   console.log(res)
        // })
      },
      fail: (res) => {
        wx.navigateTo({
          url: '../roomDetail/roomDetail?start_time=' + this.data.checkDate + '&&luncth=' + this.data.currentTab + '&&room_id=' + room_id + '&&is_choose=' + is_choose,
        })
       }
    })
    
  },

  getUserInfo(code){
    var that = this
    var url = config.domain + '/getinfo',
      data = { code: code },
      that = this
    app.ajaxData(url, data, 'post', function (res) {
      console.log(res)
      if(res.data.code == 200){
        app.globalData.userInfo = res.data.data
        app.globalData.user_id = res.data.data.id
        that.setData({
          userInfo: res.data.data,
          news: res.data.data.message
        })
        var fit_id = wx.getStorageSync('shop_id')
        wx.request({
          url: app.globalData.domain + 'Diet/getOrderList',
          method: "post",
          data: {
            page: 1,
            limit: 100,
            fit_id: fit_id,
            member_id: res.data.data.id,
            order_status: 0
          }, success: function (res) {
            // that.setData({
            //   listarr: res.data.data.list[0]
            // })
            let length = res.data.data.list.length;
            if (length != 0) {


              let obj = res.data.data.list;
              for (let i in obj) {
                // console.log(i, obj[i])
                // 找有正在正在烹饪的订单和待取餐的订单，找到其中一个就停止循环并保存data中
                if (obj[i].order_status == 5 || obj[i].order_status == 8) {

                  that.setData({
                    listarr: obj[i],
                    listarrLength:true
                  })
                  // console.log("找到正在进行的订单" )
                  break;
                }
              }
              console.log(that.data.listarr)
              
            };
          }
        })
      }
      
    })
 
    
  },
  
  onLoad: function() {
    console.log('load')
    var that = this
    that.mydate()
   
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          app.globalData.userInfo = res.userInfo
          wx.getUserInfo({
            success: res => {
              console.log(res)
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
          
        }
      }
    })
    that.setData({
      checkDate: that.data.date[that.data.current]
    })
    // if (app.globalData.latitude) {
    var fit_id = wx.getStorageSync('shop_id')
      var lat = app.globalData.latitude,
        lng = app.globalData.longitude
    that.indexData(lat, lng, fit_id)
    // }

    if (app.globalData.aa == 1) {
      // wx.getLocation({ //获取当前位置
      //   success: (res) => {
      //     console.log(res)
      //     let latitude = res.latitude; // 当前位置纬度
      //     let longitude = res.longitude; // 当前位置经度
      //     app.globalData.latitude = latitude;
      //     app.globalData.longitude = longitude;
      //     app.globalData.aa = 2;
      //     that.onLoad()
      //   },
      // })
      // app.globalData.aa = 2;
      // that.onLoad()
    }
  },
  storeInfo() { //门店信息
    var fit_id = wx.getStorageSync('shop_id')
    var url = config.domain + '/one_fit',
      data = {
        fit_id: fit_id
      },
      that = this
    app.ajaxData(url, data, 'post', function(res) {
      if (res.data.code == 200) {
        that.setData({
          indexData: res.data.data.res,
        })
      }
    })
  },
  indexData(lat, lng, fit_id) {
    var url = config.domain + '/fit_list',
      data = {
        lat: lat,
        lng: lng,
        fit_id: fit_id
      },
      that = this
    app.ajaxData(url, data, 'post', function(res) {
      if (res.data.code == 200) {
        that.setData({
          indexData: res.data.data.res,
          name: res.data.data.res.name,
          fit_id: res.data.data.res.id,
          is_line: res.data.data.res.is_line
        })
        wx.setStorageSync('shop_id', res.data.data.res.id)
        app.globalData.fit_id = res.data.data.res.id
      }
      that.appointmentroom(that.data.checkDate, that.data.fit_id)
      that.bastDiesh(that.data.fit_id)
    })
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  onShow() {
    console.log('onshow')
    var fit_id = wx.getStorageSync('shop_id'),that = this
    app.globalData.latitude = wx.getStorageSync('latitude'), app.globalData.longitude = wx.getStorageSync('longitude')
    var lat = app.globalData.latitude, lng = app.globalData.longitude
    that.indexData(lat, lng, fit_id)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.getUserInfo(res.code)
      }
    })
  },
  gomealCooking(){
    console.log(this.data.listarr)
    wx.navigateTo({
      url: '../mealCooking/mealCooking?order_id=' + this.data.listarr.id,
    })
  }
})