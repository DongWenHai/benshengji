
const publicFn = {
  //设置购物车角标
  setCartNumber(index, txt) {
    if (Number(txt) > 0) {
      wx.setTabBarBadge({
        index: index,
        text: String(txt)
      })
    } else {
      wx.removeTabBarBadge({
        index: index
      })
    }
  }
};

module.exports = publicFn;