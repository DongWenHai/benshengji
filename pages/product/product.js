const app = getApp();
var appLoadMixin = require('../../mixin/appLoadMixin.js');
const request = require('../../utils/request.js');
const commonFn = require('../../utils/commonFn.js');
const publicFn = require('../../utils/public.js');
Page(getApp().initMixin({
  mixins: [appLoadMixin.default],
  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    showShop:false,//显示购买面板
    curpage:1,//商品分页
    allLoaded:false,//商品数据加载完成
    loading:false,//加载状态
    products:[],//产品数据
    keyword:'',//搜索关键词
    sale_sort: '',//销量DESC倒序，ASC正序
    money_sort: '',//价格DESC倒序，ASC正序
    s_money:'',//最低价格
    e_money:'',//最高价格
    category_id:'',
    showCat:false,//显示分类面板
    showScreen:false,//显示筛选面板
    productShop:{},//购买商品信息
  },

  setCondition: function (e) {
    var n = e.currentTarget.dataset.num;
    switch(n){
      case '1':
        if(this.data.num != n){
          this.setData({
            curpage: 1,//商品分页
            allLoaded: false,//商品数据加载完成
            loading: false,//加载状态
            sale_sort: '',//销量DESC倒序，ASC正序
            money_sort: '',//价格DESC倒序，ASC正序
            num:n
          })
          this.getProducts();
        }
      break;
      case '2':
        if (this.data.num != n) {
          this.setData({
            curpage: 1,//商品分页
            allLoaded: false,//商品数据加载完成
            loading: false,//加载状态
            sale_sort: 'DESC',//销量DESC倒序，ASC正序
            money_sort: '',//价格DESC倒序，ASC正序
            num: n
          })
          this.getProducts();
        }
      break;
      case '3':
        this.setData({
          curpage: 1,//商品分页
          allLoaded: false,//商品数据加载完成
          loading: false,//加载状态
          sale_sort: '',//销量DESC倒序，ASC正序
          money_sort: (this.data.money_sort == 'DESC' || this.data.money_sort == '') ? 'ASC' :'DESC',//价格DESC倒序，ASC正序
          num: n
        })
        this.getProducts();
      break;
      case '4':
        this.showScreenEvt();
      break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      keyword: options.keyword || ''
    })
    this.getProducts();
  },
  showShopEvt(e){
    var pid = e.currentTarget.dataset.pid;
    commonFn.default.getProductDetail(pid).then((res) => {
      if(res.code == 0){
        res.good_list.data.product_fake_price = (res.good_list.data.product_fake_price / 100).toFixed(2);
        res.good_list.data.product_price = (res.good_list.data.product_price/100).toFixed(2);
        this.setData({
          showShop: true,
          productShop: res.good_list.data
        })
      }else{
        wx.showToast({
          title: res.msg || '获取商品信息失败',
          icon:'none'
        })
      }
    })
  },
  closeShop(){
    this.setData({
      showShop: false
    })
  },
  setKeyword(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  //获取商品列表
  getProducts(){
    if(this.data.loading){return;}
    this.setData({
      loading:true
    })
    if(this.data.curpage == 1){
      wx.showLoading({
        title: '加载中',
        mask:true
      })
    }
    request.post({
      data:{
        request:'private.auction.gvh_goods_list',
        category_id: this.data.category_id,
        keyword: this.data.keyword,
        sale_sort: this.data.sale_sort,
        money_sort: this.data.money_sort,
        s_money: this.data.s_money,
        e_money: this.data.e_money,
        curpage:this.data.curpage
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          loading:false
        })
        if(res.code == 0){
          var productsData = res.goods_list.data;
          productsData.forEach((v) => {
            v.product_fake_price = (v.product_fake_price / 100).toFixed(2);
            v.product_price = (v.product_price/100).toFixed(2);
          })
          if(res.cart.total != null && Number(res.cart.total)>0)publicFn.setCartNumber(3, res.cart.total);
          if(this.data.curpage == 1){
            this.setData({
              products: productsData,
              curpage:this.data.curpage + 1
            })
          }else{
            this.setData({
              products: this.data.products.concat(productsData),
              curpage: this.data.curpage + 1
            })
          }
          if (res.goods_list.data.length < res.goods_list.page_size){
            this.setData({
              allLoaded:true
            })
          }
        }else{
          wx.showToast({
            title: res.msg || '数据加载失败,请稍后重试',
            icon:'none'
          })
        }
      }
    },true)
  },
  //显示分类
  showCatCard(){
    this.setData({
      showCat:true
    })
  },
  hideCat(){
    this.setData({
      showCat: false
    })
  },
  // 设置分类
  setCatId(e){
    console.log(e)
    this.setData({
      curpage: 1,//商品分页
      allLoaded: false,//商品数据加载完成
      loading: false,//加载状态
      category_id:e.detail
    })
    this.getProducts();
  },
  //搜索
  searchByKeyword(){
    this.setData({
      num: 1,
      curpage: 1,//商品分页
      allLoaded: false,//商品数据加载完成
      loading: false,//加载状态
      sale_sort: '',//销量DESC倒序，ASC正序
      money_sort: '',//价格DESC倒序，ASC正序
      s_money: '',//最低价格
      e_money: '',//最高价格
      category_id:''
    })
    this.getProducts();
  },
  showScreenEvt(){
    this.setData({
      showScreen:true
    })
  },
  hideScreen(){
    this.setData({
      showScreen: false
    })
  },
  //筛选
  setPriceScreen(e){
    this.setData({
      curpage: 1,//商品分页
      allLoaded: false,//商品数据加载完成
      loading: false,//加载状态
      s_money: e.detail.s_money,//最低价格
      e_money: e.detail.e_money//最高价格
    })
    this.getProducts();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.allLoaded){
      this.getProducts();
    }
  }
}))