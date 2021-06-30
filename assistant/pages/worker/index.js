// pages/worker/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //维修
  wxService() {
    wx.setStorageSync('workType', 1)
    if(wx.getStorageSync('isLogin')){
      wx.reLaunch({
        url: '../order_repair/index',
      })
    }else{
      wx.reLaunch({
        url: '../login/index',
      })
    }
  },
  //保洁
  bjService() {
    wx.setStorageSync('workType', 2)
    if(wx.getStorageSync('isLogin')){
      wx.reLaunch({
        url: '../order_clean/index',
      })
    }else{
      wx.reLaunch({
        url: '../login/index',
      })
    }
  },
  //装修
  zxService() {
    wx.setStorageSync('workType', 3)
    if(wx.getStorageSync('isLogin')){
      wx.reLaunch({
        url: '../order_renovation/index',
      })
    }else{
      wx.reLaunch({
        url: '../login/index',
      })
    }
  },
  //配货
  phService() {
    wx.setStorageSync('workType', 4)
    if(wx.getStorageSync('isLogin')){
      wx.reLaunch({
        url: '../order_distribution/index',
      })
    }else{
      wx.reLaunch({
        url: '../login/index',
      })
    }
  },
  //宽带
  // kdService() {
  //   if(wx.getStorageSync('isLogin')){
  //     wx.setStorageSync('workType', 5)
  //     wx.reLaunch({
  //       url: '../order/index',
  //     })
  //   }else{
  //     wx.reLaunch({
  //       url: '../login/index',
  //     })
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton({
      success: (res) => {},
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})