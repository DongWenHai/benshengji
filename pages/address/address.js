// pages/address/address.js
const request = require('../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      name:'',
      province: '',
      city: '',
      area: '',
      address_detail: '',
      phone: ''
    },
    addressList: '',
    fromOrder: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUseraddress();
    if (!options.from) {
      this.setData({
        fromOrder: false
      })
    } else {
      this.setData({
        fromOrder: '2'
      })
      wx.setNavigationBarTitle({
        title: '选择地址'
      })
    }
  },
  onShow(){
    if(this.data.refresh){
      this.data.refresh = false;
      this.getUseraddress();
    }
  },
  //由订单详情页触发选择地址
  selectAddressToOrder: function (e) {
    if (!this.data.fromOrder) { return; }
    var pages = getCurrentPages();             //  获取页面栈
    var prevPage = pages[pages.length - 2];    // 上一个页面
    var defaultAddress = e.currentTarget.dataset.item;
    prevPage.setData({
      addressList: defaultAddress
    })
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取用户地址列表
  getUseraddress: function(){
    wx.showLoading({
      title: '加载中'
    })
    request.post({
      data: {
        request: 'private.address.address.list',
      },
      success: res => {
        wx.hideLoading();
        if (res.code == 0) {
          this.setData({
            addressList: res.data
          });
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
    if (this.data.addressList[e.currentTarget.dataset.index].select_status == 0){
      request.post({
        data: {
          request: 'private.address.edit_status',
          address_id: e.currentTarget.dataset.id,
          select_status: this.data.defaultAddress
        },
        success: res => {
          if (res.code == 0) {
            this.data.addressList.forEach((v,i) =>{
              if (i == e.currentTarget.dataset.index){
                v.select_status = 1;
              }else{
                v.select_status = 0;
              }
            });
            this.setData({
              addressList: this.data.addressList
            })
          } else {
            wx.showToast({
              title: '出错',
              icon: 'none',
              duration: 1000
            })
          }
        }
      }, true)
    }else{
      return;
    }

  },
  // 添加地址
  getAddress: function (formData){
    wx.showLoading({
      title: '加载中'
    })
    request.post({
      data: {
        request: 'private.address.add.address.info',
        name: formData.name,
        province: formData.province,
        city: formData.city,
        area: formData.area,
        address_detail: formData.address_detail,
        phone: formData.phone,
        select_status:1
      },
      success: res => {
        wx.hideLoading();
        if (res.code == 0) {
          this.getUseraddress();
          wx.showToast({
            title: res.msg,
            icon: 'success',
            duration: 1000
          })

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
  // 编辑地址
  editAdress: function (e) {
    var data = this.data.addressList[e.currentTarget.dataset.index];
    data = JSON.stringify(data);
    wx.navigateTo({
      url: '/pages/address/edit?address=' + data +'&from=' + this.data.fromOrder
    })
  },
  // 删除地址
  delAdress: function (e){
    let that =this;
    wx.showModal({
      content: '是否删除',
      success(res) {
        if (res.confirm) {
          that.redelAdress(e);  
        }
      }
    })
  },
  redelAdress: function(e){
    wx.showLoading({
      title: '加载中'
    })
    request.post({
      data: {
        request: 'private.address.del.address',
        address_id: e.currentTarget.dataset.id
      },
      success: res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: res.msg,
            icon: 'success',
            duration: 1000
          })
          let addressList = this.data.addressList;
          addressList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            addressList: addressList
          })

        } else {
          wx.showToast({
            title: res.msg || '出错了',
            icon: 'none',
            duration: 1000
          })
        }
      }
    }, true)
  },
  // 获取微信地址
  getWxAddress: function(){
    wx.chooseAddress({
      success: res => {
        let name = res.userName;
        let province = res.provinceName;
        let city = res.cityName;
        let area = res.countyName;
        let address_detail = res.detailInfo;
        let phone = res.telNumber;
        let data = {
          name: name,
          province: province,
          city: city,
          area: area,
          address_detail: address_detail,
          phone: phone
        }
        this.getAddress(data);
      }
    })
  }
})