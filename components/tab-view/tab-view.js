var t = wx.createAnimation({
  duration: 200
});

Component({
  properties: {
    navList: {
      type: Array
    },
    currentTabIndex: {
      type: Number
    },
    fontcolor: {
      type: String
    },
    linecolor: {
      type: String
    }
  },
  options: {
    multipleSlots: !0
  },
  externalClasses: ["i-class"],
  data: {
    marginLeft: 1e3,
    windowHeight: 0,
    animationData: {},
    contenListMarginTop: 0,
    backgroundColor: ""
  },
  methods: {
    scrollToBottom: function () {
      this.triggerEvent("bottomReached");
    },
    tabClick: function (t) {
      this.swiperChange(t);
    },
    swiperChange: function (t) {
      var e = "tap" === t.type ? t.target.dataset.current : t.detail.current;
      this.properties.currentTabIndex !== e && (this.setData({
        currentTabIndex: e
      }), this.animationFn(), this.triggerEvent("swiperChange", e));
    },
    animationFn: function () {
      var e = this, n = 0, a = 0, i = this.data.currentTabIndex, r = wx.createSelectorQuery().in(this);
      r.selectAll(".nav-bar-item").boundingClientRect(), r.exec(function (r) {
        var o = r[0];
        n = o[i].left - o[e.data.lockIndex].left, a = o[i].width, t.translateX(n).width(a).step(),
          e.setData({
            animationData: t.export()
          });
      });
    }
  },
  ready: function () {
    var t = this, e = this.data.currentTabIndex, n = wx.createSelectorQuery().in(this);
    n.select(".nav-bar").boundingClientRect(), n.selectAll(".nav-bar-item").boundingClientRect(),
      n.exec(function (n) {
        var a = n[0].height, i = wx.getSystemInfoSync().windowHeight - a;
        t.setData({
          tabBarHeight: a,
          windowHeight: i,
          swiperHeight: 1900,
          contenListMarginTop: a + 10,
          marginLeft: n[1][e].left,
          lockIndex: e
        }), t.animationFn(), setTimeout(function () {
          t.setData({
            backgroundColor: t.data.fontcolor
          });
        }, 200);
      });
  }
});