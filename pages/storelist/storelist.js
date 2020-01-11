// pages/storelist/storelist.js
const app = getApp()
import { config } from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    storeList:[],
    storeList1: [],
    searchList:'',//搜索结果列表
    isSearch:false
  },
  goBack(){//返回上一页
    wx.navigateBack({
      data:'1'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  cutShop(e){//切换门店
    console.log(e)
    wx.setStorageSync('shop_id', e.currentTarget.dataset.shopid);
    wx.setStorageSync('shop_name', e.currentTarget.dataset.shopname);
    app.globalData.fit_id = e.currentTarget.dataset.shopid
    wx.switchTab({
      url: '../index/index',
    })
  },
  gomap(e){//门店详情
  console.log(e)
    wx.navigateTo({
      url: '../shopDetail/shopDetail?fit_id=' + e.currentTarget.dataset.shopid,
    })
  },
  onLoad: function (options) {
    app.globalData.latitude = wx.getStorageSync('latitude'), app.globalData.longitude = wx.getStorageSync('longitude')
    this.storelist()
  },
  search(address){
    var that = this
    var url = config.domain + '/fit_search',
      data = {
        lat: app.globalData.latitude,
        lng: app.globalData.longitude,
        address: address
      }
    app.ajaxData(url, data, 'post', function (res) {
        if(res.data.code ==200){
            that.setData({
              searchList:res.data.data.res,
              isSearch:true
            })
        }
    })
     
  },
  searchFit(e){
    this.search(e.detail.value)

  },
  storelist(){//门店列表
    var that = this
    var url = config.domain + '/fit_list',
      data = {
        lat: app.globalData.latitude,
        lng: app.globalData.longitude,
        fit_id:99
      }
    app.ajaxData(url, data, 'post', function (res) {
      console.log(res)
      if(res.data.code===200){
        that.setData({
          storeList:res.data.data.res,
          storeList1: res.data.data.short_distance
        })
      }
    })
  },
  storelist1() { //最近门店
    var that = this
    var url = config.domain + '/fit_list',
      data = {
        type: 1,
        lat: app.globalData.latitude,
        lng: app.globalData.longitude
      }
    app.ajaxData(url, data, 'post', function (res) {
      console.log(res)
      if (res.data.code === 200) {
        that.setData({
          storeList1: res.data.data.res
        })
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
    console.log(app.globalData.latitude)
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