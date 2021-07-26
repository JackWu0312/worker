// pages/together/index.js
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tblId: '',
    gender: 1,
    fileList0: [],
    fileList1: [],
    fileList2: [],
    fileList3: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    if(options.id){
      that.getFuJianData(0,options.id)
      that.getFuJianData(1,options.id)
      that.getFuJianData(2,options.id)
      that.getFuJianData(3,options.id)
      this.setData({
        nickname: options.nickname, //合租人姓名
        gender: options.gender, //合租人性别
        phone: options.phone, //合租人手机号
        sfzNo: options.sfzNo, //合租人身份证号
        index: options.index
      })
    }
    this.setData({
      tblId: options.id ? options.id : util.getUUID()
    })
  },
  getFuJianData(type,tblId){
    var that =this
    util.request(`v2/accessory/pic/get_list`, {
      type: 120,
      tblId:tblId,
      subType: type,
    }).then((res) => {
        that.setData({
          [`fileList${type}`]: res.list.map((val)=>{
              var obj = {
                url :val.big,
                id:val.id
              }
            return obj
          })
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
  afterRead(event) {
    var that = this
    var id = util.getUUID()
    const {
      file
    } = event.detail;
    var type = event.currentTarget.dataset.type
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: util.imgHost, // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'image',
      formData: {
        user: 'test'
      },
      success(res) {
        var fileobj = that.data[`fileList${type}`]
        fileobj.push({
          id,
          url: JSON.parse(res.data).url
        });
        that.setData({
          [`fileList${type}`]: fileobj
        }, () => {
          var sentdata = {
            big: JSON.parse(res.data).url,
            type: 120,
            tblId: that.data.tblId,
            subType: type,
            id
          }
          that.saveImg(sentdata)
        });
      },
    });
  },

  saveImg(obj) {
    const that = this;
    util.request(`v2/accessory/pic/save`, obj).then((res) => {
      util.showToast('上传成功！')
    }).catch((err) => {
      console.log(err)
    })
  },
  deleteImg(e) {
    var that = this
    var type = e.currentTarget.dataset.type
    var list = this.data[`fileList${type}`]
    var id = list[e.detail.index].id
    list.splice(e.detail.index, 1)
    this.setData({
      [`fileList${type}`]: list
    }, () => {
      that.delImg(id)
    })
  },
  delImg(id) {
    util.request(`v2/accessory/pic/delete_by_id`, {
      id
    }).then((res) => {
      console.log(res)
      util.showToast('删除成功！')
    }).catch((err) => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindnickname(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindsfzNo(e) {
    this.setData({
      sfzNo: e.detail.value
    })
  },
  gendersel(e) {
    this.setData({
      gender: e.currentTarget.dataset.gender
    })
  },
  save() {
    var that = this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var list = prevPage.data.cotenantList
    var index = this.data.index
    var obj = {
      id: that.data.tblId, //合租人id
      nickname: that.data.nickname, //合租人姓名
      gender: that.data.gender, //合租人性别
      phone: that.data.phone, //合租人手机号
      sfzNo: that.data.sfzNo //合租人身份证号
    }
    if (index) {
      list.splice(index, 1, obj)
    } else {
      list.push(obj)
    }
    prevPage.setData({
      cotenantList: list
    }, () => {
      wx.navigateBack({
        delta: 1 // 返回上一级页面。
      })
    })
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