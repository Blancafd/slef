// pages/appointroom/appointroom.js
const app = getApp()
import { config } from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    month: [],//未来一周时间
    week: [], //未来一周星期
    date: [],//未来一周完整日期
    current: 0,
    currentTap:1,//预约切换类型
    roomlist:[],//包间列表
    currentDate:'',//当前选择日期
    news:0,//消息提醒
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.message)
    this.mydate()
    console.log(this.data.date[this.data.current])
    console.log(app.globalData.fit_id)
    this.appointmentroom(this.data.date[this.data.current], app.globalData.fit_id)
    this.setData({
      news: app.globalData.message,
      currentDate: this.data.date[this.data.current]
    })
  },
  messagecenter() {
    wx.navigateTo({
      url: '../messagecenter/messagecenter',
    })
  },
  appointmentroom(start_date, fit_id) {//预约包厢
    var url = config.domainCXB + '/bookingRoom',
      data = {
        start_date: start_date,
        fit_id: fit_id,
        is_index:0
      },
      that = this
    app.ajaxData(url, data, 'post', function (res) {
      if (res.data.code == 200) {
        that.setData({
          roomlist: res.data.data
        })
      }
    })
  },
  mydate: function (e) { //获取未来一周时间
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
      var milliseconds = myDate1.getTime() + 1000 * 60 * 60 * 24 * i; //当i为0代表当前日期，为1时可以得到明天的日期
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
  select: function (e) {//选择当前一周的时间
    console.log(e)
    let i = e.currentTarget.dataset.index;
    this.setData({
      current: i
    })
    this.setData({
      currentDate: this.data.date[i]
    })
    this.appointmentroom(this.data.currentDate, app.globalData.fit_id)
  },
  checkTap(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      currentTap: type
    })
  },
  goDetail(e){
    console.log(e)
    var is_choose = e.currentTarget.dataset.ischoose
    var room_id = e.currentTarget.dataset.roomid
    wx.navigateTo({
      url: '../roomDetail/roomDetail?start_time=' + this.data.currentDate + '&&luncth=' + this.data.currentTap + '&&room_id=' + room_id + '&&is_choose=' + is_choose,
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