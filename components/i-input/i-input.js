function t(t, a) {
  var e = void 0, n = void 0, i = void 0;
  try {
    e = t.toString().split(".")[1].length;
  } catch (t) {
    e = 0;
  }
  try {
    n = a.toString().split(".")[1].length;
  } catch (t) {
    n = 0;
  }
  return i = Math.pow(10, Math.max(e, n)), (Math.round(t * i) + Math.round(a * i)) / i;
}

Component({
  externalClasses: ["i-class"],
  properties: {
    size: String,
    value: {
      type: Number,
      value: 1
    },
    min: {
      type: Number,
      value: -1 / 0
    },
    max: {
      type: Number,
      value: 1 / 0
    },
    step: {
      type: Number,
      value: 1
    },
    reduceImage: {
      type: String,
      value: "/images/icon-reduce.png"
    },
    addImage: {
      type: String,
      value: "/images/icon-plus.png"
    }
  },
  data: {
    canChange: true
  },
  methods: {
    handleChangeStep: function (e, type, bool) {
      var dataset = e.currentTarget.dataset, can = (void 0 === dataset ? {} : dataset).disabled, h = this.data.step, s = this.data.value;
      if (can) return null;
      if ("minus" === type) {
        s = t(s, -h)
      } else if ("plus" === type) {
        s = t(s, h)
      }
      this.handleEmit(s, type, bool);
    },
    handleMinus: function (e) {
      this.data.canChange && this.handleChangeStep(e, "minus", true);
    },
    handlePlus: function (e) {
      this.data.canChange && this.handleChangeStep(e, "plus", true);
    },
    handleFocus: function () {
      this.data.canChange = false, this.triggerEvent("focus");
    },
    getType: function (num) {
      return num > this.data.value ? "plus" : num < this.data.value ? "minus" : "";
    },
    handleBlur: function (e) {
      var that = this;
      this.data.canChange = true;
      var value = e.detail.value, type = "", data = this.data, min = data.min, max = data.max;
      if ("" === value && (value = 1), !(value *= 1)) return value = 0 === value ? min : 1, void setTimeout(function () {
        type = that.getType(value), that.handleEmit(value, type, that.data.value !== value);
      }, 16);
      (value = +value) > max ? value = max : value < min ? value = min : value || (value = min), type = this.getType(value);
      var bool = this.data.value !== value;
      this.handleEmit(value, type, bool);
    },
    handleEmit: function (t, a, e) {
      var n = {
        value: t,
        type: a
      };
      a && (n.type = a), e ? this.triggerEvent("change", n) : (this.setData({
        value: t
      }), this.triggerEvent("change"));
    }
  }
});
