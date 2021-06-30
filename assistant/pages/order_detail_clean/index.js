// pages/order_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workOrder: null,
    screenHeight: 0,
    isHistory: false
  },
  //联系客户
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.call,
    })
  },
  //取消订单
  cancel() {
    wx.navigateTo({
      url: '../cancel_clean/index?workOrder=' + this.data.worderOrder
    })
  },
  //完成订单
  complete(e) {
    wx.navigateTo({
      url: '../complete/index?id=' + e.target.dataset.id,
    })
  },
  previmg(e) {
    var picUrl = e.target.dataset.picurl;
    var picList = e.target.dataset.piclist;
    var picsList = [];

    for (var index in picList) {
      picsList.push(picList[index].big)
    }

    wx.previewImage({
      current: picUrl, // 当前显示图片的http链接  
      urls: picsList // 需要预览的图片http链接列表  
    })
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
    console.log('isHistory = ' + options.isHistory)
    this.setData({
      workOrder: JSON.parse(options.workOrder),
      isHistory: options.isHistory == 1 ? true : false
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