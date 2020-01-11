// pages/stararea/stararea.js
const app = getApp();
const arr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight + 25,
    isshow: false,
    checks: [],
    check_days: 0,
    sign_type: '',
    buttonshow: true,
    boxshow: false,
    point: '',
    isshop: false,
    topshow: false,
    my_for:'',//星币数量

  },

  //返回按钮
  back() {
    wx.reLaunch({
      url: '../personalcenter/personalcenter',
    })
  },
  //帮助
  help() {
    var that = this;
    that.setData({
      isshow: true,
    })
  },
  //星圆明细
  stardetail(){
    wx.navigateTo({
      url: '../stardetail/stardetail',
    })
  },
  //点击签到

  signin() {
    var that = this;
    if (app.globalData.phone){
      wx.request({
        url: app.globalData.domain + 'cook/user_sign',
        data: {
          id: app.globalData.user_id,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 200) {
            var point = res.data.data.point;
            that.setData({
              boxshow: true,
              buttonshow: false,
              point: res.data.data.point
            })
            if (that.data.boxshow) {
              setTimeout(function () {
                that.setData({
                  boxshow: false,
                })
              }, 2000);
              that.getList();
              that.getuserstar();

            }
          }


        },
        fail: function (res) {
          console.log(res)
        }
      })
    } else {
      wx.showToast({
        title: '请先注册',
        icon: 'none'
      })
    }

  },
  //星币获取
  getuserstar(){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'cook/my_info',
      data: {
        id: app.globalData.user_id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        // console.log(res.data.data)

        that.setData({
          my_for: res.data.data
        })
      },

    })
  },

  //签到列表sign_list
  getList() {
    var that = this;
    wx.request({
      url: app.globalData.domain + 'cook/sign_list',
      data: {
        id: app.globalData.user_id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
       
        var checks = res.data.data.res;
        var check_days = res.data.data.check_days;
        var sign_type = res.data.data.sign_type;
        if (sign_type == 1) {
          that.setData({
            buttonshow: false
          })
        }
        that.setData({
          checks: checks,
          check_days: check_days,
          sign_type: sign_type
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })

  },

  //关闭弹框
  close() {
    var that = this;
    that.setData({
      isshow: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(11)
    var that = this;
    that.getList();
    that.getuserstar();//调用星币数量接口
  },
  onReachBottom: function () {


  },

  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e) {
      if (e.scrollTop > 300) {
        this.setData({
          topshow: true
        });
      } else {
        this.setData({
          topshow: false
        });
      }
    }

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})