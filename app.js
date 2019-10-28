var page = Object.assign || function (t) {
  for (var a = 1; a < arguments.length; a++) {
    var argument = arguments[a];
    for (var o in argument) Object.prototype.hasOwnProperty.call(argument, o) && (t[o] = argument[o]);
  }
  return t;
}, initMixin = require('./utils/initMixin.js'), networkType = require('./mixin/networkType.js');
const version = require('./utils/version.js');

App({
  onLaunch: function () {
    version.updateVersion();
    this.globalData.systemInfo = wx.getSystemInfoSync();
  },
  initMixin: function (t) {
    var pageObj = (0, initMixin.default)(t), o = this;
    return page({}, pageObj);
  },
  watchGlobalData: function (t) {
    var a = this, o = t.watchGlobalData, i = {};
    Object.keys(o).forEach(function (n) {
      var l = o[n].handler || o[n];
      i[n] = a.globalData[n]/*, (0, e.default)(a, "globalData", n, l.bind(t))*/;
    }), t.setData(i);
  },
  deleteWatch: function (t) {
    var a = this, e = t.watchGlobalData;
    Object.keys(e).forEach(function (t) {
      Object.defineProperty(a.globalData, t, {
        writable: !0,
        enumerable: !0,
        configurable: !0,
        value: a.globalData[t]
      });
    });
  },
  globalData: {
    mixins: [networkType.default],
    userInfo: null,//用户信息
    needAuth:false,//是否需要授权
    systemInfo:'',
    product_keywords:'',
    product_cid:''
  },
  onPageNotFound(res) {
    wx.redirectTo({
      url: '/pages/errpage/errpage'
    }) // 如果是 tabbar 页面，请使用 wx.switchTab
  }
})