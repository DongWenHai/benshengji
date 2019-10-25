exports.default = {
  data:{
    needAuth: wx.getStorageSync('needAuth'),//是否授权过
  },
  watchGlobalData: {
    needAuth(a){
      console.log(this)
      this.setData({
        needAuth: a
      });
    }
  },
  onUnload: function () {
    getApp().deleteWatch(this);
  }
}