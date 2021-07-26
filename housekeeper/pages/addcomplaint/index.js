// pages/revenue/index.js
const util = require("../../utils/util.js");
import dateTimePicker from '../../utils/dateTimePicker.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    houseInfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:util.getUUID()
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
  

  delImg(id) {
    util.request(`v2/accessory/pic/delete_by_id`, {
      id
    }).then((res) => {
      util.showToast('删除成功！')
    }).catch((err) => {
      console.log(err)
    })
  },
  saveImg(obj) {
    util.request(`v2/accessory/pic/save`, obj).then((res) => {
      util.showToast('上传成功！')
    }).catch((err) => {
      console.log(err)
    })
  },
  deleteImg(e) {
    var list =this.data.fileList
    this.delImg(list[e.detail.index].id)
    list.splice(e.detail.index, 1)
    that.setData({
      fileList: list
    });
  },
  afterRead(event) {
    var id = util.getUUID()
    var that = this
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: util.imgHost, // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'image',
      formData: {
        user: 'test'
      },
      success(res) {
        var fileobj = that.data.fileList
        fileobj.push({
          id,
          big: JSON.parse(res.data).url,
          url: JSON.parse(res.data).url
        });
        that.saveImg({
          id,
          tblId: that.data.id, //根据id获取附件
          type: 125, //图片类型
          subType: 1, //图片子分类
        })
        that.setData({
          fileList: fileobj
        });
       
      },
    });
  },
  
 
  bindphone(){
    this.setData({
      phone: e.detail.value
    })
  },
  bindchengzuName(){
    this.setData({
      chengzuName: e.detail.value
    })
  },
  bindchengzuPhone(){
    this.setData({
      chengzuPhone: e.detail.value
    })
  },
  bindrepairServiceContent(e){
    this.setData({
      repairServiceContent: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  depositall(){
    wx.navigateTo({
      url: `/pages/depositall/index`
    });
  },
  sure(){
    var {
      id,
      houseInfo,
      chengzuName,
      chengzuPhone,
      repairServiceContent,
    } = this.data
    if (!houseInfo) {
      util.showToast('请选择房源')
      return
    }
    if (!chengzuName) {
      util.showToast('请填写租客姓名')
      return
    }
    if (!chengzuPhone) {
      util.showToast('请填写租客电话')
      return
    }
    util.request("v2/rentservice/complaint_letter/insert", {
      "id":id,
      "houseId": houseInfo.houseId,
      "repairServiceContent": repairServiceContent,//
      "customerCalls": chengzuPhone,//联系电话
      "customer":chengzuName,//（申请人）客户姓名
    }, 'POST').then((res) => {
      util.showToast('操作成功～')
      setTimeout(() => {
        wx.navigateBack({
          delta: 1 // 返回上一级页面。
        })
      }, 1000)
    }).catch((err) => {
      console.log(err)
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