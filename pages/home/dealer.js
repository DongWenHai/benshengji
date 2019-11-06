const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords:'',
    data:'',
    loading:0,
    msg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  search(){
    wx.showLoading({
      title: '正在查询',
      mask:true
    })
    request.post({
      data:{
        request:'private.find.dealers_find',
        wx_number: this.keywords,
        phone: this.keywords
      },
      success: res => {
        wx.hideLoading();
        if(res.code == 0){
          this.setData({
            loading:1,
            data:res.data
          })
        }else{
          this.setData({
            loading:2,
            msg:res.msg || '查询失败'
          })
        }
      }
    },true)
  },
  setKeywords(e){
    this.setData({
      keywords:e.detail.value
    })
  },
  searchByKeywords(){
    if(this.data.keywords==''){
      return wx.showToast({
        title: '请输入手机号或微信号查询',
        icon:'none'
      })
    }
    this.search();
  }

})