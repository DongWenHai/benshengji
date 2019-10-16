// pages/member/member.js
const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    request.post({
      data: {
        request: 'private.user.point_home'
      },
      success: res => {
        wx.hideLoading();
        console.log(res)
        if (res.code == 0) {
          this.setData({
            member: [{
              "wxxcx_id": "307",//微信ID
              "nickName": "伞兵卢本伟二号准备就绪",//微信昵称
              "vipLevel": "1",//会员等级
              "vip_name": "美丽天使"//等级名称
            }, {
                "wxxcx_id": "307",//微信ID
                "nickName": "伞兵卢本伟二号准备就绪",//微信昵称
                "vipLevel": "1",//会员等级
                "vip_name": "美丽天使"//等级名称
              }, {
                "wxxcx_id": "307",//微信ID
                "nickName": "伞兵卢本伟二号准备就绪",//微信昵称
                "vipLevel": "1",//会员等级
                "vip_name": "美丽天使"//等级名称
              }, {
                "wxxcx_id": "307",//微信ID
                "nickName": "伞兵卢本伟二号准备就绪",//微信昵称
                "vipLevel": "1",//会员等级
                "vip_name": "美丽天使"//等级名称
              }, {
                "wxxcx_id": "307",//微信ID
                "nickName": "伞兵卢本伟二号准备就绪",//微信昵称
                "vipLevel": "1",//会员等级
                "vip_name": "美丽天使"//等级名称
              }, {
                "wxxcx_id": "307",//微信ID
                "nickName": "伞兵卢本伟二号准备就绪",//微信昵称
                "vipLevel": "1",//会员等级
                "vip_name": "美丽天使"//等级名称
              }],
          })
        } else {
          wx.showToast({
            title: res.msg || '获取数据失败，请重试',
            icon: 'none'
          })
        }
      }
    }, true)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})