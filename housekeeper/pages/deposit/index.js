// pages/selepeople/index.js
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jjrUserLikeName:'',
    list:[]
  },
  bindPhone(e) {
    var that = this;
    this.setData({
      list:[], 
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
    const { jjrUserLikeName } = this.data
    util.request(`v2/item/room_type/get_kongzhi_list`, {
      fangNo:jjrUserLikeName,
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
      houseInfo: { houseId: e.currentTarget.dataset.houseid, fangjianName: e.currentTarget.dataset.fangjianname }
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})