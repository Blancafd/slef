// pages/confirmOrder/confirmOrder.js
const app = getApp()
import {
  config
} from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0, //状态栏的高度
    payid: 2, //支付方式的id  1为余额支付 2 是微信支付
    shopingCard: [], //购物车列表
    voucher_id: '', //优惠券id
    shopingMoney: '', //购物车的金钱
    user_voucher: 0, //用户优惠券的数量
    remark: '', //备注的
    reduce_price: '', //优惠券优惠的价格
    priceAfter: '', //优惠券优惠后的价格
    remake: '', //订单备注
    payCook: true,  //防止重复点击去付款
    yuyueTime:'',//预约时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // var b = (JSON.stringify(options) == "{}");
    if (options.voucher_id) {
      console.log(options)
      console.log('有优惠券的id值')
      this.setData({
        voucher_id: options.voucher_id,
        reduce_price: options.reduce_price,
        priceAfter: options.priceAfter //优惠后的价格
      })
    }
    if (options.remark){
      console.log('选择了备注')
      this.setData({
        remark: options.remark
      })
    }
    let shopingMoney = wx.getStorageSync('shopingMoney'); //获取本地缓存中的shopingMoney
    this.setData({
      shopingMoney: shopingMoney
    })
    wx.getSystemInfo({
      success: (res) => {
        // 获取高和宽
        let statusBarHeight = (res.statusBarHeight) *2
        this.setData({
          statusBarHeight: statusBarHeight
        });
        console.log(this.data.statusBarHeight)
      }
    });
    // 获取当前时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    let yuyueTime = timestamp + 60*15; //十五分钟后取餐

    
    var n = yuyueTime * 1000;
    var date = new Date(n);  
    //时  
    var h = date.getHours();
    //分  
    var m = date.getMinutes(); 
    console.log("预约时间：" +  h + ":" + m );

    this.setData({
      yuyueTime: h + ":" + m 
    })

    this.getCartList(); //获取购物车列表
    this.user_voucher(); //获取用户可用的优惠券

  },
  // 获取购物车的列表
  getCartList: function() {
    wx.request({
      url: config.domainHYP + '/getCartList',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        member_id: app.globalData.user_id
      },
      method: 'get',
      success: res => {
        console.log("购物车菜品列表", res.data.data)

        if (res.data.code == 200) {
          this.setData({
            shopingCard: res.data.data
          })



        } else {
          wx.showToast({
            title: '网络开小差了~~',
            icon: 'success',
            duration: 2000
          })
        }

      }
    })
  },
  //获取用户可用的优惠券
  user_voucher: function() {
    wx.request({
      url: config.domain + '/user_voucher',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        // type: 2, //1餐盒2明档3包厢
        user_id: app.globalData.user_id
      },
      method: 'POST',
      success: res => {
        console.log("优惠券列表", res.data.data)

        if (res.data.code == 200) {
          let user_voucher = res.data.data.length
          this.setData({
            user_voucher: user_voucher
          })
          // console.log(this.data.user_voucher)



        } else {
          wx.showToast({
            title: '网络开小差了~~',
            icon: 'success',
            duration: 2000
          })
        }

      }
    })
  },
  pay: function(e) {
    this.setData({
      payid: e.currentTarget.dataset.id
    })
    // console.log('radio发生change事件，携带value值为：', this.data.payid);
  },
  goMealCoupon: function() {
    wx.navigateTo({
      url: '../mealcoupon/mealcoupon',
    });
  },
  goMealRemarks: function() {
    wx.navigateTo({
      url: '../mealRemarks/mealRemarks',
    });
  },
  // 去付款   先创建订单
  goMealCooking: function() {
    let phone = app.globalData.phone;
    console.log(phone)
    if (phone) {
      if (this.data.payCook) {
        var fit_id = wx.getStorageSync('shop_id')
        wx.request({
          url: config.domainHYP + '/orderAdd',

          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            member_id: app.globalData.user_id,
            pay_type: this.data.payid,
            remark: this.data.remark,
            voucher_id: this.data.voucher_id,
            fit_id: fit_id
          },
          method: 'POST',
          success: res => {
            // console.log(res)
            if (res.data.code == 200) {
              let order_sn = res.data.data.order_sn;
              let order_id = res.data.data.id;
              // 支付接口
              if (this.data.payid == 1) {
                console.log("我是余额支付")

                wx.request({
                  url: config.domainHXPpay + '/payMoney',
                  data: {
                    // app.globalData.userid 用户id
                    // openid: app.globalData.openid,
                    order_sn: order_sn,
                    member_id: app.globalData.user_id
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  method: 'POST',
                  success: res2 => {
                    if (res2.data.code == 200) {
                      console.log(res2);
                      // let data = res2.data;
                      wx.navigateTo({
                        url: '../mealCooking/mealCooking?order_id=' + order_id,
                      });

                    } else if (res2.data.code == 0) {
                      wx.showToast({
                        title: '您的余额不足，请及时充值',
                        icon: 'none',
                        duration: 2000
                      })
                      setTimeout(function() {
                        wx.redirect({
                          url: '../openarchives/openarchives',
                        });
                      }, 2100)



                    }


                  }
                })
              } else if (this.data.payid == 2) {
                console.log("我是微信支付")
                wx.request({
                  url: config.domainHXPpay + '/wxpay',
                  data: {
                    // app.globalData.userid 用户id
                    // openid: app.globalData.openid,
                    order_sn: order_sn,
                    openid: app.globalData.openid
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  method: 'POST',
                  success: res2 => {
                    if (res2.statusCode == 200) {
                      console.log(res2);
                      let data = res2.data;
                      wx.requestPayment({
                        timeStamp: data.timeStamp,
                        nonceStr: data.nonceStr,
                        package: data.package,
                        signType: 'MD5',
                        paySign: data.paySign,
                        success(res3) {
                          console.log(res3);
                          // if (errMsg)
                          wx.navigateTo({
                            url: '../mealCooking/mealCooking?order_id=' + order_id,
                          });
                        },
                        fail(res3) {
                          console.log("取消支付", res3)
                          wx.redirect({
                            url: '../openarchives/openarchives',
                          });
                        }
                      })
                    }
                  }
                })
              }
            } else if (res.data.code == 0) {
              let msg = res.data.msg;
              wx.showToast({
                title: msg,
                icon: 'none',
                duration: 2000
              })

            }

          }
        })
        this.setData({
          payCook: false
        })

      } else {
        var that = this;
        setTimeout(function() {
          that.setData({
            payCook: true
          })
        }, 3000)
      }

    } else {
      console.log("未注册")
      wx.navigateTo({
        url: '../authorization/authorization',
      });
    }


  },
  //  返回按钮
  goBack: function() {
    wx.navigateTo({
      url: '../chooseFoods/chooseFoods',
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
    // if (app.globalData.remark) {
    //   this.setData({
    //     remark: app.globalData.remark
    //   })
    //   console.log(app.globalData.remark)
    // } else {
    //   this.setData({
    //     remark: ''
    //   })
    // }
  },
  // 跳转到购买优惠券
  gopurchase: function() {
    wx.navigateTo({
      url: '../mealvoucherselection/mealvoucherselection',
    });
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