exports.rpx2px = function (t) {
  return t * wx.getSystemInfoSync().screenWidth / 750;
};