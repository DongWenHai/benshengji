// pages/addaddress/address.js
var app = getApp();
var validData = require('../../utils/valid.js');
const request = require('../../utils/request.js');
var valid = validData.valid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '白云区'],
    formData: {
      name_val: '',
      phone_val: '',
      address_val: ''
    },
    defaultAddress: 1,
    fromOrder: false
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from) {
      this.setData({
        fromOrder: options.from
      })
    }
  },
  // 收货人姓名
  setName: function (e) {
    var name = 'formData.name_val';
    this.setData({
      [name]: e.detail.value
    })
  },
  // 收货人电话
  setPhone: function (e) {
    var name = 'formData.phone_val';
    this.setData({
      [name]: e.detail.value
    })
  },
  setAddress: function (e) {
    var name = 'formData.address_val';
    this.setData({
      [name]: e.detail.value
    })
  },
  // 提交
  submitData: function () {
    wx.showLoading({
      title: '正在添加地址...',
      mask: true
    })
    if (!this.formValid()) { return }
    request.post({
      data: {
        request: 'private.address.add_address_info',
        name: this.data.formData.name_val,
        address_detail: this.data.formData.address_val, 
        phone: this.data.formData.phone_val,
        province: this.data.region[0],
        city: this.data.region[1],
        area: this.data.region[2],
        select_status: this.data.defaultAddress
      },
      success: res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          if (this.data.fromOrder == '1'){
            var pages = getCurrentPages();             //  获取页面栈
            var prevPage = pages[pages.length - 2];    // 上一个页面
            prevPage.setData({
              addressList: {
                name: this.data.formData.name_val,
                phone: this.data.formData.phone_val,
                province: this.data.region[0],
                city: this.data.region[1],
                area: this.data.region[2],
                address_detail: this.data.formData.address_val,
                select_status: this.data.defaultAddress,
                address_id: res.address_id
              }
            })
            wx.navigateBack({
              delta: 1
            })
          } else if (this.data.fromOrder == '2'){
            var pages = getCurrentPages();             //  获取页面栈
            var prevPage = pages[pages.length - 3];    // 上上一个页面
            prevPage.setData({
              addressList: {
                name: this.data.formData.name_val,
                phone: this.data.formData.phone_val,
                province: this.data.region[0],
                city: this.data.region[1],
                area: this.data.region[2],
                address_detail: this.data.formData.address_val,
                select_status: this.data.defaultAddress,
                address_id: res.address_id
              }
            })
            wx.navigateBack({
              delta: 2
            })
          }else{
            var pages = getCurrentPages();             //  获取页面栈
            var prevPage = pages[pages.length - 2];    // 上一个页面

            prevPage.setData({
              refresh: true
            })
            wx.navigateBack({
              delta: 1
            })
          }
          
        } else {
          wx.showToast({
            title: '出错',
            icon: 'none',
            duration: 1000
          })
        }
      }
    }, true)
  },
  // 设置默认地址
  setDefaultAddress: function (e) {
    this.setData({
      defaultAddress: this.data.defaultAddress == 0 ? 1 : 0
    })
  },
  // 表单验证
  formValid: function () {
    if (valid.isEmputy(this.data.formData.name_val)) {
      wx.showToast({
        title: '收货人姓名不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (valid.isEmputy(this.data.formData.phone_val)) {
      wx.showToast({
        title: '收货电话不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (!valid.isPhone(this.data.formData.phone_val)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }else if (valid.isEmputy(this.data.formData.address_val)) {
      wx.showToast({
        title: '请输入收货详细信息',
        icon: 'none',
        duration: 2000
      })
      return false;
    } 
    return true;
  }
})