const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parters:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrentList();
  },
  getCurrentList(){
    wx.showLoading({
      title: '加载中'
    })
    request.post({
      data:{
        request:'private.find.career_partner'
      },
      success: res => {
        wx/wx.hideLoading();
        if(res.code == 0){
          this.setData({
            parters:res.data
          })
        }else{
          wx.showToast({
            title: res.msg || '数据加载失败',
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

  }
})