// components/img/img.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    defaultImg: {
      type: String,
      value: '/images/loading.png'
    },
    width: {
      type: String,
      value:'100%'
    },
    height: {
      type: String,
      value:'100%'
    },
    isCircle: {
      type: String,
      value: 0
    },
    loadImg: {
      type: String
    },
    lazyLoad: {
      type: Boolean,
      value: true
    },
    canPreview:{
      type:Boolean,
      value:false
    },
    imgGroup:{
      type:Array,
      value:[]
    }
  },
  externalClasses: ['img-class'],
  /**
   * 组件的初始数据
   */
  data: {
    isLoad: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _imgLoad() {
      this.setData({
        isLoad: true
      })
    },
    prewImg(){
      if(this.data.canPreview){
        wx.previewImage({
          current: this.data.loadImg,
          urls: this.data.imgGroup,
          fail: function (t) {
            wx.showToast({
              title: "预览图片失败，请重试",
              icon: "none"
            })
          }
        });
      }
    }
  }
})
