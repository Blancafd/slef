// pages/menu/menu.js
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
    top10List: [],  //主厨推荐 top10
    count:0,   //数量
    message:0,  //消息数量
    scroll:1, //滑动的数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        // 获取高和宽
        this.setData({
          statusBarHeight: res.statusBarHeight
        });
        console.log(this.data.statusBarHeight)
      }
    });
    let message = app.globalData.message;
    this.setData({
      message: message
    })
    this.top10(); // 主厨推荐 top10
  },
  menuscroll: function(e) {
    console.log(e)
    // console.log(e.detail.scrollWidth)
    let zongWidth = e.detail.scrollWidth; //滑动区域大小
    let sum = this.data.count; //总数
    // //每份多大
    let fen = (zongWidth / sum)/1.7;
    let scrollLeft = e.detail.scrollLeft;
    // console.log(fen)
    // console.log(scrollLeft)
    for (var i = 1; i <= sum;i++){
      // console.log(i,i * fen)
      let zuoqu = (i - 1) * fen;
      let youqu = (i + 1) * fen;
      let zhongqu = i * fen;
      if (scrollLeft > zuoqu && scrollLeft < youqu && scrollLeft <= zhongqu){
        // console.log(i)
        this.setData({
          scroll:i
        })
      }
    }
    
  },
  goChoosefood: function() {
    wx.navigateTo({
      url: "../chooseFoods/chooseFoods"
    })
  },
  // 主厨推荐 top10
  top10: function () {
    var fit_id = wx.getStorageSync('shop_id')
    wx.request({
      url: 'https://data.wadd.vip/api/v2.Diet/boutiqueDish',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        fit_id: fit_id
      },
      method: 'get',
      success: res => {
        console.log("精品菜", res)
        if (res.data.code == 200) {
          let data = res.data.data;
          let dataLength = res.data.data.length;
          this.setData({
            top10List: data,
            count: dataLength
          })
        }

      }
    })
  },
  goMessage:function(){
    wx.navigateTo({
      url: '../messagecenter/messagecenter',
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