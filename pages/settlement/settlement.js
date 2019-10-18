const request = require('../../utils/request.js');
const publicFn = require('../../utils/public.js');
const commonFn = require('../../utils/commonFn.js');
var appLoadMixin = require('../../mixin/appLoadMixin.js');
const pay = require('../../utils/pay.js');
Page(getApp().initMixin({
  mixins: [appLoadMixin.default],
  /**
   * 页面的初始数据
   */
  data: {
    pid:false,
    count:1,
    products:[],//商品
    ship_fee:'0.00',//运费
    addressList: '', // 地址
    remark:'',//留言
    totalMoney:'0.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.pid){
      this.setData({
        pid:options.pid,
        count:options.count
      })
      this.getDataById(options.pid, options.count);
    }else{
      this.getDatafromCart();
    }
  },
  getDataById(pid,count){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    request.post({
      data:{
        request:'private.cart.gvh_now_buy',
        product_id:pid,
        count:count
      },
      success: res => {
        wx.hideLoading();
        if(res.code == 0){
          res.data.product_price = (res.data.product_price/100).toFixed(2);
          var addressDefault = res.address_list.constructor === Object ? res.address_list:'';
          this.setData({
            products: [res.data],
            ship_fee: (res.ship_fee/100).toFixed(2),
            addressList: addressDefault,
            totalMoney: (res.real_total/100).toFixed(2)
          })
        }else{
          wx.showToast({
            title: res.msg || '获取信息失败，请稍后重试',
            icon:'none'
          })
        }
      }
    },true)
  },
  getDatafromCart() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    request.post({
      data: {
        request: 'private.order.bsj_order_settlement',
        coupon_id:''
      },
      success: res => {
        wx.hideLoading();
        if (res.code == 0) {
          res.data.forEach((v) => {
           v.product_price = (v.product_price / 100).toFixed(2);
          })
          var addressDefault = res.address_list.constructor === Object ? res.address_list : '';
          this.setData({
            products: res.data,
            ship_fee: (res.ship_fee / 100).toFixed(2),
            addressList: addressDefault,
            totalMoney: (res.real_total / 100).toFixed(2)
          })
        } else {
          wx.showToast({
            title: res.msg || '获取信息失败，请稍后重试',
            icon: 'none'
          })
        }
      }
    }, true)
  },
  setRemark(e){
    this.setData({
      remark:e.detail.value
    })
  },
  //提交生成订单
  submitOrder(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (!this.data.addressList) {
      return wx.showToast({
        title: '请输入收货地址',
        icon: 'none'
      })
    }
    if (this.data.pid) {
      var data = {
        request: 'private.order.bsj_single_product_settlement',
        coupon_id: '',
        address_id: this.data.addressList.address_id,
        product_id: this.data.pid,
        ship_type: 1,
        liuyan:this.data.remark
      }
    } else {
      var data = {
        request: 'private.order.bsj_get_order',
        address_id: this.data.addressList.address_id,
        liuyan: this.data.remark,
        coupon_id: '',
        ship_type: 1
      }
    }
    request.post({
      data:data,
      success: res => {
        wx.hideLoading();
        if (res.code == 0) {
          // 微信支付
          var orderid = res.orderid;
          this.payEvent(orderid);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    },true)
  },
  payEvent(orderid){
    pay.wxpay(orderid).then((res) => {
        wx.redirectTo({
          url: '/pages/payResult/payResult?status=success&orderid=' + orderid
        })
    }).catch((err) => {
      if (err && err.errMsg == "requestPayment:fail cancel") {
        wx.redirectTo({
          url: '/pages/payResult/payResult?status=cancel&orderid=' + orderid
        })
      } else {
        wx.redirectTo({
          url: '/pages/payResult/payResult?status=err&orderid=' + orderid
        })
      }
    })
  }
}))