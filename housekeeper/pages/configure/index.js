// pages/revenue/index.js
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indentType: 1,
    columns: [],
    show: false,
    type: '',
    money: '',
    item:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item) {
      var item = JSON.parse(options.item)
      this.setData({
        item,
        index: options.index,
        indentType: item.guishuType,
        money: item.count,
        desc:item.wpbz,
        type:item.peiZhiKey,
        typeId:item.peiZhiId,
        
      })
    }
    this.setData({
      houseId: options.houseId,
    })
    this.getMark()
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
  getMark() {
    var that = this
    util.request(`v2/sys/zi_dian/get_list_by_mark`, {
      mark: '8c37aabd-7185-4467-967b-5b3cab887505'
    }).then((res) => {
      that.setData({
        listType: res.list.map((val) => {
          return val.id
        }),
        columns: res.list.map((val) => {
          return val.key
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  rax(e) {
    this.setData({
      indentType: e.currentTarget.dataset.rax
    })
  },


  onClose() {
    const me = this
    this.setData({
      show: !me.data.show
    })
  },
  onChange(event) {
    const {
      value,
      index
    } = event.detail;
    var that = this
    this.setData({
      typeId: that.data.listType[index],
      type: value
    })
  },
  onConfirm(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      typeId: that.data.listType[index],
      type: value
    }, () => {
      that.onClose()
    })
  },
  bindMoney(e) {
    this.setData({
      money: e.detail.value
    })
  },
  bindRemark(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  sure() {
    const {
      indentType,
      item,
      houseId,
      money,
      desc,
      typeId,
      type,
      index
    } = this.data
    var obj = {
      guishuType: indentType,
      count: money,
      wpbz: desc,
      id: item ? item.id : util.getUUID(),
      houseId:houseId,
      peiZhiKey: type,
      peiZhiId: typeId,
      check: true
    }

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var list = prevPage.data.peizhiList;
    if (index) {
      list.splice(index, 1, obj)
    } else {
      list.unshift(obj)
    }
    prevPage.setData({
      peizhiList: list,
    }, () => {
      util.request(`v2/storage/house_pei_zhi/save`, obj).then((res) => {
        util.showToast('保存成功！')
        wx.navigateBack({
          delta: 1 // 返回上一级页面。
        })
      }).catch((err) => {
        console.log(err)
      })
    })
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