// pages/modify/index.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    columns: ['业务员', '文秘', '呼叫中心文秘', '管家'],
    certificateType: 0,
    type: '业务员',
    backInfo:null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.data){
      var data = JSON.parse(options.data)
      this.setData({
        index:options.index,
        type:data.value,
        certificateType:data.type,
        backInfo:{
          id: data.id,
          nickName:data.nickName,
        }
      })
    }
  },
  sure(){
    if(this.data.backInfo.id){
      const {certificateType,backInfo,type,index} = this.data
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      var list = prevPage.data.list
      var obj={
        type:certificateType,
        userid :backInfo.id,
        t_fzr_name:backInfo.nickName,
        t_fzr_position :type
      }
      if(index){
        list.splice(index,1,obj)
      }else{
        list.push(obj) 
      }
      prevPage.setData({
        list
      },()=>{
        wx.navigateBack({
          delta: 1 // 返回上一级页面。
        })
      })
    }else{
      util.showToast('请选择业务员～')
    }

   
  },
  onClose() {
    const me = this
    this.setData({
      show: !me.data.show
    })
  },
  selepeople(){
    wx.navigateTo({
      url: `/pages/selepeople/index`
    });
  },
  onChange(event) {
    const {
      value,
      index
    } = event.detail;
    this.setData({
      certificateType: index,
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
      certificateType: index,
      type: value
    }, () => {
      that.onClose()
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