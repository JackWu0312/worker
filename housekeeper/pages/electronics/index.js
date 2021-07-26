// pages/electronics/index.js
const util = require("../../utils/util.js");
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    tabActive:7,
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
      startTime:'',
      endTime:'',
      statusType:tabActive,
      pageNo,
      pageSize,
    }).then((res) => {
      that.setData({
        list: that.data.list.concat(res.list),
        totalPage: res.totalPage,
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

  tovoid(e){
    Dialog.alert({
      message: `是否作废？`,
      showCancelButton: true
    }).then(() => {
      util.request(`v2/compact/chengzu/update_status`, {
        id: e.currentTarget.dataset.id,
        status:21
        }).then((res) => {
          util.showToast('操作成功～')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1 // 返回上一级页面。
            })
          }, 1000)
        }).catch((err) => {
          console.log(err)
        })
    }).catch(() => {});;
  },
  cancel(e) {
    Dialog.alert({
      message: `是否删除？`,
      showCancelButton: true
    }).then(() => {
      util.request(`v2/compact/chengzu/update_status`, {
        id: e.currentTarget.dataset.id,
        isDelete: 1
        }).then((res) => {
          util.showToast('操作成功～')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1 // 返回上一级页面。
            })
          }, 1000)
        }).catch((err) => {
          console.log(err)
        })
    }).catch(() => {});;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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