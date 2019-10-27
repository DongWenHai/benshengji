const request = require('../../utils/request.js');
const utils = require('../../utils/util.js');
const commonFn = require('../../utils/commonFn.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeData: '',
    themeFilePath: '',
    showSave: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    commonFn.default.getUserInfo().then((res) => {
      if (res.code == 0) {
        this.setData({
          storeData: res.userInfo
        })
        this.makeCanvas(res.userInfo.avatarUrl);
      } else {
        wx.showToast({
          title: res.msg || '获取用户信息异常，请重试',
          icon: 'none'
        })
      }
    })
  },
  // 获取小程序分享码
  getQrcode() {
    wx.showLoading({
      title: '正在获取分享码'
    })
    request.post({
      data: {
        request: 'private.shopkeeper.stock.qrcode',
        pageUrl: 'pages/index/index',
        scene: '1'
      },
      success: res => {
        wx.hideLoading();
        if (res.code == 0) {
          this.downloadQrcode(res.data, (path) => {
            this.makeCanvas(path);
          })

        } else {
          wx.showToast({
            title: res.msg || '加载失败',
            icon: 'none'
          })
        }
      }
    }, true)
  },
  downloadQrcode(qrcode, callback) {
    wx.downloadFile({
      url: qrcode,
      success: res => {
        if (res.statusCode === 200) {
          callback(res.tempFilePath)
        }
      }
    })
  },
  makeCanvas(qrcode) {
    wx.showLoading({
      title: '正在制作分享码'
    })
    this.context = wx.createCanvasContext('share-canvas', this);
    this.context.drawImage('/images/share-bg.jpg', 0, 0, utils.rpx2px(718), utils.rpx2px(960));
    this.context.draw();
    wx.downloadFile({
      url: qrcode,
      success: res => {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
    this.context.drawImage(res.tempFilePath, utils.rpx2px(54), utils.rpx2px(68), utils.rpx2px(132), utils.rpx2px(132));
          this.context.draw(true);
          this.context.setFontSize(20);
          this.context.setFillStyle('#666666');
          this.context.fillText(this.data.storeData.nickName, utils.rpx2px(215), utils.rpx2px(120));
          this.context.setFillStyle('#bbbbbb');
          this.context.setFontSize(18);
          this.context.fillText('自用省钱  分享赚钱', utils.rpx2px(215), utils.rpx2px(175));
          this.context.draw(true);

    this.context.drawImage('/images/qrcode.png', utils.rpx2px(182), utils.rpx2px(280), utils.rpx2px(354), utils.rpx2px(354));
          this.context.draw(true, () => {
            wx.canvasToTempFilePath({
              canvasId: 'share-canvas',
              success: res => {
                wx.hideLoading();
                this.setData({
                  themeFilePath: res.tempFilePath,
                  showSave: true
                })
                console.log(this.data)
              },
              fail: err => {
                wx.hideLoading();
                wx.showToast({
                  title: '保存临时文件失败',
                  icon: 'none'
                })
                console.log(err)
              }
            })
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '下载头像内容失败',
          icon: 'none'
        })
      }
    })
  },
  saveimg() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.themeFilePath,
      success: res => {
        wx.showToast({
          title: '保存成功，快去分享吧',
          icon: 'none'
        })
      }
    })
  }
})