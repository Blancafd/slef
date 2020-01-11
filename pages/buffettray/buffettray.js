// pages/buffettray/buffettray.js

const app = getApp();
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:1,
    listarr:[],//接口列表
    y_refund:"",//已支付，取消订单的订单号
    meader:'',//判断退款的方式
  },
  details(e){
    var dataobj = e.currentTarget.dataset.item
    var dataobj = JSON.stringify(dataobj)
    // console.log(dataobj)
    wx.navigateTo({
      url: '../platedetails/platedetails?dataobj='+dataobj,
    })
  },
  //已支付，取消订单
  showPopup(e) {
    console.log(e.currentTarget.dataset.is_pay)
    this.setData({
      y_refund: e.currentTarget.dataset.id,
      meader: e.currentTarget.dataset.is_pay
    })
    this.popup.showPopup();
  },
 //支付订单
  showiss(e){
    var that = this;
    
    var paterarr = e.currentTarget.dataset.item
    console.log(paterarr.pay_type)
    if (paterarr.pay_type == 1) {//微信支付
      console.log(paterarr)
      var that = this;
      wx.request({
        url: app.globalData.domain + 'Paymeal/pay',
        method: "post",
        data: {
          openid: app.globalData.openid,
          total_fee: paterarr.price,
          order_sn: paterarr.order_id
        },
        success: function (res) {
        console.log(res)
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
                app.globalData.cartSelected = ''
                wx.showToast({
                  title: '支付成功',

                })
                that.meal_order_list() 

              },
              fail: function (res) {//


              },
              complete: function () {
               
              }
            })


          }

        }
      })
    } else if (paterarr.pay_type == 2) {//余额支付
          wx.request({
            url: app.globalData.domain + 'meal/meal_pay_money',
            method: "post",
            data: {
              id: app.globalData.user_id,
              order_id: paterarr.order_id,
              price: paterarr.price,
            }, success: function (res) {
              // console.log(res.data)
              if (res.data.code == 200) {
               
                wx.showToast({
                  title: '支付成功',
                  icon: 'none',
                })
                that.meal_order_list()
              } else if (res.data.code == 400){
              
                wx.showToast({
                  title: '余额不足',
                  icon: 'none',
                })
              }
               else {
              
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                })
              }
            }
          })
    } else {
      wx.showToast({
        title: '远古的定单，因为没有支付方式所以无法付款',
        icon: 'none',
      })
      
    }
  
  },
  //取消事件
  _error() {
    this.popup.hidePopup();
  },
  //确认事件
  _success() {
    var that = this;
    if (that.data.meader == 1) {//未支付退款
      wx.request({
        url: app.globalData.domain + 'meal/cancel_meal_order',
        method: "post",
        data: {
          order_id: that.data.y_refund
        }, success: function (res) {
          console.log(res.data)
          if (res.data.code == 200) {
          

            wx.showToast({
              title: '取消成功',
              icon: 'none',
            })
            that.meal_order_list()
          } else {
          
            wx.showToast({
              title: '取消失败',
              icon: 'none',
            })
          }


        }
      })
    } else if (that.data.meader == 2){//已支付退款
      wx.request({
        url: app.globalData.domain + 'meal/meal_apply_refund',
        method: "post",
        data: {
          order_id: that.data.y_refund
        }, success: function (res) {
          console.log(res.data)
          if (res.data.code == 200) {
         
            wx.showToast({
              title: '已提交申请',
              icon: 'none',
            })
            that.meal_order_list()
          } else {
            wx.showToast({
              title: '取消失败',
              icon: 'none',
            })
            
          }


        }
      })
    }
   

    that.popup.hidePopup();
  },
  //点击切换
  currentTab(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.id,
    })
    this.meal_order_list()
  },
  //获取列表数据
  meal_order_list() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'cook/meal_order_list',
      method: "post",
      data: {
        member_id: app.globalData.user_id,
        type: that.data.currentIndex
      }, success: function (res) {
         console.log(res.data.data.res)
        that.setData({
          listarr: res.data.data.res
        })

      }
    })
  },
  refund(){
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.meal_order_list()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得popup组件
    
    this.popup = this.selectComponent("#popup");
   
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