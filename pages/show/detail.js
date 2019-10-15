const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id);
  },
  getData(id){
    request.post({
      data:{
        request:'private.buyersShow.buyers_show_single_evaluate',
        id:id
      },
      success: res => {
        if(res.code == 0){
          res.data.product_price = (res.data.product_price/100).toFixed(2);
          this.setData({
            showData:res.data
          })
        }else{
          wx.showToast({
            title: res.msg || '获取信息失败，请稍后重试',
            icon:'none'
          })
        }
      }
    },true)
  }
})