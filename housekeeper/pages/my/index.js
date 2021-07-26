// pages/my/index.js
const app = getApp()
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    info:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.editTabbar();
    this.setData({
      info: wx.getStorageSync('info')
    })
  },
  layout() {
    wx.showModal({
      title: '提示',
      content: '确定是否退出',
      success(res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'info',
            success: function (res) {
              util.showToast('退出成功！')
              setTimeout(() => { 
                wx.navigateTo({
                  url: `/pages/login/index`
                });
              }, 1000)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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