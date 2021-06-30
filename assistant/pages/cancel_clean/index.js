// pages/cancel_clean/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    remarks_input:'',
    workOrder: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
        })
      },
    });
    this.setData({
      workOrder: JSON.parse(options.workOrder),
    })
  },
  remarks_input: function (e) {
    this.setData({
      remarks_input: e.detail.value
    });
  },
  submit(){
    if (this.data.remarks_input.length == 0) {
      wx.showToast({
        title: '请输入退单原因',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var _this = this;
    wx.showLoading({
      title: '提交中...',
    })
    //取消订单
    wx.request({
      data: {
        gCId: getApp().globalData.gcid,
        customer: _this.data.workOrder.customer,
        customerCalls:_this.data.workOrder.customerCalls,
        orderNo:_this.data.workOrder.orderNo,
        des: _this.data.remarks_input,
        tableCleanId:_this.data.workOrder.id,
        dispatchTime:_this.data.workOrder.dispatchTime,
        dispatchInvolvedId:_this.data.workOrder.dispatchInvolvedId,
        phone:wx.getStorageSync('userInfo').customerCalls,
        token:wx.getStorageSync('userInfo').token
      },
      method: "POST",
      url: getApp().globalData.url + 'v2/app/worker/clean/insert',
      success(res) {
        wx.reLaunch({
          url: '../order_clean/index',
        })
      }
    })
    wx.hideLoading({
      success: (res) => {},
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