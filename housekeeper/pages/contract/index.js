// pages/contract/index.js
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist(JSON.parse(options.data))
  },
  call(e){
    wx.makePhoneCall({
      phoneNumber:  e.currentTarget.dataset.phone
    })
  },
  getlist(data){
    const that = this;
    util.request(`v2/compact/chengzu/get_list`, data).then((res) => {
      that.setData({
        list:res.list,
        isWorkflowOpened:res.isWorkflowOpened
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  contractdetail(e){
    wx.navigateTo({
      url: `/pages/contractdetail/index?data=`+e.currentTarget.dataset.id
    });
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