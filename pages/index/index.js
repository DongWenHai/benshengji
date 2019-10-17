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
    keywords:'',//搜索关键词
    placeholder:'抢私人定制套装',
    loadsuccess:false
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
        if(res.code == 0){
          this.setData({
            banner_top: res.top_banner,
            banner_middle: res.mid_banner,
            banner_bottom: res.down_banner,
            coupons: res.comm_coupon_list,
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
    wx.navigateTo({
      url: '/pages/product/product?keyword=' + this.data.keywords ? this.data.keywords : this.data.placeholder
    })
  }
}))
