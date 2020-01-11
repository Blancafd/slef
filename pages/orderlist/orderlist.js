// pages/orderlist/orderlist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartSelected:1,
    prister:'',//优惠卷的价格
    arrlist:{},//用来保存从全局过来的餐盘数据
    arrlength:0,
    order_id:'',//订单号
    flag:true,
    pricelont:'',//支付价格
  },
  meanlonter(){
    wx.navigateTo({
      url: '../mealvoucherselection/mealvoucherselection',
    })
  },
  //支付接口
  prinder(){
    var that = this;
    if (that.data.flag == true){
      wx.request({
        url: app.globalData.domain + 'meal/box_order',
        method: "post",
        data: {
          member_id: app.globalData.user_id,
          box_id: that.data.arrlist.id,
          price: app.globalData.reduce_price,
          voucher_id: app.globalData.cartSelected,
          fit_id: app.globalData.fit_id,
          pay_type: that.data.cartSelected
        }, success: function (res) {
         
          if (res.data.code == 200) {
            that.setData({
              order_id: res.data.data
            })

          } else {
            wx.showToast({
              title: '下单失败',
              duration: 1000,
              icon: 'none'
            })
          }

          
        }
      })
      setTimeout(function () {//通过定时器让下单和支付同步
        if (that.data.cartSelected == 2) {//余额支付
          wx.request({
            url: app.globalData.domain + 'meal/meal_pay_money',
            method: "post",
            data: {
              id: app.globalData.user_id,
              order_id: that.data.order_id,
              price: app.globalData.reduce_price,
            }, success: function (res) {
              app.globalData.cartSelected = ''
           
           
              if (res.data.code == 200) {

                wx.showToast({
                  title: '支付成功',
                  duration: 1000,
                  icon: 'none'
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 2
                  })
                }, 2000)
              } else if (res.data.code == 400) {
                wx.showToast({
                  title: '余额不足',
                  duration: 1000,
                  icon: 'none'
                })
                wx.navigateTo({
                  url: '../buffettray/buffettray',
                })
              } else {
                wx.showToast({
                  title: '支付失败',
                  duration: 1000,
                  icon: 'none'
                })
              }

            }
          })
        }
        if (that.data.cartSelected == 1) {//微信支付
          that.wx_pay()

        }
      }, 200);
      that.data.flag=false
    }else{
      wx.showToast({
        title: '请勿点击',
        duration: 1000,
        icon: 'none'
      })
      setTimeout(function () {
        that.data.flag = true
      }, 3000)
    }
    
     //下单
  
    // wx.showToast({
    //   title: '支付成功',
    //   duration: 1000,
    //   icon: 'none'
    // })
    // app.globalData.paymentcode = 2
    // wx.navigateTo({
    //   url: '../dinnerplate/dinnerplate',
    // })
  },
  //微信支付
  wx_pay() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'Paymeal/pay',
      method: "post",
      data: {
        openid: app.globalData.openid,
        total_fee: app.globalData.reduce_price,
        order_sn: that.data.order_id
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
       
          wx.requestPayment({
            timeStamp: param.timeStamp,
            nonceStr: param.nonceStr,
            package: param.package,
            signType: param.signType,
            paySign: param.paySign,
            success: function (res) {
              app.globalData.cartSelected = ''
              wx.showToast({
                title: '支付成功',

              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 2000)

            },
            fail: function (res) {//
              console.log(111) 
              wx.navigateTo({
                url: '../buffettray/buffettray',
              })  
           
            },
            complete: function () {
              // complete 
            }
          })


        }

      }
    })
  },
  //选择支付方式
  ioc_oloick(e){
    this.setData({
      cartSelected: e.currentTarget.dataset.id
    })
  },
  //跳转就餐劵页面
  dinter(){
    wx.navigateTo({
      url: '../diningcoupon/diningcoupon',
    })
  },
  //优惠卷列表来拿是否有可用优惠价
  user_voucher(user_id) {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'meal/user_voucher',
      method: "post",
      data: {
        type: 1,
        user_id: user_id
      }, success: function (res) {
     
    
        that.setData({
          arrlength: res.data.data.length
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.user_voucher(app.globalData.user_id)
    this.setData({
      arrlist: app.globalData.carts,
      pricelont: app.globalData.carts.price
    })
    app.globalData.reduce_price = app.globalData.carts.price//如果用户不使用优惠卷就直接赋值原价
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
    this.user_voucher(app.globalData.user_id)
    //
    this.setData({
      prister: app.globalData.reduce_prl,
      pricelont: app.globalData.reduce_price
    })
 
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.reduce_prl = 0
    app.globalData.reduce_price = this.data.arrlist.price
    this.data.flag = true
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
    app.globalData.reduce_prl=0

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