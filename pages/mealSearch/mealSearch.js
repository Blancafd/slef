// pages/menus/choose-foods/choose-foods.js
const app = getApp()
import {
  config
} from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0, //高
    inputValue:'', //搜索框的内容
    ladu: [], //规格弹框里面的规格
    flag: false, //遮罩层显示
    foodList: [], //食物列表
    shopingNum: 0, //购物车数量
    shopingMoney: '0', //购物车金额
    guigeList: [], //规格list
    guigeKey: 0, //规格的key
    guigeId: 0, //规格的id  2是中份 3是大份
    guigePrice: '', //规格的价格
    laduId: 0, //辣度的id  1是微辣 2是中辣 3是特辣
    foodKey: '', //食物列表的下标
    specsKey: 0, //辣度的key
    shopCar: false, //显示隐藏底部购物车
    shopingCard: [], //购物车列表
    shopKey: 0, //购物车列表的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        // 获取高和宽
        this.setData({
          statusBarHeight: res.statusBarHeight
        });
        console.log(this.data.statusBarHeight)
      }
    });
    this.getCartSum(); //获取购物车的数量以及金额
    
  },
  // 搜索输入框clearinput
  input:function(e){
    console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value
    })
    this.foodList(); //获取
  },
  // 清空搜索输入框
  clearinput: function () {
    this.setData({
      inputValue: ''
    })
    console.log(this.data.inputValue)
    this.foodList(); //获取
  },
  getCartSum: function () {
    wx.request({
      url: config.domainHYP + '/getCartSum',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        member_id:app.globalData.user_id
      },
      method: 'get',
      success: res => {
        console.log("购物车金额以及数量", res.data.data)
        if (res.data.code == 200) {
          let shopingNum = Number(res.data.data.num);
          let shopingMoney = Number(res.data.data.price).toFixed(2);
          this.setData({
            shopingNum: shopingNum,
            shopingMoney: shopingMoney
          })
        }

      }
    })
  },

  // 菜单列表
  foodList: function () {
    var fit_id = wx.getStorageSync('shop_id')
    wx.request({
      url: config.domainHYP + '/getdishs',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        fit_id: fit_id,
        member_id:app.globalData.user_id,
        dish_name:this.data.inputValue
      },
      method: 'get',
      success: res => {
        if (res.data.code == 200) {

          let data = res.data.data.list;
          this.setData({
            foodList: data
          })
          console.log("菜品列表", this.data.foodList)
        }

      }
    })
  },


  minusCount: function (e) {
    let key = e.currentTarget.dataset.key;
    let foodList = this.data.foodList;
    let food = foodList[key]
    let sku_id = food.sku_id;
    let price = food.price;
    let dish_id = food.id;
    let count = Number(food.count);

    count--
    console.log(count)
    food.count = count;
    foodList[key] = food;
    this.setData({
      foodList: foodList
    })
    // 保存在购物车数据库表中
    wx.request({
      url: config.domainHYP + '/cartAdd',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        flavor_id: this.data.laduId,
        member_id:app.globalData.user_id,
        sku_id: sku_id,
        dish_id: dish_id,
        count: count,
      },
      method: 'post',
      success: res => {
        console.log("加入购物车菜品", res)
        if (res.data.code == 200) {

        }

      }
    })

    let shopingNum = this.data.shopingNum; //购物车数量
    shopingNum--



    console.log(shopingNum);
    this.setData({
      flag: false,
      laduId: 0,
      shopingNum: shopingNum,
      guigeKey: 0
    })
    let sum = Number(this.data.shopingMoney);
    sum -= Number(price)
    let cont = sum.toFixed(2)
    this.setData({
      shopingMoney: cont
    })
  },
  addCount: function (e) {
    // console.log(e)
    let key = e.currentTarget.dataset.key
    let foodList = this.data.foodList;
    let food = foodList[key]
    let sku_id = food.sku_id;
    let price = food.price;
    let dish_id = food.id;
    let count = Number(food.count);

    count++
    console.log(count)
    food.count = count;
    foodList[key] = food;
    this.setData({
      foodList: foodList
    })
    
    // 保存在购物车数据库表中
    wx.request({
      url: config.domainHYP + '/cartAdd',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        flavor_id: this.data.laduId,
        member_id:app.globalData.user_id,
        sku_id: sku_id,
        dish_id: dish_id,
        count: count,
      },
      method: 'post',
      success: res => {
        console.log("加入购物车菜品", res)
        if (res.data.code == 200) {

        }

      }
    })

    let shopingNum = this.data.shopingNum; //购物车数量
    shopingNum++



    console.log(shopingNum);
    this.setData({
      flag: false,
      laduId: 0,
      shopingNum: shopingNum,
      guigeKey: 0
    })
    let sum = Number(this.data.shopingMoney);
    sum += Number(price)
    let cont = sum.toFixed(2)
    this.setData({
      shopingMoney: cont
    })
  },
  //选择规格的id  2是中份 3是大份
  chooseGuige: function (e) {
    // console.log(e)
    this.setData({
      guigeId: e.currentTarget.dataset.id,
      guigeKey: e.currentTarget.dataset.key, //下标 用来知道选中的那个规格的价格单位以及重量
      guigePrice: e.currentTarget.dataset.price, //价格
    })
    console.log(this.data.guigePrice)
  },
  //辣度的id  1是微辣 2是中辣 3是特辣
  chooseLadu: function (e) {
    this.setData({
      laduId: e.currentTarget.dataset.id
    })
    // console.log(this.data.laduId)
  },
  // 显示规格的弹框
  goGuige: function (e) {
    // console.log(e)
    let dish_id = e.currentTarget.dataset.id;
    this.setData({
      flag: true
    })

    wx.request({
      url: config.domainHYP + '/getDishSkuList',

      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        dish_id: dish_id
      },
      method: 'get',
      success: res => {
        if (res.data.code == 200) {
          // console.log(res)

          let data = res.data.data.sku;
          let ladudata = res.data.data.flavor;
          let guigeId = data[0].id;
          this.setData({
            guigeList: data,
            guigeId: guigeId
          })
          console.log("规格列表", this.data.guigeList)
          if (ladudata != '') {
            let laduId = ladudata[0].flavor_id;
            this.setData({
              laduId: laduId,
              ladu: ladudata
            })
            console.log("辣度列表", this.data.ladu)
          }
        }

      }
    })



  },
  // 显示规格的弹框点击  加入餐盘  的方法
  gocanpan: function () {
    let key = this.data.guigeKey
    let foodList = this.data.foodList;
    let food = foodList[key]
    let sku_id = this.data.guigeId; //food.sku_id;
    let price = this.data.guigePrice; //food.price;
    let dish_id = food.id;
    let count = Number(food.count);
    // console.log('key', key)
    // console.log('food_sku', sku_id)
    // console.log('food', food)
    // console.log('price', price)
    console.log('dish_id', dish_id)
    count++
    // console.log(count)
    food.count = count;
    foodList[key] = food;
    this.setData({
      foodList: foodList
    })
   
    // 保存在购物车数据库表中
    wx.request({
      url: config.domainHYP + '/cartAdd',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        flavor_id: this.data.laduId,
        member_id:app.globalData.user_id,
        sku_id: sku_id,
        dish_id: dish_id,
        count: count,
      },
      method: 'post',
      success: res => {
        console.log("加入购物车菜品", res)
        if (res.data.code == 200) {

        }

      }
    })

    let shopingNum = this.data.shopingNum; //购物车数量
    shopingNum++



    // console.log(shopingNum);
    this.setData({
      flag: false,
      shopingNum: shopingNum,
      guigeList: [], //规格list
      guigeKey: 0, //规格的key
      guigeId: 0, //规格的id  2是中份 3是大份
      laduId: 0, //辣度的id  1是微辣 2是中辣 3是特辣
      foodKey: 0, //食物列表的下标
    })
    let sum = Number(this.data.shopingMoney);
    sum += Number(price)
    let cont = sum.toFixed(2)
    this.setData({
      shopingMoney: cont
    })
  },

  // 隐藏规格的弹框
  closeGuige: function () {
    this.setData({
      flag: false,
      guigeList: [], //规格list
      guigeKey: 0, //规格的key
      guigeId: 0, //规格的id  2是中份 3是大份
      laduId: 0, //辣度的id  1是微辣 2是中辣 3是特辣
      foodKey: '', //食物列表的下标
    })
  },
  goJiesuan: function () {
    wx.setStorageSync("shopingMoney", this.data.shopingMoney) //存缓存
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder',
    });
  },

  //  返回按钮
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  showCar() { //显示购物车
    this.setData({
      shopCar: true,
    })
    wx.request({
      url: config.domainHYP + '/getCartList',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        member_id:app.globalData.user_id
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
  hideShop() {
    this.setData({
      shopCar: false
    })
  },
  addFootShop: function (e) {
    // console.log(e);
    let shopingCard = this.data.shopingCard;
    let shopkey = e.currentTarget.dataset.key;

    let sku_id = shopingCard[shopkey].sku_id;
    let flavor_id = shopingCard[shopkey].flavor_id;
    let count = shopingCard[shopkey].count;
    let price = shopingCard[shopkey].price;

    let foodList = this.data.foodList;
    // console.log(foodList)

    // 购物车更新
    count++
    // 保存在购物车数据库表中
    wx.request({
      url: config.domainHYP + '/cartAdd',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        flavor_id: flavor_id,
        member_id:app.globalData.user_id,
        sku_id: sku_id,
        count: count,
      },
      method: 'post',
      success: res => {
        console.log("加入购物车菜品", res)
        if (res.data.code == 200) {
          // 加入购物车后本地购物车也要更新

          shopingCard[shopkey].count = count
          // console.log(shopingCard[shopkey].count)
          // console.log(count)
          this.setData({
            shopingCard: shopingCard
          })
          // 通过sku 找到食物列表里的那一条  并加数量
          for (var i = 0; i < foodList.length; i++) {
            if (foodList[i].sku_id == sku_id) {
              var foodCount = foodList[i].count;
              foodCount++

              // console.log(foodList)
              // console.log(foodCount)
              foodList[i].count = foodCount
              // console.log(foodList)
              this.setData({
                foodList: foodList
              })

            }
          }


          // 修改购物车数量
          let shopingNum = this.data.shopingNum; //购物车数量
          shopingNum++

          // console.log(shopingNum);
          this.setData({
            shopingNum: shopingNum
          })
          let sum = Number(this.data.shopingMoney);
          sum += Number(price)
          let cont = sum.toFixed(2)
          this.setData({
            shopingMoney: cont
          })
        }

      }
    })


  },
  reduceFootShop: function (e) {
    // console.log(e)
    let shopingCard = this.data.shopingCard;
    let shopkey = e.currentTarget.dataset.key;

    let sku_id = shopingCard[shopkey].sku_id;
    let flavor_id = shopingCard[shopkey].flavor_id;
    let count = shopingCard[shopkey].count;
    let price = shopingCard[shopkey].price;

    let foodList = this.data.foodList;


    // console.log(foodList)

    // 购物车更新
    count--
    // 保存在购物车数据库表中
    wx.request({
      url: config.domainHYP + '/cartAdd',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        flavor_id: flavor_id,
        member_id:app.globalData.user_id,
        sku_id: sku_id,
        count: count,
      },
      method: 'post',
      success: res => {
        console.log("加入购物车菜品", res)
        if (res.data.code == 200) {
          // 加入购物车后本地购物车也要更新

          shopingCard[shopkey].count = count
          // console.log(shopingCard[shopkey].count)
          // console.log(count)
          this.setData({
            shopingCard: shopingCard
          })
          // 通过sku 找到食物列表里的那一条  并加数量
          for (var i = 0; i < foodList.length; i++) {
            if (foodList[i].sku_id == sku_id) {
              var foodCount = foodList[i].count;
              foodCount--

              // console.log(foodList)
              // console.log(foodCount)
              foodList[i].count = foodCount
              // console.log(foodList)
              this.setData({
                foodList: foodList
              })
            }
          }


          let shopingNum = this.data.shopingNum; //购物车数量
          shopingNum--

          // console.log(shopingNum);
          this.setData({
            shopingNum: shopingNum
          })
          let sum = Number(this.data.shopingMoney);
          sum -= Number(price)
          let cont = sum.toFixed(2)
          this.setData({
            shopingMoney: cont
          })

        }

      }
    })


  },
  // 清空购物车
  empty: function () {
    wx.request({
      url: config.domainHYP + '/clearCart',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        member_id:app.globalData.user_id
      },
      method: 'post',
      success: res => {
        console.log("清空购物车菜品", res)
        if (res.data.code == 200) {

          this.setData({
            shopingCard: [], //购物车列表
            shopingNum: 0, //购物车数量
            shopingMoney: '0', //购物车金额
            shopCar: false, //显示隐藏底部购物车
            shopKey: 0, //购物车列表的下标
          })
          this.foodList(); //重新请求食物列表
        }

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