//index.js
//获取应用实例
const app = getApp();
var appLoadMixin = require('../../mixin/appLoadMixin.js');
const request = require('../../utils/request.js');

Page(getApp().initMixin({
  mixins: [appLoadMixin.default],
  data: {
    banner_top: [],
    banner_middle: [],
    banner_bottom:[],
    coupons:[],
    products1: [],
    products2:[],
    catArr:[],
    keywords:'',//搜索关键词
    placeholder:'抢私人定制套装',
    loadsuccess:false,
    pulldownFresh:false
  },
  onLoad: function () {
    this.initData();
  },
  //初始化数据
  initData(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    request.post({
      data:{
        request:'private.weixin.get_home_data'
      },
      success: res => {
        wx.hideLoading();
        if (this.data.pulldownFresh){
          this.setData({
            pulldownFresh:false
          })
        }
        if(res.code == 0){
          this.setData({
            banner_top: res.top_banner,
            banner_middle: res.mid_banner,
            banner_bottom: res.down_banner,
            coupons: res.comm_coupon_list,
            catArr: res.category,
            products1: res.product_list[0].product_list,
            products2: res.product_list[1].product_list,
            loadsuccess:true
          })
        }else{
          wx.showToast({
            title: res.msg || '获取数据失败，请重试',
            icon:'none'
          })
          this.setData({
            loadsuccess: false
          })
        }
      }
    },true)
  },
  setKeywords(e){
    this.setData({
      keywords:e.detail.value
    })
  },
  search(){
    app.globalData.product_keywords = (this.data.keywords ? this.data.keywords : this.data.placeholder);
    wx.switchTab({
      url: '/pages/product/product'
    })
  },
  navigateToProduct(e){
    if(e.currentTarget.dataset.type == '0'){
      app.globalData.product_cid = e.currentTarget.dataset.cid;
      wx.switchTab({
        url: '/pages/product/product'
      })
    }
  },
  onPullDownRefresh(){
    this.setData({
      pulldownFresh:true
    })
    this.initData();
  }
}))
