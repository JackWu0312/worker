// pages/mine/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: wx.getStorageSync('userInfo').customer,
    phone: wx.getStorageSync('userInfo').customerCalls,
    editionName: getApp().globalData.edition,
    list: [{
      "iconPath": "/static/tab_1_normal.png",
      "selectedIconPath": "/static/tab_1_active.png",
      "text": "未做工单"
    }, {
      "iconPath": "/static/tab_2_normal.png",
      "selectedIconPath": "/static/tab_2_active.png",
      "text": "历史工单"
    }, {
      "iconPath": "/static/tab_3_normal.png",
      "selectedIconPath": "/static/tab_3_active.png",
      "text": "个人中心"
    }]
  },
 tabChange(e) {
    console.log('tab change', e)
    if (e == 1) { //历史工单
      wx.reLaunch({
        url: '../history_order/index',
      })
    } else if (e == 2) { //个人中心
      wx.reLaunch({
        url: '../mine/index',
      })
    } else { //未做工单
      if (wx.getStorageSync('workType') == 1) { //维修
        wx.reLaunch({
          url: '../order_repair/index',
        })
      } else if (wx.getStorageSync('workType') == 2) { //保洁
        wx.reLaunch({
          url: '../order_clean/index',
        })
      } else if (wx.getStorageSync('workType') == 3) { //装修
        wx.reLaunch({
          url: '../order_renovation/index',
        })
      } else if (wx.getStorageSync('workType') == 4) { //配货
        wx.reLaunch({
          url: '../order_distribution/index',
        })
      }
    }
  },
  //当前版本
  edition() {

  },

  //退出登录
  exit() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('isLogin', false)
          wx.reLaunch({
            url: '../worker/index',
          })
        } else {

        }
      }
    })

  },

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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
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