// pages/selepeople/index.js
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jjrUserLikeName:'',
    pageNo:1,
    pageSize:10,
    totalPage:0,
    list:[]
  },
  bindPhone(e) {
    var that = this;
    this.setData({
      list:[], 
      pageNo:1,
      jjrUserLikeName: e.detail.value
    },()=>{
      that.getlist()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist()
  },
  getlist(){
    var that =this
    const { jjrUserLikeName ,pageNo,pageSize} = this.data
    util.request(`v2/sys/table_jjr_user/get_list`, {
      jjrUserLikeName,
      pageNo,
      pageSize
    }).then((res) => {
        that.setData({
          list:that.data.list.concat(res.list),
          totalPage:res.totalPage
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  backInfo(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      backInfo: { id: e.currentTarget.dataset.id, nickName: e.currentTarget.dataset.nickname ,dptm:e.currentTarget.dataset.name}
    },()=>{
      wx.navigateBack({
        delta: 1 // 返回上一级页面。
      })
    })
   
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
        that.getlist()
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