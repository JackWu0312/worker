// pages/focus/index.js
const app = getApp()
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 2000,
    duration: 1000,
    imgUrl: [{
      url: 'https://zcczk.oss-cn-qingdao.aliyuncs.com/3ozv9j93cl6fp23j0w2d.png'
    }],
    value: null
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  gethouse(id) {
    const that = this;
    util.request(`v2/house/part_house/get_by_id`, {
      id
    }).then((res) => {
      that.setData({
        value: res
      }, () => {
        that.getpei(that.data.value.parentId)
        that.getpic(that.data.value.parentId)
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getpei(parentId) {
    const that = this;
    util.request(`v2/storage/house_pei_zhi/get_list`, {
      status: 1,
      parentHouseId: parentId
    }).then((res) => {
      // console.log(res)
      that.setData({

      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getpic(id) {
    const that = this;
    util.request(`v2/accessory/pic/get_list`, {
      tblId: id,
      type: 1
    }).then((res) => {
      that.setData({
        imgUrl: [{
          big: '../../static/nohouse.png'
        }]
        // imgUrl:res.list.length>0?res.list:[{
        //   big:'../../static/nohouse.png'
        // }]
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  reserve() {
    var item = this.data.value
    var str = `${item.quyuCName}${item.louNo}号楼${item.men}单元${item.fangNo}室${item.fangjianName=='整租'?'整租':item.fangjianName}${item.fangjianName=='整租'?'':'间'}`
    var shoudingStatus = (item.houseStatus == 1 && item.shoudingStatus == 0) ? 1 : ''
    wx.navigateTo({
      url: `/pages/reserve/index?address=${str}&id=${item.id}&shoudingStatus=${shoudingStatus}`
    });
  },
  sign(e) { //新签
    // hetongType   1 为新签    2 为续签  
    var hetongType =  e.currentTarget.dataset.type
    var item = this.data.value
    var hetongId = item.hetongId || item.chengZuId
    var str = `${item.quyuCName}${item.louNo}号楼${item.men}单元${item.fangNo}室${item.fangjianName=='整租'?'整租':item.fangjianName}${item.fangjianName=='整租'?'':'间'}`
    wx.navigateTo({
      url: `/pages/sign/index?hetongType=${hetongType}&address=${str}&houseId=${item.id}&parentId=${item.parentId}&zujin=${item.zujin}&zuJinMin=${item.dijia}&hetongId=${hetongId}`
    });
  },
  unsubscribe() {
    var item = this.data.value
    var shoudingStatus = (item.houseStatus == 1 && item.shoudingStatus == 1) ? 1 : 0
    wx.navigateTo({
      url: `/pages/unsubscribe/index?id=${item.id}&shoudingStatus=${shoudingStatus}`
    });
  },
  refund() {
    var item = this.data.value
    var str = `${item.quyuCName}${item.louNo}号楼${item.men}单元${item.fangNo}室${item.fangjianName=='整租'?'整租':item.fangjianName}${item.fangjianName=='整租'?'':'间'}`
    var shoudingStatus = (item.houseStatus == 1 && item.shoudingStatus == 0) ? 1 : ''
    wx.navigateTo({
      url: `/pages/refund/index?id=${item.id}&parentId=${item.parentId}&chengZuId=${item.chengZuId}&adress=${str}&shoudingStatus=${shoudingStatus}`
    });
  },
  contract() {
    var data = this.data.value
    var obj = null
    if (data.parentId == data.id) {
      obj = {
        parenthouseId: data.parentId
      }
    } else {
      obj = {
        houseId: data.id
      }
    }

    wx.navigateTo({
      url: `/pages/contract/index?data=` + JSON.stringify(obj)
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
    this.gethouse(this.data.id)
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