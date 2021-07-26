// pages/contract/index.js
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    tabActive:0,
    pageNo: 1,
    pageSize: 10,
    totalPage: 0,
    list: [],
  },
  bindTabActive(e) {
    var that = this
    this.setData({
      pageNo: 1,
      list: [],
      tabActive: e.currentTarget.dataset.index,
    },()=>{
      that.getList()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  getList(data) {
    var that = this
    const {
      pageNo,
      pageSize,
      tabActive
    } = this.data
    util.request(`v2/compact/chengzu/get_my_list`, {
      statusType :11,
      pageNo,
      pageSize,
      contractType:tabActive==0?'':tabActive
    }).then((res) => {
      that.setData({
        list: that.data.list.concat(res.list),
        totalPage: res.totalPage,
        isWorkflowOpened:res.isWorkflowOpened
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  contractdetail(e) {
    wx.navigateTo({
      url: `/pages/contractdetail/index?data=` + e.currentTarget.dataset.id
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