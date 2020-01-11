// pages/personalcenter/personalcenter.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},//用户信息
    currentIndex:1,//默认选择一个显示
    isshop:false,//登录状态
    imgs: [],//本地图片地址数组
    picPaths: [],//网络路径
    scrollTop: 0,//滑动模块
    kllot:false,
    textdata:'',//用户反馈填写的内容
    my_for:'',//个人中心数据
    phone:'',//电话
    pecificquantity:'',//个数据的具体事件

  },
  //个人中心数据
  my_info(){
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

//
  my_order(){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'cook/my_order',
      data: {
        member_id: app.globalData.user_id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

    

        that.setData({
          pecificquantity: res.data.data
        })
      },

    }) 
  },
  //判断用户是否注册
  dataphone(){
    if (app.globalData.phone){
      this.setData({
        isshop: true
      })
    }else{
      this.setData({
        isshop:false
      })
    }
  },
  //注册
  authorization() {
    wx.navigateTo({
      url: '../authorization/authorization',
    })
  },
 //签到
  stararea(){
    wx.navigateTo({
      url: '../stararea/stararea',
    })
  },
  //明档
  openarchives(){
    wx.navigateTo({
      url: '../openarchives/openarchives',
    })
  },
  //自助餐盘
  buffettray() {
    wx.navigateTo({
      url: '../buffettray/buffettray',
    })
  },
  //包厢
  balcony(){
    wx.navigateTo({
      url: '../balcony/balcony',
    })
  },
  //就餐劵
  mealcoupon(){
    wx.navigateTo({
      url: '../mealcoupon/mealcoupon',
    })
  },
  //  星圆
  starcircle(){
    var my_xing = this.data.my_for.integral
    wx.navigateTo({
      url: '../starcircle/starcircle?my_xing=' + my_xing,
    })
  },
  //页面滚动执行方式
  onPageScroll(e) {
    this.setData({
      kllot:true,
      scrollTop: e.scrollTop
    })
  },
  //左右切换
  currentTab(e){
  
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      })
  },
  //添加上传图片
  chooseImageTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  // 图片本地路径
  chooseWxImage: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res.tempFilePaths[0]);
        that.upImgs(res.tempFilePaths[0], 0) //调用上传方法
      }
    })
  },
  //上传服务器
  upImgs: function (imgurl, index) {
    var that = this;
    wx.uploadFile({
      url: app.globalData.urlimg + 'node/uploadImg',//
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: null,
      success: function (res) {
        //接口返回网络路径
        var data = JSON.parse(res.data)
        // console.log(data.data.src)
        that.data.picPaths.push(data.data.src)
        that.setData({
          picPaths: that.data.picPaths
        }) 
      }
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var picPaths = this.data.picPaths;
    var index = e.currentTarget.dataset.index;
    picPaths.splice(index, 1);
    this.setData({
      picPaths: picPaths
    });
  },
  //
  textdata(e){
    this.data.textdata = e.detail.value
  },

  //拾味堂问题反馈
  feedback(){
    var that = this;
    wx.request({
      url: app.globalData.domain + 'cook/feedback',
      data: {
        id: app.globalData.user_id,
        content: that.data.textdata,
        email:'',
        is_message:1,
        imgurls: JSON.stringify(that.data.picPaths)
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.code==200){
           
          wx.showToast({
            title: '反馈成功',
            duration: 1000,
            icon: 'none'
          })
            that.setData({
              textdata:'',
              picPaths:''
            })
        }else{
          wx.showToast({
            title: '反馈失败',
            duration: 1000,
            icon: 'none'
          })
        }
        // that.setData({
        //   my_for: res.data.data
        // })
      },

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        phone: app.globalData.phone
      })
    }
    console.log(app.globalData.userInfo)
    this.my_info()
    this.my_order()
    this.dataphone()
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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        phone: app.globalData.phone
      })
    }
    this.my_info()
    this.my_order()
    this.dataphone()
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
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: '拾味堂好友分享',
      path: 'pages/Invitation/Invitation?user_id=' + app.globalData.user_id,
      imageUrl:'http://image.sportfox.cn/b93c7201912251545058046lALPDgQ9rYqlMnnMwMzw_240_192.png'
    }
  }
})