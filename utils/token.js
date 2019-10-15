const config = require('./config.js');

class TOKEN {
  constructor() {
    this.token = wx.getStorageSync('token');
    this.valid_time = config.token_valid_time;
  }

  isValid(time) {
    if (this.token) {
      if (time) {
        if ((time - this.token.time) > this.valid_time) {
          return false;
        } else {
          return true;
        }
      } else {
        if ((Date.parse(new Date()) / 1000 - this.token.time) > this.valid_time) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  }
  updateToken(userinfo) {
    return new Promise((resolve, reject) => {
      wx.login({
        timeout: 20000,
        success: res => {
          var requestData = {
            platform: config.platform,
            request: 'public.weixin.get_token',
            code: res.code,
            version: config.version
          }
          if (userinfo){
            requestData.userInfo = JSON.stringify(userinfo)
          }
          wx.request({
            url: config.base_url,
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: requestData,
            success: res => {
              if (res.data.code == 0) {

                var token = { token: res.data.token, time: res.data.sysTime };
                this.token = token;
                wx.setStorageSync('token', token);
                wx.setStorageSync('needAuth', !res.data.isAuthed);
                getApp().globalData.needAuth = !res.data.isAuthed;
                resolve();
              } else {
                reject();
                wx.showModal({
                  title: '警告',
                  content: '网络错误，请刷新重试',
                  showCancel: false
                })
              }
            },
            fail: function (e) {
              wx.showToast({
                title: "小程序获取信息失败，请您退出后重新登录",
                icon: "none"
              }), console.warn(e);
            }
          })
        },
        fail: err => {
          console.log(err);
        }
      })
    })


  }
}

module.exports = TOKEN;