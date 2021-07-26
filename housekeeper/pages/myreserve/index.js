// pages/myreserve/index.js
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 10,
    totalPage: 0,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  getList() {
    var that = this
    const {
      pageNo,
      pageSize,
     
    } = this.data
    util.request(`v2/house/house/get_boot_list`, {
      pageNo,
      pageSize
    }).then((res) => {
      that.setData({
        list: that.data.list.concat(res.list),
        totalPage: res.totalPage
      })
    }).catch((err) => {
      console.log(err)
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
  detail(e){
    wx.navigateTo({
      url: `/pages/focus/index?id=`+e.currentTarget.dataset.value.id
    });

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
    var that = this
    const { totalPage ,pageNo,} = this.data
    if(pageNo<=totalPage){
      this.setData({
        pageNo:pageNo+1
      },()=>{
        that.getList()
      })
    }else{
      util.showToast('暂无更多数据！')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})