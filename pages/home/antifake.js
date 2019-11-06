const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
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
    if(this.data.code==''){
      return wx.showToast({
        title: '请输入防伪码',
        icon:'none'
      })
    }
    wx.showLoading({
      title: '正在查询',
      mask:true
    })
    request.post({
      data:{
        request:'private.find.anti_fake_find',
        security_code:this.data.code
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
  setCode(e){
    this.setData({
      code:e.detail.value
    })
  }
})