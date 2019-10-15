const app = getApp();
const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: [],
    orderid:'',
    type: 2,//2仅退款，1退货退款
    reasonName:'',
    reason1:[
      {
        value: 1,
        name: "商品质量问题"
      }, {
        value: 2,
        name: "商品与页面描述不符"
      }, {
        value: 3,
        name: "商品漏发"
      }, {
        value: 4,
        name: "商品破损"
      }, {
        value: 5,
        name: "个人原因退货"
      }, {
        value: 6,
        name: "多拍、错拍、不想要"
      }, {
        value: 7,
        name: "其他"
      }
    ],
    reason2: [{
        value: 8,
        name: "多拍、错拍、不想要"
      }, {
        value: 9,
        name: "其他"
      }
    ],
    remark:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var products = JSON.parse(options.products);
    var orderid = options.orderid;
    this.setData({
      products:products,
      orderid:orderid
    })
  },
  toggleType(e){
    var type = e.currentTarget.dataset.type;
    if(type != this.data.type){
      this.setData({
        type:type,
        reasonName:''
      })
    }
  },
  selectReason(e){
    var index = Number(e.detail.value);
    if(this.data.type == 2){
      var reasonName = this.data.reason2[index].name;
    }else{
      var reasonName = this.data.reason1[index].name;
    }
    this.setData({
      reasonName: reasonName
    })
  },
  setRemark(e){
    this.setData({
      remark:e.detail.value
    })
  },
  submitForm(){
    request.post({
      data:{
        request:'private.order.gvh.apply.refund',
        orderId:this.data.orderid,
        refundReason: this.data.reasonName,
        refundType: this.data.type,
        refund_beizhu:this.data.remark
      },
      success: res => {
        if(res.code == 0){
          app.globalData.hasEditOrder = true;
          wx.showToast({
            title: res.msg || '提交成功',
            icon:'success',
            duration:1500
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          },1500)
        }else{
          wx.showToast({
            title: res.msg || '网络出错,请重试',
            icon:'none'
          })
        }
      }
    },true)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})