
const commonFn = require('../../utils/commonFn.js'), appLoadMixin = require('../../mixin/appLoadMixin.js');
var Token = require('../../utils/token.js'),tokenObj = new Token();
Page(getApp().initMixin({
  mixins: [appLoadMixin.default],
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(commonFn)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showNavigationBarLoading();
    commonFn.default.getUserInfo().then((res) => {
      wx.hideNavigationBarLoading();
      if (res.code == 0) {
        this.setData({
          userInfo: res.userInfo
        })
      } else {
        wx.showToast({
          title: res.msg || '获取用户信息异常，请重试',
          icon: 'none'
        })
      }
    }).catch((err) => {
      wx.hideNavigationBarLoading();
      console.log(err)
    })
  },
  getUserInfoAuth(e){
    console.log(e)
    if (e.detail.errMsg === "getUserInfo:ok"){
      tokenObj.updateToken(e.detail.userInfo).then(() => {
        this.setData({
          needAuth:false
        })
        commonFn.default.getUserInfo().then((res) => {
          if(res.code == 0){
            this.setData({
              userInfo:res.userInfo
            })
          }else{
            wx.showToast({
              title: res.msg || '获取用户信息异常，请重试',
              icon:'none'
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {})
    }
  }
}))