const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    wx:'',
    phone:'',
    level:''
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
        request:'private.find.dealers_admin'
      },
      success: res => {
        wx.hideLoading();
        if(res.code == 0 && res.dealers=='1'){
          this.setData({
            name: res.data.dealers_name,
            wx: res.data.wx_number,
            phone: res.data.phone,
            level: res.data.leave
          })
        }
      }
    },true)
  }
})