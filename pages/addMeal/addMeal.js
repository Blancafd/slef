// pages/addMeal/addMeal.js
const app = getApp()
import {
  config
} from '../../utils/config.js'
var arr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    isadd:false,//是否显示加减器
    shopingNum:0,//购物车数量
    priceTotal:0,//购物车总价格
    img:[
      "../../images/menu.png",
      "../../images/themeroom.png"
    ],
    isShownum:false,
    currentid:-1,
    calc:0,
    num:[1,2],
    cateList: [
      { img: '../../images/meal3.png', name: '热销' },
      { img: '../../images/meal1.png', name: '羹汤' },
      { img: '../../images/meal2.png', name: '荤菜' },
      { img: '../../images/meal4.png', name: '素菜' },
      { img: '../../images/meal5.png', name: '海鲜' },
    ],
    listNum:[],
    currentIndex:0,
    statusBarHeight: app.globalData.statusBarHeight,
    pageData:'',//页面数据
    carList:[],//购物车列表    
    arr:[],
    shopCar:false,
    dishList:[],
    searchlist:[],//搜索列表
    searchPage:false
  },
  getsrarchword(e) {//搜索
    console.log(e)
    this.setData({
      searchWord: e.detail.value
    })
    var fit_id = wx.getStorageSync('shop_id')
    var url = config.domainCXB + '/addDish_search',
      data = {
        fit_id: fit_id,
        dish_name: this.data.searchWord
      },
      that = this
    app.ajaxData(url, data, 'post', function (res) {
      if(res.data.code == 200){
        if (res.data.data.length>0){
          that.setData({
            searchPage:true
          })
        }else{
          that.setData({
            searchPage: false
          })
        }
        for (let i = 0; i < res.data.data.length; i++) {
          const item = res.data.data[i];
          item.countcar = 0;
        }
        that.setData({
          searchlist:res.data.data
        })
        console.log(that.data.searchlist)
      } else {
        that.setData({
          searchPage: false
        })
      }
    })
  },
  addmeal(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      currentid: index
    })
    console.log(this.data.currentid)
    console.log(index)
    if (this.data.currentid == index){
    
    }
  },
  sort(arr, key) {
    arr.sort(function (a, b) {
      return a[key] - b[key];
    });
    return arr;
  },
  goBack(){
    wx.navigateBack({
      data:'1'
    })
  },
  showCar(){//显示购物车
    let carArr = this.data.carList
    
    for (var i = 0; i < carArr.length;i++){
      if (carArr[i].count===0){
        carArr.splice(i, 1)
      }
    }
    this.setData({
      carList: carArr,
      shopCar: true
    })
  },
  clearCar(){
    var data = this.data.carList
    data.map(item=>{
      item.countcar = 0
      item.count = 0
    })
    this.setData({
      priceTotal:0,
      carList: data,
      shopCar: false,
      shopingNum:0,
      isShownum:false
    })
  },
  hideShop(){
    this.setData({
      shopCar: false
    })
  },
  getTotalmoney(){
    var that = this
    var totalList = that.data.pageData
    console.log(that.data.pageData)
    var money = 0
    for(var i=0;i<totalList.length;i++){
      for(var j=0;j<totalList[i].dish.length;j++){
       
      }
    }
  }, 
  addcar(e){
    var moneyTotal = this.data.priceTotal
    var id = e.currentTarget.dataset.id
    var datacar = this.data.carList
    console.log(datacar)
    var index = e.currentTarget.dataset.index
    datacar[index].countcar++
    var carnum = this.data.shopingNum, carPrice = this.data.priceTotal
    carnum++
    carPrice = datacar[index].countcar
    var array = this.data.pageData
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].dish.length; j++) {
        if (array[i].dish[j].id == id) {
          array[i].dish[j].count = datacar[index].countcar
        }
      }
    }
    this.setData({
      pageData: array,
      shopingNum: carnum,
      carList: datacar
    })
    
    // for (var i = 0; i < array.length; i++) {
    //   for (var j = 0; j < array[i].dish.length; j++) {
    //     moneyTotal += array[i].dish[j].count * array[i].dish[j].price
    //   }
    // }
    moneyTotal += Number(datacar[index].price)
    this.setData({

      priceTotal: moneyTotal
    })
    console.log(moneyTotal)
  },
  reducecar(e){
    var moneyTotal = this.data.priceTotal
    var id = e.currentTarget.dataset.id
    var datacar = this.data.carList
    var array = this.data.pageData
    var index = e.currentTarget.dataset.index
    
    datacar[index].countcar--
    var carnum = this.data.shopingNum
    carnum--
    moneyTotal -= Number(datacar[index].price)
    for (var i = 0; i < array.length;i++){
      for(var j=0;j<array[i].dish.length;j++){
        if(array[i].dish[j].id == id){
          array[i].dish[j].count = datacar[index].countcar
        }
      }
    }
    if (datacar[index].countcar === 0){
      datacar.splice(index,1)
    }
    if (this.data.carList.length<1){
      this.setData({
        shopCar: false
      })
    }
    
    // for (var i = 0; i < array.length; i++) {
    //   for (var j = 0; j < array[i].dish.length; j++) {
    //     carPrice -= array[i].dish[j].price
    //   }
    // }
    this.setData({
      priceTotal: moneyTotal,
      pageData: array,
      shopingNum: carnum,
      carList: datacar
    })
  },
  searchadd(e) {//搜索列表加购物车
    console.log(e)
    console.log(this.data.priceTotal)
    console.log(this.data.searchlist)
    var searchlist = this.data.searchlist
    var shopmoney = this.data.priceTotal
    var datacar = this.data.carList
    var total = this.data.shopingNum
    total++
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index

    var carlist = this.data.carList
    shopmoney += Number(searchlist[index].price)
    console.log(id)
    for (var i = 0; i < carlist.length; i++) {
      if (carlist[i].id == id) {
        carlist[i].countcar++
      } else {
        if (carlist.map(item => item.id).indexOf(id) === -1) {
          carlist.push(this.data.searchlist[index])
        }
      }
    }
    console.log(this.data.carList)
    var array = this.data.pageData
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array[i].dish.length; j++) {
        if (array[i].dish[j].id == id) {
          array[i].dish[j].count = datacar[index].countcar
        }
      }
    }
    this.setData({
      priceTotal: shopmoney,
      pageData: array,
      carList: carlist,
      shopingNum: total
    })
  },
  add(e){
    console.log(this.data.carList)
    var countTotal = 0;
    var price = 0;
    var index = e.currentTarget.dataset.index;
    var idx = e.currentTarget.dataset.idx;
    var num = e.currentTarget.dataset.num;
    var data = this.data.pageData;
    var arr=this.data.arr;
    
    if (data[index].dish[idx].countcar >= num) {
      data[index].dish[idx].countcar = num;
    }
    else {
      data[index].dish[idx].countcar++;
    }
    this.data.pageData.map(item => {
      item.dish.map(self => {
        countTotal += self.countcar
        price += Number(self.countcar) * Number(self.price);
      })
    })
    this.setData({
      isShownum:true,
      shopingNum: countTotal,
      pageData: data,
      priceTotal: price
    })
    if (arr.length===0){
      data[index].dish[idx].count++;
      arr.push(data[index].dish[idx]);
    }
    else{
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === e.currentTarget.dataset.id){
          arr[i].count++;
        }
        else {
          if (arr.map(item=>item.id).indexOf(e.currentTarget.dataset.id)===-1){
            arr.push(data[index].dish[idx]);
          }
        }
      }
    }
    this.data.arr=arr;
    
    
    var moneyTotal=0
    for(var i=0;i<data.length;i++){
      for (var j = 0; j < data[i].dish.length; j++){
        moneyTotal += data[i].dish[j].count * data[i].dish[j].price
      }
    }
    this.setData({
      carList: arr,
   
    })
    console.log(moneyTotal)
  },
  reduce(e) {
    var datacar = this.data.carList
    var arr = this.data.arr;
    var countTotal = 0
    var price = 0;
    var obj = {};
    var index = e.currentTarget.dataset.index;
    var idx = e.currentTarget.dataset.idx;
    var id = e.currentTarget.dataset.id;
    var data = this.data.pageData;
    console.log(id)
    // if (data[index].dish[idx].countcar >= num) {
    //   data[index].dish[idx].countcar = num;
    // }
    // else {
    //   data[index].dish[idx].countcar++;
    // }
    if (this.data.shopingNum>0){
     
      if (data[index].dish[idx].countcar <= 0) {
        data[index].dish[idx].countcar = 0;
      }
      else {
        if (data[index].dish[idx].countcar > 0) {
          data[index].dish[idx].countcar--;
        } else if (data[index].dish[idx].countcar == 0) {
          data[index].dish[idx].countcar = 0
        }
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === e.currentTarget.dataset.id) {
          if (arr[i].count > 0) {
            arr[i].count--;
          } else if (arr[i].count == 0) {
            arr[i].count = 0
          }
        }
      }
      // for (var i = 0; i < data.length;i++){
      //   for (let j = 0; j < data[i].dish.length; j++) {
      //     if (data[i].dish[j].id === e.currentTarget.dataset.id) {
      //       if (data[i].dish[j].count > 0) {
      //         countTotal = this.data.shopingNum - 1
      //       } else{
      //         countTotal = this.data.shopingNum
      //       }
      //     }
      //   }
      // }
      this.data.pageData.map(item => {
        console.log(this.data.pageData)
        item.dish.map((self,i) => {
           countTotal = this.data.shopingNum-1
          price += Number(self.count) * Number(self.price)
        })
      })
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].count == 0) {
          arr.splice(i, 1)
        }
      }
      this.setData({
        carList: arr,
        shopingNum: countTotal,
        pageData: data,
        priceTotal: price
      })
    }
    
  },
  checkMeal(e){
    // console.log(e)
    var that = this
    that.setData({
      currentIndex: e.currentTarget.dataset.index
    })
  },
  comfirmOrder(){//确认订单
    var cardata = this.data.carList
    var fit_id = wx.getStorageSync('shop_id')
    var list = []
    
    console.log(cardata)
    if (cardata!=[]){
      cardata.map((item,i)=>{
        var obj = {}
        obj.dish_id = item.id
        obj.dish_num = item.count
        obj.dish_name = item.name
        obj.dish_price = item.price
        list.push(obj)
      })
    }

    list = JSON.stringify(list)
    console.log(list)
    wx.navigateTo({
      url: '../addMealconfirm/addMealconfirm?order_id=' + this.data.order_id + '&&list=' + list,
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var fit_id = wx.getStorageSync('shop_id')
    this.getIndexdata(fit_id)
    this.setData({
      order_id:options.order_id
    })
    console.log(options.order_id)
  },
  
  getIndexdata(fit_id){
    var url = config.domainCXB + '/addDish_list',
      data = {
        fit_id: fit_id,
      },
      that = this
    app.ajaxData(url, data, 'post', function (res) {
      if(res.data.code == 200){
        for(let i=0;i<res.data.data.length;i++){
          const item=res.data.data[i];
          for(let j=0;j<item.dish.length;j++){
            item.dish[j].count=0;
            item.dish[j].countcar = 0;
          }
        }
        that.setData({
          pageData:res.data.data
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