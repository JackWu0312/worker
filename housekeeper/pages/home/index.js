// pages/home/index.js
const app = getApp()
const util = require("../../utils/util.js");

Page({   

  /**
   * 页面的初始数据
   */ 
  data: {
    tabbar: {},
    jizhong:null,
    renting:null,
    management:null,
    house:null

  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    this.getCount();
    this.getCountRenting();
    this.getCountManagement();
    this.getCountHouse()
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
  //      统计集中
  getCount(){
    const that = this;
    util.request(`v2/house/focus_house/get_count_by_status`).then((res) => {
      that.setData({
        jizhong:res
      })
    }).catch((err) => {
      console.log(err) 
    }) 
  },
  //装修及租后
  getCountRenting(){
    const that = this;
    util.request(`v2/rentservice/complaint_letter/app_status_count`).then((res) => {
      that.setData({
        renting:res
      })
    }).catch((err) => {
      console.log(err) 
    }) 
  },
   //我的经营状况
   getCountManagement(){
    const that = this;
    util.request(`v2/compact/chengzu/app_status_count`).then((res) => {
      that.setData({
        management:res
      })
    }).catch((err) => {
      console.log(err) 
    }) 
  },
  getCountHouse(){
    const that = this;
    util.request(`v2/house/house/house_status_count`).then((res) => {
      that.setData({
        house:res
      })
    }).catch((err) => {
      console.log(err) 
    }) 
  },


   //投诉
  //  getCountLetter(){
  //   const that = this;
  //   util.request(`v2/rentservice/complaint_letter/get_status_count`).then((res) => {
  //     that.setData({
  //       letter:res.daiChuLi 
  //     })
  //   }).catch((err) => {
  //     console.log(err) 
  //   }) 
  // },
   //配货
  //  getCountOrders(){
  //   const that = this;
  //   util.request(`v2/rentservice/goods_orders/get_status_count`).then((res) => {
  //     that.setData({
  //       orders:res.daiChuLi
  //     })
  //   }).catch((err) => {
  //     console.log(err) 
  //   }) 
  // },

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