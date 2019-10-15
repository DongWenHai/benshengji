const app = getApp();
const request = require('../../utils/request.js');
const pay = require('../../utils/pay.js');
const publicFn = require('../../utils/public.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabIndex: 0,
    navList: [{
      name: "全部",
      id: "0"
    }, {
      name: "待付款",
      id: "1"
    }, {
      name: "待发货",
      id: "2"
    }, {
      name: "待收货",
      id: "3"
    }, {
      name: "待评价",
      id: "4"
    }],
    contentList: [[], [], [], [], []],
    loadMore: [true, true, true, true, true],
    showLogistics:false,
    logistics:null
  },
  $data: {
    orderNo: "",
    pageList: [1, 1, 1, 1, 1],
    isfirstLoad: [false, false, false, false, false]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.currentIndex) {
      this.setData({
        currentTabIndex: options.currentIndex * 1
      })
    }
    this.getCurrentList();
  },
  requestData(status){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    request.post({
      data: {
        request: 'private.order.gvh.orders.list',
        status: status,
        curpage: this.$data.pageList[this.data.currentTabIndex]
      },
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.code == 0) {
          var orderList = res.order_list;
          orderList.forEach((v, i) => {
            v.pay_money = Number(v.pay_money/100);
            v.imgs.forEach((item,index) => {
              item.product_price = item.product_price/100;
            })
          })
          var contentListItem = 'contentList[' + this.data.currentTabIndex + ']';
          var loadMoreItem = 'loadMore[' + this.data.currentTabIndex + ']';
          if (this.$data.pageList[this.data.currentTabIndex] === 1) {
            this.setData({
              [contentListItem]: orderList
            })
            this.$data.pageList[this.data.currentTabIndex] += 1;
            this.$data.isfirstLoad[this.data.currentTabIndex] = true;
          } else {
            this.setData({
              [contentListItem]: this.data.contentList[this.data.currentTabIndex].concat(orderList)
            })
            this.$data.pageList[this.data.currentTabIndex] += 1;
          }

          if (res.order_list.length < res.page_size) {
            this.setData({
              [loadMoreItem]: false
            })
          }

        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    }, true)
  },
  getCurrentList: function () {
    switch (this.data.currentTabIndex) {
      case 0:
        return this.requestData('');

      case 1:
        return this.requestData(1);

      case 2:
        return this.requestData(3);

      case 3:
        return this.requestData(4);

      case 4:
        return this.requestData(5);
    }
  },
  tabIndexChange: function (t) {
    this.setData({
      currentTabIndex: t.detail
    })
    if (this.$data.pageList[this.data.currentTabIndex] == 1) {
      this.getCurrentList();
    }
  },
  reload(){
    this.$data.pageList = [1, 1, 1, 1, 1];
    this.$data.isfirstLoad = [false, false, false, false, false];
    this.setData({
      loadMore: [true, true, true, true, true]
    })
    this.getCurrentList();
  },
  //继续支付
  orderPay(e){
    
    var orderid = e.currentTarget.dataset.orderid;
    pay.wxpay(orderid).then((res)=> {
        wx.showToast({
          title: '支付成功',
          icon:'success'
        })
        this.reload();
    }).catch((err) => {
      if (err && err.errMsg == "requestPayment:fail cancel") {
        wx.showToast({
          title: '用户取消支付',
          icon:'none'
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
  orderCancle(e){
    var index = this.data.currentTabIndex;
    var pIndex = e.currentTarget.dataset.index;
    var orderid = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '确认提醒',
      content: '真的要取消该订单吗?',
      success: res => {
        if(res.confirm){
          request.post({
            data: {
              request: 'private.order.gvh.cancel',
              orderid: orderid
            },
            success: res => {
              if(res.code == 0){
                wx.showToast({
                  title: '取消订单成功',
                  icon:'success'
                })
                if (index==0){
                  this.setData({
                    ["contentList[" + index + "][" + pIndex + "].order_status"]: 0
                  })
                }else{
                  this.reload();
                }
                
              }else{
                wx.showToast({
                  title: res.msg || '取消订单失败',
                  icon:'none'
                })
              }
            }
          }, true)
        }
      }
    })
    
  },
  //删除订单
  orderDel(e){
    var index = this.data.currentTabIndex;
    var pIndex = e.currentTarget.dataset.index;
    var orderid = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '删除提醒',
      content: '确认删除该订单吗?',
      success: res => {
        if(res.confirm){
          publicFn.deleteOrder(orderid).then(() => {
            wx.showToast({
              title: '删除成功',
              icon:'none',
              duration:1500
            })
            setTimeout(() => {
              this.reload();
            },1500)
          })
        }
      }
    })
  },
  //确认收货
  orderAccept(e){
    wx.showModal({
      title: '收货确认',
      content: '是否确认收货?',
      success: ret => {
        if(ret.confirm){
          request.post({
            data:{
              request:'private.order.confirm.goods',
              orderId:e.currentTarget.dataset.orderid
            },
            success: res => {
              if(res.code == 0){
                wx.showToast({
                  title: res.msg || '收货成功',
                  icon:'none',
                  duration:1500,
                  mask:true
                })
                setTimeout(() => {
                  this.reload();
                },1500)
              }else{
                wx.showToast({
                  title: res.msg || '收货失败,请重试',
                  icon:'none'
                })
              }
            }
          },true)
        }
      }
    })
  },
  //退款申请
  orderRefund(e){
    var products = e.currentTarget.dataset.products;
    var orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/order/refund?orderid=' + orderid + '&products=' + JSON.stringify(products)
    })
  },
  viewLogistics(e){
    var orderid = e.currentTarget.dataset.orderid;
    publicFn.viewLogistics(orderid).then((res) => {
      this.setData({
        logistics:res.data,
        showLogistics:true
      })
    })
  },
  closeLogistics(){
    this.setData({
      showLogistics:false
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
    if (app.globalData.hasEditOrder) {
      app.globalData.hasEditOrder = false;
      this.$data.pageList = [1, 1, 1, 1, 1];
      this.$data.isfirstLoad = [false, false, false, false, false];
      this.setData({
        loadMore: [true, true, true, true, true]
      })
      this.getCurrentList();
    }
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
    this.$data.pageList = [1, 1, 1, 1, 1];
    this.$data.isfirstLoad = [false, false, false, false, false];
    this.setData({
      loadMore: [true, true, true, true, true]
    })
    this.getCurrentList();
  },
  bottomReached() {
    if (this.data.loadMore[this.data.currentTabIndex]) {
      this.getCurrentList();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})