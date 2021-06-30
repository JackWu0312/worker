// pages/login/index.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gcid :'0592002',
    accountName:'',
    accountPwd :''
  },
  bindName(e){
    this.setData({
      accountName: e.detail.value,
    })
  },
  bindPwd(e){
    this.setData({
      accountPwd: e.detail.value,
    })
  },
  sure() {
  
    if (!this.data.accountName) {
      util.showToast('请输入用户名~');
      return
    }
    if (!this.data.accountPwd) {
      util.showToast('请输入密码~');
      return
    }

    const that = this;
    util.request("v2/jjr_user_login/app_login", {
      gcid : that.data.gcid,
      accountName : that.data.accountName,
      accountPwd : that.data.accountPwd,
      appNo: '',
    } ).then((res) => {
      wx.setStorageSync('info', res);
      util.showToast('登陆成功～');
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/home/index"
        });
      }, 2000);
    }).catch((err) => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    if ( wx.getStorageSync('info')) {
      // setTimeout(() => {
      wx.switchTab({
        url: "/pages/home/index"
      });
      // }, 1000);
    }
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