// components/order-controls/order-controls.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderStatus:{
      type:String
    },
    order:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    pay(){
      this.triggerEvent('pay')
    },
    cancle() {
      this.triggerEvent('cancle')
    },
    del() {
      this.triggerEvent('del')
    },
    refund(){
      this.triggerEvent('refund')
    },
    accept(){
      this.triggerEvent('accept');
    },
    viewLogistics(){
      this.triggerEvent('logistics')
    },
    share(){
      wx.navigateTo({
        url: '/pages/collage/share?cid=' + this.data.order.collageId
      })
    }
  }
})
