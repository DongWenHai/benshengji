const request = require('./request.js');
module.exports = {
  wxinfo(orderid) {
    return new Promise((resolve, reject) => {
      var data = {
        request: 'private.pay.param_get',
        orderId: orderid
      }
      request.post({
        data: data,
        success: res => {
          if (res.code == 0) {
            resolve(res.params);
          } else {
            if (reject) {
              reject();
            }
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        }
      }, true)
    })

  },
  wxpay(orderid) {
    return new Promise((resolve, reject) => {
      this.wxinfo(orderid).then((data) => {
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: 'MD5',
          paySign: data.paySign,
          success: res => {
            resolve(res)
          },
          fail: err => {
            if (reject) {
              reject(err);
            }
          }
        })
      })
    })
  }
}