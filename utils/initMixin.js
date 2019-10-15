function r(r) {
  if (Array.isArray(r)) {
    for (var n = 0, t = Array(r.length); n < r.length; n++) t[n] = r[n];
    return t;
  }
  return Array.from(r);
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var n = function (r) {
  return Array.isArray(r);
}, t = function (r) {
  return "function" == typeof r;
}, e = function (r) {
  return r instanceof Object;
};

exports.default = function (a) {
  var i = getApp().globalData.mixins;
  if (a.mixins && (i = i.concat(a.mixins)), 0 === i.length) return a;
  for (var o = a, u = 0; u < i.length; u++) {
    var f = i[u];
    for (var c in f) {
      var s = c, l = f[c];
      n(o[s]) && n(l) ? o[s] = [].concat(r(o[s]), r(l)) : t(o[s]) || (e(o[s]) && e(l) ? o[s] = Object.assign({}, o[s], l) : o[s] = l);
    }
  }
  return o;
};