// pages/cart/cart.js
const request = require('../../utils/request.js');
const publicFn = require('../../utils/public.js');
var appLoadMixin = require('../../mixin/appLoadMixin.js');
Page(getApp().initMixin({
  mixins: [appLoadMixin.default],
  /**
   * 页面的初始数据
   */
  data: {
    mode: 'nomal',//管理模式nomal,management
    allChecked: false,//全部选中状态
    cartData: [], // 购物车数据
    total: '0.00', //总金额
    count: '' // 购物车数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //切换管理模式
  toggleMode() {
    this.setData({
      mode: this.data.mode === 'nomal' ? 'management' : 'nomal'
    })
  },
  //全选事件
  checkedAll() {
    var status = this.data.allChecked;
    this.checkedAllEvent(status ? 'N' : 'Y', () => {
      this.setData({
        allChecked: !status
      })
      this.modifyCheckedAll(status ? '0' : '1');
    });
  },
  checkedAllEvent(status, callback) {
    request.post({
      data: {
        request: 'private.cart.gvh.edit.select',
        status: status
      },
      success: res => {
        if (res.code == 0) {
          callback();
        } else {
          wx.showToast({
            title: res.msg || '网络错误',
            icon: 'none'
          })
        }
      }
    }, true)
  },
  //修改数据全选或全不选,status为true全选
  modifyCheckedAll(status) {
    var cartData = this.data.cartData;
    cartData.forEach((v, i) => {
      v.select_status = status;
    })
    this.setData({
      cartData: cartData
    })
    this.totalMoney();
  },
  //选中或取消事件
  checkItem(e) {
    var status = e.detail.checked ? '1' : '0';//选中或取消状态
    var index = e.currentTarget.dataset.index;//选中或取消项的下标

    var cartData = this.data.cartData;
    var pid = cartData[index].product_id;
    this.checkEvent(pid, status, () => {
      cartData[index].select_status = status;
      var allCheckedStatus = this.isAllChecked(cartData);//判断是否全部选中
      this.setData({
        cartData: cartData,
        allChecked: allCheckedStatus
      })
      this.totalMoney();
    });
  },
  checkEvent(pid, status, callback) {
    request.post({
      data: {
        request: 'private.cart.gvh.edit.single.select',
        product_id: pid,
        select_status: status
      },
      success: res => {
        if (res.code == 0) {
          callback();
        } else {
          wx.showToast({
            title: res.msg || '网络错误',
            icon: 'none'
          })
        }
      }
    }, true)
  },
  //查询购物车是否全部被选中
  isAllChecked(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].select_status == '0') { return false; }
    }
    return true;
  },
  //修改数量
  changeNumber(e) {
    if (typeof e.detail != 'undefined') {
      var cartData = this.data.cartData;
      var type = e.detail.type;
      var index = e.currentTarget.dataset.index;
      var value = e.detail.value;
      var pid = e.currentTarget.dataset.id;
      this.editCart(pid, value, () => {
        this.setData({
          ["cartData[" + index + "].product_count"]: value
        })
        this.totalCount();
        this.totalMoney();
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCart();
  },
  // 获取购物车数据
  getCart: function () {
    wx.showNavigationBarLoading();
    request.post({
      data: {
        request: 'private.cart.gvh_cart_data',
      },
      success: res => {
        wx.hideNavigationBarLoading();
        if (res.code == 0) {
          var cartList = res.goods_list;
          cartList.forEach((v, i) => {
            v.product_price = (v.product_price / 100).toFixed(2);
          })
          if (cartList.length===0){
            this.setData({
              mode:'nomal'
            })
          }
          var allCheckedStatus = this.isAllChecked(cartList);//判断是否全部选中
          this.setData({
            cartData: cartList,
            allChecked: allCheckedStatus
          })
          this.totalMoney();//计算总金额
          publicFn.setCartNumber(3, res.count);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    }, true)
  },
  // 编辑购物车数量
  editCart: function (pid, value, callback) {
    request.post({
      data: {
        request: 'private.cart.gvh.edit.cart',
        product_id: pid,
        count: value,
      },
      success: res => {
        if (res.code == 0) {
          // 计算总金额
          if (callback) {
            callback();
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    }, true)
  },
  //总计计算金额
  totalMoney() {
    var cartData = this.data.cartData;
    var total = 0;
    cartData.forEach((v, i) => {
      if (v.select_status == 1) {
        total = (Number(total) + v.product_price * v.product_count).toFixed(2);
      }
    })
    this.setData({
      total: total
    })
  },
  totalCount() {
    var cartData = this.data.cartData;
    var total = 0;
    cartData.forEach((v, i) => {
      total = total + Number(v.product_count);
    })
    publicFn.setCartNumber(3, total)
  },
  //获取选中的商品
  getSelectedgoods() {
    var cartData = this.data.cartData;
    var ids = [];
    cartData.forEach((v, i) => {
      if (v.select_status == '1') {
        ids.push(v.product_id)
      }
    })
    return ids.join(',');
  },
  //删除购物车商品
  deleteEvent() {
    var ids = this.getSelectedgoods();
    if (ids) {
      wx.showModal({
        title: '提醒',
        content: '是否确认删除商品?',
        success: res => {
          if (res.confirm) {
            this.del(ids);
          }
        }
      })

    } else {
      wx.showToast({
        title: '请选择要删除的商品',
        icon: 'none'
      })
    }
  },
  del(pids) {
    request.post({
      data: {
        request: 'private.cart.gvh.del.select',
        product_id: pids
      },
      success: res => {
        if (res.code == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
          this.getCart();
        } else {
          wx.showToast({
            title: res.msg || '网络错误',
            icon: 'none'
          })
        }
      }
    }, true)
  },
  // 计算
  balance: function () {
    wx.navigateTo({
      url: '/pages/settlement/settlement'
    })
  }
}))