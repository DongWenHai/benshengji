const config = require('./config.js');
const Token = require('./token.js')

class POST {
  constructor(data) {
    this.platform = config.platform || 'wxxcx';
    this.base_url = config.base_url
  }

  default(o) {
    this.platform = o.platform;
    this.base_url = o.base_url;
  }

  validToken(token) {
    return new Promise((resolve, reject) => {

      if (!token.isValid()) {
        token.updateToken().then(() => {
          resolve();
        })
      } else {

        if (token.isValid()) {
          resolve();
        } else {
          token.updateToken().then(() => {
            resolve();
          })
        }

      }

    })
  }

  post(options, bool) {
    const token = new Token();
    options.data.platform = options.data.platform ? options.data.platform : this.platform;

    options.data.version = config.wx_env === 'development' ? config.t_version : config.version;

    if (!options.fail) {
      options.fail = (err) => {
        if (wx.showLoading) { wx.hideLoading() }
        wx.showToast({
          title: '网络错误，请检查网络后重新尝试',
          icon: 'none'
        })
      }
    }

    if (bool) {

      this.validToken(token).then(() => {
        options.data.token = token.token.token;
        wx.request({
          url: this.base_url,
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: options.data,
          success: res => {
            if (res.data.code >= 999) {
              console.log(token.token.token);
              console.log('new token request:', options.data.request);
              wx.clearStorageSync('token');
              this.post(options, bool)
            } else {
              options.success(res.data)
            }

          },
          fail: options.fail
        })
      })
      return;
    }

    wx.request({
      url: this.base_url,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: options.data,
      success: res => {
        if (res.data.code >= 999) {
          this.validToken(token).then(() => {
            options.data.token = token.token;
            this.post(options, false)
          })
        } else {
          options.success(res.data);
        }
      },
      fail: options.fail
    })
  }
}
module.exports = new POST();

