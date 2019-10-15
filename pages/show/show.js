const app = getApp();
var appLoadMixin = require('../../mixin/appLoadMixin.js');
const request = require('../../utils/request.js');
Page(getApp().initMixin({
  mixins: [appLoadMixin.default],
  /**
   * 页面的初始数据
   */
  data: {
    curpage:1,
    allLoaded:false,
    loading:false,
    shows:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShowData();
  },

  getShowData(){
    if(this.data.loading){return;}
    this.setData({
      loading:true
    })
    wx.showNavigationBarLoading();
    request.post({
      data:{
        request:'private.buyersShow.buyers_show',
        curpage:this.data.curpage
      },
      success: res => {
        wx.hideNavigationBarLoading();
        this.setData({
          loading:false
        })
        if(res.code == 0){
          if(this.data.curpage == 1){
            this.setData({
              shows:res.data.data,
              curpage:this.data.curpage + 1
            })
          }else{
            this.setData({
              shows: this.data.shows.concat(res.data.data),
              curpage: this.data.curpage + 1
            })
          }
          if(res.data.data.length < res.data.page_size){
            this.setData({
              allLoaded:true
            })
          }
        }else{
          wx.showToast({
            title: res.msg || '数据加载失败',
            icon:'none'
          })
        }
      }
    },true)
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
    if(!this.data.allLoaded){
      this.getShowData();
    }
  }
}))