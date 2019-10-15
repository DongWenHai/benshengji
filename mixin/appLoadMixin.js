exports.default = {
  data:{
    needAuth: wx.getStorageSync('needAuth'),//是否授权过
  },
  watchGlobalData: {
    needAuth: function (a) {
      this.setData({
        needAuth: a
      });
    }
  },
  onUnload: function () {
    getApp().deleteWatch(this);
  }
}