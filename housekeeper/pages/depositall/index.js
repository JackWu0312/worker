// pages/selepeople/index.js
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jjrUserLikeName:'',
    list:[],
    nextPage:1
  },
  bindPhone(e) {
    var that = this;
    this.setData({
      list:[], 
      nextPage:1,
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
  before(){
    var that = this
    const {nextPage} = this.data
    this.setData({
      nextPage: nextPage==1?1:nextPage-1
    },()=>{
      that.getlist()
    })
  },

  next(){
    var that = this
    const {nextPage,list} = this.data
    this.setData({
      nextPage:   list.length==9?nextPage+1:nextPage
    },()=>{
      that.getlist()
    })
  },
  getlist(){
    var that =this
    const { jjrUserLikeName ,nextPage} = this.data
    util.request(`v2/house/house/search_list`, {
      likeName:jjrUserLikeName,
      nextPage:nextPage
    }).then((res) => {
        that.setData({
          list:res.list,
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
    var item = e.currentTarget.dataset.item
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    util.request("v2/house/part_house/get_by_id", {
      id:item.id
    }, 'POST').then((res) => {
      prevPage.setData({
        chengzuName:res.zuke.nickname,
        chengzuPhone:res.zuke.phone ,
        houseInfo: { houseId:item.id, fangjianName:  `${item.quyuCName}${item.louNo}号楼${item.men}单元${item.fangNo}室-${item.fangjianName}`}
      },()=>{
        wx.navigateBack({
          delta: 1 // 返回上一级页面。
        })
      })
    }).catch((err) => {
      console.log(err)
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