const app = getApp();
const request = require('../../utils/request.js');
const pay = require('../../utils/pay.js');
const publicFn = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{},
    products:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderDetail(options.orderid);
  },
  getOrderDetail(orderid){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    request.post({
      data:{
        request:'private.order.gvh_order_detail',
        orderid:orderid
      },
      success: res => {
        wx.hideLoading();
        if(res.code == 0){
          res.order.total_money = res.order.total_money / 100;
          res.order.vipCouponMoney = res.order.vipCouponMoney/100;
          res.order.platform_real_get_total_money = res.order.platform_real_get_total_money/100;
          res.order.privilege_gold = res.order.privilege_gold/100;
          res.order.second_two_money_activity = res.order.second_two_money_activity/100;
          res.order.ship_fee = res.order.ship_fee/100;
          res.product_list.forEach((v,i) => {
            v.product_price = v.product_price/100;
          })
          this.setData({
            order:res.order,
            products: res.product_list
          })
        }else{
          wx.showToast({
            title: res.msg || '数据加载失败',
            icon:'none',
            duration:1500
          })
          setTimeout(() => {
            wx.navigateBack({
              delta:1
            })
          },1500)
        }
      }
    },true)
  },
  //继续支付
  orderPay(e) {

    var orderid = e.currentTarget.dataset.orderid;
    pay.wxpay(orderid).then((res) => {
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      })
      wx.redirectTo({
        url: '/pages/payResult/payResult?status=success&orderid=' + orderid
      })
    }).catch((err) => {
      if (err && err.errMsg == "requestPayment:fail cancel") {
        wx.showToast({
          title: '用户取消支付',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '支付超时，请稍后重试',
          icon: 'none'
        })
      }
    })
  },
  //取消订单
  orderCancle(e) {
    var orderid = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '确认提醒',
      content: '真的要取消该订单吗?',
      success: res => {
        if (res.confirm) {
          request.post({
            data: {
              request: 'private.order.bsj_cancel',
              orderid: orderid
            },
            success: res => {
              if (res.code == 0) {
                wx.showToast({
                  title: '取消订单成功',
                  icon: 'success'
                })
                this.setData({
                  "order.order_status":'0'
                })
              } else {
                wx.showToast({
                  title: res.msg || '取消订单失败',
                  icon: 'none'
                })
              }
            }
          }, true)
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

  }
})