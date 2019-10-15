const request = require('./request.js');
exports.default = {
  //用户授权
  auth(){
    return new Promise((resolve) => {
      request.post({
        data: {
          request: 'public.weixin.get_token'
        },
        success: res => {
          resolve(res)
        }
      })
    })
  },
  //获取用户信息
  getUserInfo(){
    return new Promise((resolve) => {
      request.post({
        data: {
          request: 'private.user.home'
        },
        success: res => {
          resolve(res)
        }
      }, true)
    })
  },
  //获取商品详情
  getProductDetail(pid){
    return new Promise((resolve) => {
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      request.post({
        data: {
          request: 'private.auction.gvh_goods_info',
          product_id:pid
        },
        success: res => {
          wx.hideLoading();
          resolve(res)
        }
      }, true)
    })
  }
}