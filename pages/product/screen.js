const request = require('../../utils/request.js');
var animationMask, animationContainer;
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
    moneyMin:{
      type:String,
      value: '',
      observer:function(e){
        this.setData({
          s_money:e
        })
      }
    },
    moneyMax: {
      type:String,
      value: '',
      observer: function (e) {
        this.setData({
          e_money: e
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hidden: true,
    animationMask: {},
    animationContainer: {},
    s_money: '',//最低价格
    e_money: ''//最高价格
  },
  /**
   * 组件的方法列表
   */
  methods: {
    unmove() {
      return false;
    },
    setSmoney(e){
      this.setData({
        s_money:e.detail.value
      })
    },
    setEmoney(e) {
      this.setData({
        e_money: e.detail.value
      })
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
        animationContainer.translateX(0).step();
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
      animationContainer.translateX('100%').step();
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
    hiddenCat() {
      this.triggerEvent('hidden')
    },
    reset(){
      this.setData({
        s_money: '',//最低价格
        e_money: ''//最高价格
      })
    },
    confirm(){
      if (this.data.s_money == this.data.moneyMin && this.data.e_money == this.data.moneyMax){
        this.triggerEvent('hidden')
      }else{
        this.triggerEvent('hidden');
        this.triggerEvent('confirm', { s_money: this.data.s_money, e_money: this.data.e_money });
      }
    }
  }
})
