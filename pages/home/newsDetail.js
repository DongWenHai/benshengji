var WxParse = require('../../wxParse/wxParse.js');
const request = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    time:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options.id);
  },
  getDetail(id){
    wx.showLoading({
      title: '加载中，请稍后'
    })
    request.post({
      data:{
        request:'private.find.new_home_detail',
        id:id
      },
      success: res => {
        wx.hideLoading();
        if(res.code == 0){
          this.setData({
            title:res.data.title,
            time:res.data.add_time
          })
          wx.setNavigationBarTitle({
            title: res.data.title
          })
          WxParse.wxParse("article", "html", res.data.content, this, 0, app.globalData.systemInfo);
        }else{
          wx.showToast({
            title: res.msg || '加载失败',
            icon:'none'
          })
        }
      }
    },true)
  }
})