// pages/proDes/proDes.js
var WxParse = require('../../wxParse/wxParse.js');
const request = require('../../utils/request.js');
const publicFn = require('../../utils/public.js');
const commonFn = require('../../utils/commonFn.js');
var appLoadMixin = require('../../mixin/appLoadMixin.js');
const app = getApp();
Page(getApp().initMixin({
  mixins: [appLoadMixin.default],
  /**
   * 页面的初始数据
   */
  data: {
    pid:'',
    product:{},
    loadsuccess:0,//商品数据加载状态
    swiperCurrent:0,//产品banner活动下标
    showShop:false,//购买面板
    count:1,//已选数量
    banner:[],
    cart_num:0,//购物车数量
    reqMsg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pid:options.pid
    })
    this.getProductData(options.pid);
  },
  getProductData(pid){
    commonFn.default.getProductDetail(pid).then((res) => {
      if(res.code == 0){
        res.good_list.data.product_fake_price = (res.good_list.data.product_fake_price / 100).toFixed(2);
        res.good_list.data.product_fake_price_arr = res.good_list.data.product_fake_price.split('.');
        res.good_list.data.product_price = (res.good_list.data.product_price / 100).toFixed(2);
        res.good_list.data.product_price_arr = res.good_list.data.product_price.split('.');
        wx.setNavigationBarTitle({
          title: res.good_list.data.product_name,
        })
        this.setData({
          loadsuccess: 1,
          product: res.good_list.data,
          banner:res.banner || [],
          cart_num:res.cart.total
        })
        publicFn.setCartNumber(3, res.cart.total || 0);
        WxParse.wxParse("article", "html", res.good_list.data.product_content, this, 0, app.globalData.systemInfo);
      }else{
        this.setData({
          reqMsg: res.msg || '获取产品信息失败',
          loadsuccess:2
        })
      }
    })
  },
  swiperChange(e){
    this.setData({
      swiperCurrent:e.detail.current
    })
  },
  showShopEvt(){
    this.setData({
      showShop: true
    })
  },
  closeShop(e){
    if (e.detail.type == 'add'){
      this.setData({
        showShop: false,
        count: e.detail.count,
        cart_num: e.detail.num
      })
      publicFn.setCartNumber(3, e.detail.num || 0);
    }else{
      this.setData({
        showShop: false,
        count: e.detail.count
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}))