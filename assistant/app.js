// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    url: 'http://tzcs.xmlfey.com/',   //测试环境
    // url:'http://lfpms.cn.utools.club/',//阙老板本地
  //url: 'https://pms.xmlfey.com/', //正式环境
    edition:"v1.0.0",
    gcid:"0592002"
  }
})
