// pages/iaed/index.js
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getMark(JSON.parse(options.data))
    this.setData({
      obj:JSON.parse(options.obj)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  save(){
    var obj = this.data.obj
    obj.shouZhiList=this.data.list.map((val)=>{
        var objNew ={
          id: "", //收支ID
            typeId: val.feiYongTypeId, //费用类型ID
            beginTime: val.bqBeginDate, //费用开始时间
            endTime: val.bqEndDate, //费用截止时间
            predictTime: val.bqBackPayDate, //预计处理时间
            type: val.type, //收支类型(支出，收入)
            money:val.bqMonthMoney, //金额
            desc: val.bqMonthMoney, //描述
            isIncludeDJ:0
        }
        return objNew
    })
    if(obj.hetongType==1){
      this.saveHeTongLuRuData(obj)
    }else{
      this.saveXuQianData(obj)
    }
  },
  saveXuQianData(obj){
    util.request(`v2/compact/chengzu/renew`, obj).then((res) => {
     util.showToast('续签成功！')
     setTimeout(() => {
       wx.navigateBack({
         delta: 3 // 返回上一级页面。
       })
     }, 2000);

   }).catch((err) => {
     console.log(err)
   })
  },
  saveHeTongLuRuData(obj){
     util.request(`v2/compact/chengzu/sign_contract`, obj).then((res) => {
      util.showToast('合同录入成功！')
      setTimeout(() => {
        wx.navigateBack({
          delta: 3 // 返回上一级页面。
        })
      }, 2000);

    }).catch((err) => {
      console.log(err)
    })
  },
  getMark(obj) {
    var that = this
    util.request(`v2/sys/zi_dian/get_list_by_mark`, {
      mark: '93e9ae54-12b6-47ad-9419-11514d8c1712'
    }).then((res) => {
      that.getlist(obj,res.list)
      
    }).catch((err) => {
      console.log(err)
    })
  },

  getlist(obj,listkey){
    const that = this;
    util.request(`v2/compact/chengzu/anticipated_revenue`, obj).then((res) => {
      if(res.list.length>0){
      that.setData({
        list: res.list.map((val)=>{
          for (let i = 0; i < listkey.length; i++) {
            if(val.feiYongTypeId==listkey[i].id){
              val.key = listkey[i].key
              break
            }
          }
          return val
        })
      })
    }
    }).catch((err) => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  revenue(e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: item ? `/pages/ieaddetail/index?item=${JSON.stringify(item)}&index=${ e.currentTarget.dataset.index}` : `/pages/ieaddetail/index`
    });
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