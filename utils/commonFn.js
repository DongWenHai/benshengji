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
  //更新用户信息
  updateInfo(userInfo){
    return new Promise((resolve,reject) => {
      request.post({
        data: {
          request: 'private.weixin.update_info',
          userInfo: JSON.stringify(userInfo)
        },
        success: res => {
          if (res.code == 0) {
            resolve();
          } else {
            if(reject){
              reject({ msg: res.msg || '更新信息失败'})
            }
            wx.showToast({
              title: res.msg || '更新信息失败',
              icon: 'none'
            })
          }
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