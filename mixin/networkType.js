exports.default = {
  data: {
    offLine: !1
  },
  watchGlobalData: {
    offLine: function (e) {
      this.setData({
        offLine: e
      });
    }
  },
  onUnload: function () {
    getApp().deleteWatch(this);
  }
};