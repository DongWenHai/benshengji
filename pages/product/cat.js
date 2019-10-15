const request = require('../../utils/request.js');
var animationMask,animationContainer;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      observer:function(t){
          if (t) {
            this.animationEnter();
          } else {
            this.animationLeave();
          }
      }
    },
    cid:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hidden:true,
    animationMask: {},
    animationContainer:{},
    cats:[]
  },
  created(){
    this.getCats();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    unmove(){
      return false;
    },
    getCats(){
      request.post({
        data:{
          request:'private.auction.category_list'
        },
        success: res => {
          if(res.code == 0){
            this.setData({
              cats:res.data
            })
          }else{
            wx.showToast({
              title: res.msg || '获取分类失败',
              icon:'none'
            })
          }
        }
      },true)
    },
    animationEnter(){
      this.setData({
        hidden:false
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
      },50)
      
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
      animationContainer.translateX('-100%').step();
      this.setData({
        animationMask: animationMask.export(),
        animationContainer: animationContainer.export()
      })
      setTimeout(() => {
        this.setData({
          hidden:true
        })
      },500)
    },
    hiddenCat(){
      this.triggerEvent('hidden')
    },
    setCatId(e){
      var cid = e.currentTarget.dataset.cid;
      if(cid == this.data.cid){
        this.triggerEvent('hidden')
      }else{
        this.triggerEvent('setcid',cid);
        this.triggerEvent('hidden')
      }
    }
  }
})
