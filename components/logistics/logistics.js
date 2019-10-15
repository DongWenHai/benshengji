// components/load-more/load-more.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    logistics:{
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
    untouch(){
      return false;
    },
    closeLogistics(){
      this.triggerEvent('close');
    }
  }
})
