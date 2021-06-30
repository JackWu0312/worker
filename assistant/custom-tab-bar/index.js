Component({

  properties: {
    selected: {
      type: Number
    },
    list: {
      type:Array
    }
  },

  data: {
    // selected: 0,
    borderStyle: "#F4F4F4",
    color: "#A9A9A9",
    selectedColor: "#464646",
    // list: [{
    //   pagePath: "/pages/order/index",
    //   iconPath: "/static/tab_1_normal.png",
    //   selectedIconPath: "/static/tab_1_active.png",
    //   text: "未做工单"
    // }, {
    //   pagePath: "/pages/history_order/index",
    //   iconPath: "/static/tab_2_normal.png",
    //   selectedIconPath: "/static/tab_2_active.png",
    //   text: "历史工单"
    // }, {
    //   pagePath: "/pages/mine/index",
    //   iconPath: "/static/tab_3_normal.png",
    //   selectedIconPath: "/static/tab_3_active.png",
    //   text: "个人中心"
    // }]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      this.triggerEvent("switchTab", data.index)
      console.log(data.index);
      // wx.navigateTo({
      //   url
      // })
      this.setData({
        selected: data.index
      })
    }
  }
})