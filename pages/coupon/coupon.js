const request= require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curpage:1,
    allLoaded:false,
    coupons:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCoupons();
  },
  getCoupons(){
    wx.showNavigationBarLoading();
    request.post({
      data:{
        request:'private.coupon.get_coupon'
      },
      success: res => {
        wx.hideNavigationBarLoading();
        if(res.code == 0){
          res.data.forEach((v) => {
            v.coupon_money = parseFloat(v.coupon_money / 100);
            v.min_money = parseFloat(v.min_money/100);
          })
          if(this.data.curpage === 1){
            this.setData({
              coupons:res.data,
              curpage:this.data.curpage + 1
            })
          }else{
            this.setData({
              coupons: this.data.coupons.concat(res.data),
              curpage: this.data.curpage + 1
            })
          }
          if(res.data.length < res.page_size){
            this.setData({
              allLoaded:true
            })
          }
        }else{
          wx.showToast({
            title: res.msg || '获取数据失败,请重试',
            icon:'none'
          })
        }
      }
    },true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.allLoaded){
      this.getCoupons();
    }
  }
})