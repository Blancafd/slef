// pages/voucherrecharge/voucher recharge.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontter:{},//充值点券信息
    pricedata:'',
    flag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.forinter)
    this.setData({
      fontter: app.globalData.forinter,
      pricedata: Number(app.globalData.forinter.price * 10) 
    })
  },
  //结算接口
  settlement(){
    var that = this;
    if (that.data.flag){
      wx.request({
        url: app.globalData.domain + 'cook/order_coupon',
        method: "post",
        data: {
          user_id: app.globalData.user_id,
          id: that.data.fontter.id,
          price: that.data.fontter.price,
          used_type: that.data.fontter.used_type
        },
        success: function (res) {
          console.log(res.data.data)
          var pydara = res.data.data
          that.wx_pay(pydara)
          // that.setData({
          //   coupon: res.data.data.res
          // })

        }
      })
      that.data.flag = false
    }else{
      console.log(11)
      wx.showToast({
        title: '请勿重复点击',
        duration: 1000,
        icon: 'none'
      })
      setTimeout(function () {
        that.data.flag = true
      }, 3000)
    }
 
  },
  //微信支付
  wx_pay(pydara){
     var that = this;
     wx.request({
       url: app.globalData.domain + 'payvoucher/pay',
       method: "post",
       data: {
         openid: pydara.openid,
         total_fee: pydara.price,
         order_sn: pydara.order_sn
       },
       success: function (res) {
         if (res.data.state == 200) {
           var pay = res.data
           //发起支付 
           var timeStamp = pay.timeStamp;
           var packages = pay.package;
           var paySign = pay.paySign;
           var nonceStr = pay.nonceStr;
           var param = {
             "timeStamp": timeStamp,
             "package": packages,
             "paySign": paySign,
             "signType": "MD5",
             "nonceStr": nonceStr
           };
           console.log(param)
           wx.requestPayment({
             timeStamp: param.timeStamp,
             nonceStr: param.nonceStr,
             package: param.package,
             signType: param.signType,
             paySign: param.paySign,
             success: function (res) {
               wx.showToast({
                 title: '充值成功',
                 
               })
               setTimeout(function () {
                 wx.navigateBack({
                   delta: 2
                 })
               }, 2000)

             },
             fail: function (res) {//


             },
             complete: function () {
               // complete 
             }
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