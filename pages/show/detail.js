const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showData:'',
    swiperCurrent:0,
    collected:false,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getData(options.id);
  },
  swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
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
            showData:res.data,
            collected: res.is_accept=='0'?true:false
          })
        }else{
          wx.showToast({
            title: res.msg || '获取信息失败，请稍后重试',
            icon:'none'
          })
        }
      }
    },true)
  },
  collect(){
    request.post({
      data:{
        request:'private.buyersShow.buyers_show_accept',
        buyers_show_id:this.data.id,
        status:this.data.collected?1:0
      },
      success: res => {
        if(res.code == 0){
          wx.showToast({
            title: this.data.collected?'取消收藏':'收藏成功',
            icon:'none'
          })
          this.setData({
            collected: !this.data.collected
          })
        }else{
          wx.showToast({
            title: '收藏失败',
            icon:'none'
          })
        }
      }
    },true)
  }
})