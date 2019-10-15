const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserData();
  },
  getUserData(){
    request.post({
      data:{
        request:'private.user.bsj_user_info'
      },
      success: res => {
        if(res.code == 0){
          this.setData({
            userData:res.data
          })
        }else{
          wx.showToast({
            title: res.msg || '加载数据失败，请重试',
            icon:'none'
          })
        }
      }
    },true)
  }
})