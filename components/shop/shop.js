var animationMask, animationContainer;
const request = require('../../utils/request.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      observer: function (t) {
        if (t) {
          this.animationEnter();
        } else {
          this.animationLeave();
        }
      }
    },
    num:{
      type:Number,
      value:1,
      observer:function(e){
        this.setData({
          count: e
        })
      }
    },
    product:{
      type:Object,
      observer:function(data){
        this.setData({
          stock: Number(data.product_stock) || 0
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count:1,
    animationMask: {},
    animationContainer: {},
    hidden:true,
    stock:0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    unmove(){
      return fale;
    },
    closeShop(){
      this.triggerEvent('close',this.data.count)
    },
    countReduce(){
      if(this.data.count>1){
        this.setData({
          count: this.data.count - 1
        })
      }
    },
    countAdd(){
      if (this.data.count < this.data.stock) {
        this.setData({
          count: this.data.count + 1
        })
      }
    },
    setCount(e){
      if (e.detail.value == ''){
        this.setData({
          count: ''
        })
        return;
      }
      var val = Number(e.detail.value);
      if(val>0&&val<this.data.stock){
        this.setData({
          count:val
        })
      } else if (val > this.data.stock){
        wx.showToast({
          title: '库存不足',
          icon:'none'
        })
        this.setData({
          count: this.data.count
        })
      } else if (val<0){
        this.setData({
          count: Math.abs(val)
        })
      } else if (val == 0){
        this.setData({
          count: 1
        })
      }
    },
    countblur(){
      if(this.data.count==''||this.data.count<=0){
        this.setData({
          count:1
        })
      }
    },
    animationEnter() {
      this.setData({
        hidden: false
      })
      setTimeout(() => {
        if (!animationMask) {
          animationMask = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease',
          })
        }
        if (!animationContainer) {
          animationContainer = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease',
          })
        }
        animationMask.opacity(1).step();
        animationContainer.translateY(0).step();
        this.setData({
          animationMask: animationMask.export(),
          animationContainer: animationContainer.export()
        })
      }, 50)

    },
    animationLeave() {
      if (!animationMask) {
        animationMask = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease',
        })
      }
      if (!animationContainer) {
        animationContainer = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease',
        })
      }
      animationMask.opacity(0).step();
      animationContainer.translateY('110%').step();
      this.setData({
        animationMask: animationMask.export(),
        animationContainer: animationContainer.export()
      })
      setTimeout(() => {
        this.setData({
          hidden: true
        })
      }, 500)
    },
    //添加购物车
    addToCart(){
      wx.showLoading({
        title: '正在添加',
        mask:true
      })
      request.post({
        data:{
          request:'private.cart.gvh_add_goods',
          product_id:this.data.product.product_id,
          count:this.data.count
        },
        success: res => {
          wx.hideLoading();
          if(res.code == 0){
            wx.showToast({
              title: '添加购物车成功',
              icon:'none'
            })
            this.triggerEvent('close',{type:'add',count:this.data.count,num:res.cart.total});
          }else{
            wx.showToast({
              title: res.msg || '添加购物车失败',
            })
          }
        }
      },true)
    },
    //立即购买
    shopping(){
      wx.navigateTo({
        url: '/pages/settlement/settlement?pid=' + this.data.product.product_id + '&count=' + this.data.count
      })
    }
  }
})
