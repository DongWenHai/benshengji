const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
  },
  initData(){
    wx.showLoading({
      title: '加载中'
    })
    request.post({
      data:{
        request:'private.find.quality_report'
      },
      success: res => {
        wx.hideLoading();
        if(res.code == 0){
          this.setData({
            imgs:res.data
          })
        }else{
          wx.showToast({
            title: res.msg || '加载失败，请重试',
            icon:'none'
          })
        }
      }
    },true)
  }
})