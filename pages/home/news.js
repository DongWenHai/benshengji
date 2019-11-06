const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews();
  },
  getNews(){
    wx.showLoading({
      title: '加载中'
    })
    request.post({
      data:{
        request:'private.find.new_home'
      },
      success: res => {
        wx.hideLoading();
        if(res.code == 0){
          this.setData({
            news:res.data
          })
        }else{
          wx.showToast({
            title: res.msg || '加载失败，请重试',
            icon:'none'
          })
        }
      }
    },true)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})