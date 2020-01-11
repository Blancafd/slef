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
    remakeList: [{
        id: 1,
        name: '不要葱',
        clas: 'text1',
        selected: false,
      },
      {
        id: 2,
        name: '不要香菜',
        clas: 'text2',
        selected: false,
      },
      {
        id: 3,
        name: '少放辣',
        clas: 'text3',
        selected: false,
      },
      {
        id: 4,
        name: '多放醋',
        clas: 'text4',
        selected: false,
      },
      {
        id: 5,
        name: '少放油',
        clas: 'text5',
        selected: false,
      },
      {
        id: 6,
        name: '少放盐',
        clas: 'text6',
        selected: false,
      },
      {
        id: 7,
        name: '酱油过敏',
        clas: 'text7',
        selected: false,
      },
      {
        id: 8,
        name: '变态辣',
        clas: 'text8',
        selected: false,
      },
      {
        id: 9,
        name: '多放糖',
        clas: 'text9',
        selected: false,
      },
      {
        id: 10,
        name: '味精过敏',
        clas: 'text10',
        selected: false,
      },

    ],
    detailValue:'填写您对商家的额外备注信息',
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
  },
  getValue(e){
    console.log(e)
    this.setData({
      detailValue: e.detail.value
    })
  },
  Remark: function(e) {
    console.log('checkboxChange e:', e);
    let string = "remakeList[" + e.target.dataset.index + "].selected"
    this.setData({
      [string]: !this.data.remakeList[e.target.dataset.index].selected
    })
    let detailValue = this.data.remakeList.filter(it => it.selected).map(it => it.name);
    let arr = detailValue.join(",")
    this.setData({
      detailValue: arr
    })
    console.log('所有选中的值为：', this.data.detailValue)
  },
  //  返回按钮
  goBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  saveRemake:function(){
    console.log(this.data.detailValue)
    app.globalData.remark = this.data.detailValue
    // wx.setStorageSync("remark", this.data.detailValue)

    // wx.redirectTo({
    //   url: '../confirmOrder/confirmOrder?remark=' + this.data.detailValue,
    // })
    wx.navigateBack({
      data:'1'
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