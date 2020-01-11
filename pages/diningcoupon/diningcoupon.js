// pages/diningcoupon/diningcoupon.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartSelected:0,
    listarr:[],//商品卷的列表
    pronter:0,//使用商品倦的价格
    number:0,//使用商品卷的数量
    user_id:'',//用户id
    price: "",//餐盘价格
    // objt:{},
    onja:0,//优惠价格

  },
  //充值就餐劵
  mealvoucherselection() {
    wx.navigateTo({
      url: '../mealvoucherselection/mealvoucherselection',
    })
  },
  ioc_oloick(e){
    if (e.currentTarget.dataset.id == this.data.cartSelected){
      this.setData({
        cartSelected:false,
        pronter: 0,
        number: 0,
        onja:0,
      })
    }else{
      this.setData({
        cartSelected: e.currentTarget.dataset.id,
        pronter: e.currentTarget.dataset.price,
        number: 1
      })
      this.used_voucher(this.data.cartSelected)
    }
    
    
   
 
  },
  //用户使用这块的优惠
  used_voucher(id){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'meal/used_voucher',
      method: "post",
      data: {
        id: id,
        user_id: that.data.user_id,
        price: that.data.price
      }, success: function (res) {
         console.log(res.data.data)
        that.setData({
          onja: res.data.data.reduce_price,
          youhuihou: res.data.data.price
        })
      
      }
    })
  },
  //选择后返回上一页面
  oredter(){
  
    if (this.data.onja==0){
      wx.showToast({
        title: '请选择就餐劵',
        duration: 1000,
        icon: 'none'
      })
    }else{
   
      app.globalData.reduce_prl = this.data.onja//优惠的价格储存全局
      app.globalData.cartSelected = this.data.cartSelected//优惠的id储存全局
      app.globalData.reduce_price = this.data.youhuihou//优惠后的价格储存全局
      console.log(app.globalData.cartSelected)
      wx.navigateBack({     //返回上一页面或多级页面

        delta: 1

      })
    }
      
  },
  inder_iss(e) {
    var that = this
    var ids = e.currentTarget.dataset.id

    var list = this.data.listarr;
    list[ids].isshow = !list[ids].isshow
    this.setData({
      listarr: list
    })

  },
  //优惠卷列表
  user_voucher(user_id) {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'meal/user_voucher',
      method: "post",
      data: {
        type:1,
        user_id: that.data.user_id
      }, success: function (res) {
        let arr = res.data.data;

        arr.forEach(function (i, o) {
          i.isshow = false
        })
           that.setData({
             listarr: arr
           })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
     this.setData({
       user_id: app.globalData.user_id,
       price: app.globalData.carts.price
     })
    this.user_voucher(this.data.user_id)
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
         this.setData({
           cartSelected: app.globalData.cartSelected
         })
    if (this.data.cartSelected!=''){
    
      this.used_voucher(this.data.cartSelected)
    }
    this.user_voucher(this.data.user_id)
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