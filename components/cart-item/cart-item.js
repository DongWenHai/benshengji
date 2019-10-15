// components/cart-item/cart-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false
    },
    content: {
      type: Object,
      observer: function (t) {
        t.max = t.product_stock ? Number(t.product_stock) : 999;
        t.min = t.min ? t.min : 1;
        t.product_count = Number(t.product_count);
        this.setData({
          content: t
        })
      }
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
    onFocus() {

    },
    changeNumber(e) {
      this.triggerEvent('change', e.detail);
    },
    checkEvent() {
      this.triggerEvent('check', { checked: !this.data.checked });
    }
  }
})
