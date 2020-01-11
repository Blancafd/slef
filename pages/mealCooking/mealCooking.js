// pages/mealRemarks/mealRemarks.js
const app = getApp()
import {
  config
} from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    flag: false, //遮罩层显示
    erwemaShow: false, //查看二维码显示
    noorder: false, //取消订单
    noorderList: [{
        id: 1,
        name: '点错了，我想重新点',
        choose_img: '/images/mingdang/pay_choose.png',
        none_img: '/images/mingdang/pay_none.png',
      },
      {
        id: 2,
        name: '临时有事，我不想要了',
        choose_img: '/images/mingdang/pay_choose.png',
        none_img: '/images/mingdang/pay_none.png',
      },
      {
        id: 3,
        name: '等待时间太长',
        choose_img: '/images/mingdang/pay_choose.png',
        none_img: '/images/mingdang/pay_none.png',
      },
      {
        id: 4,
        name: '其他原因',
        choose_img: '/images/mingdang/ju_down.png',
        none_img: '/images/mingdang/ju_top.png',
      }
    ],
    noorderId: 1, //默认取消订单的选中
    noorderName: '点错了，我想重新点', //默认取消订单的选中
    qitaCont: '', //取消订单其他原因input框内容
    cooking: 1, //显示页面的状态  1是餐品烹饪  2是等待取餐 3是取餐完成
    order_id: '', //订单id  46
    detail: [], //订单菜单列表
    order: [], //订单详情
    get_qrcode: '', //取餐码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 取餐二维码

    this.setData({
      order_id: options.order_id //options.order_id
    })
    wx.getSystemInfo({
      success: (res) => {
        // 获取高和宽
        this.setData({
          statusBarHeight: res.statusBarHeight
        });
        console.log(this.data.statusBarHeight)
      }
    });
    let get_qrcode = 'https://data.wadd.vip/api/v2.cook/get_qrcode?order_id=' + this.data.order_id;
    this.setData({
      get_qrcode: get_qrcode
    })
    this.orderDetail();
  },
  // 获取订单详情
  orderDetail: function() {
    wx.request({
      url: config.domainHYP + '/getOrderInfo',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        order_id: this.data.order_id,
      },
      method: 'GET',
      success: res => {
        console.log("订单详情信息", res.data.data)

        if (res.data.code == 200) {
          this.setData({
            detail: res.data.data.detail,
            order: res.data.data.order,
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


  erweimaYin: function() {
    this.setData({
      flag: false,
      erwemaShow: false
    })
  },
  //  查看二维码
  looker: function() {
    this.setData({
      flag: true,
      erwemaShow: true
    })
  },
  //  选择取消订单的类型
  chooseNoOrder: function(e) {
    let ids = e.currentTarget.dataset.id; //获取自定义的id   
    let name = e.currentTarget.dataset.name; //获取自定义的name
    this.setData({
      noorderId: ids, //把获取的自定义id赋给当前组件的id(即获取当前组件)  
      noorderName: name
    })
    console.log(this.data.noorderName)

  },
  inputs: function(e) {
    this.setData({
      noorderName: e.detail.value
    })
    console.log(this.data.noorderName)

  },
  // 打开取消订单
  quxiaoOrder: function() {
    this.setData({
      flag: true,
      noorder: true
    })
  },
  //  关闭取消订单的弹框
  closeNoOrder: function() {
    this.setData({
      flag: false,
      noorder: false
    })
  },
  //  确定取消订单的弹框
  sureNoOrder: function() {
    wx.request({
      url: config.domainHYP + '/orderStatusEdit',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        order_id: this.data.order_id,
        status_desc: this.data.noorderName, //取消原因
        order_status: 6 //订单状态 6=退款中
      },
      method: 'POST',
      success: res => {
        console.log("退款取消订单", res)

        if (res.data.code == 200) {

          this.setData({
            flag: false,
            noorder: false
          })
          wx.showToast({
            title: '取消订单成功，退款金额将在三个工作日返回',
            icon: 'none',
            duration: 2000
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
  //  返回按钮
  goBack: function() {
    wx.navigateTo({
      url: '../chooseFoods/chooseFoods',
    });
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