const commonFn = require('../../utils/commonFn.js');
Component({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  methods:{
    // 授权
    getUserInfo(e) {
      if (e.detail.errMsg === "getUserInfo:ok") {
        commonFn.default.updateInfo(e.detail.userInfo).then(() => {
          wx.setStorage({
            key: 'needAuth',
            data: false
          })
          this.triggerEvent('success')
        }).catch(() => { })
      }
    }
  }
  
})