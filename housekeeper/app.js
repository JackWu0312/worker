// app.js
App({
  onLaunch() {
    // wx.hideTabBar();

     // 获取设备信息
     this.getSystemInfo();
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
  },
  onShow: function () {
    //隐藏系统tabbar
    // wx.hideTabBar();
  },

  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },

  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },

  globalData: {
    userInfo: null,

    tabBar:{
      "backgroundColor": "#FBFBFB",
      "color": "#929292",
      "selectedColor": "#3CCC93",
      "list": [
        {
          "pagePath": "/pages/home/index",
          "iconPath": "icon/tab1.png",
          "selectedIconPath": "icon/tab1-active.png",
          "text": "工作台"
        },
        {
          "pagePath": "/pages/resources/index",
          "iconPath": "icon/tab2.png",
          "selectedIconPath": "icon/tab2-active.png",
          "text": "资源池"
        },
        {
          "pagePath": "/pages/more/index",
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": ""
        },
        {
          "pagePath": "/pages/news/index",
          "iconPath": "icon/tab3.png",
          "selectedIconPath": "icon/tab3-active.png",
          "text": "房态"
        },
        {
          "pagePath": "/pages/my/index",
          "iconPath": "icon/tab4.png",
          "selectedIconPath": "icon/tab4-active.png",
          "text": "我的"
        },
  
      ]
  }
  }
})
