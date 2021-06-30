// pages/contractdetail/index.js

const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1,
    islook:true,
    isSign:false,
    text:'进行电子签约'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdetail(options.data)
    this.getrae(options.data)
    this.getProperty(options.data)
    this.getSignStatus(options.data)
    this.setData({
      id:options.data
    })
  },

  getrae(id){
    const that = this;
    util.request(`v2/balance/table_balance_sheet/get_compact_list`, {
      indentChengzuId:id
    }).then((res) => {
      that.setData({
        list:res.list
      })
    }).catch((err) => {
      console.log(err)
    })
  },

  getProperty(id){
    const that = this;
    util.request(`v2/house/house_delivery/get`, {
      compactId:id
    }).then((res) => {
      that.setData({
        property:res.meterDetaile
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  dateAdd (startDate,days) {
    startDate = new Date(startDate);
    startDate = +startDate + days * 1000 * 60 * 60 * 24;
    startDate = new Date(startDate);
    var nextStartDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate();
    return nextStartDate;
  },
  getdetail(id){
    const that = this;
    util.request(`v2/compact/chengzu/get_by_id`, {
      id,
      isGetFuzeren :1,
      isGetHeZuRen :1,
      isGetChengZuRen :1,
      isGetHouse :1
    }).then((res) => {
      that.setData({
        item:res,
        tuizudate:that.dateAdd(res.tuiOrWeiDate,1)
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  call(e){
    wx.makePhoneCall({
      phoneNumber:  e.currentTarget.dataset.phone
    })
  },
  select(e){
    this.setData({
      active:e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  look(){
    const that = this;
    util.request(`v2/contract/electronic_contract/contract_print`, {
      "id": that.data.item.id,
      "type":that.data.item.compactType
    }).then((res) => {
      that.openFile(res)
    }).catch((err) => {
      console.log(err)
    })
  },
  sign(){
    var that = this
    var count = 120;
    this.setData({
      isSign:true
    },()=>{
      util.request(`v2/contract/electronic_contract/contract_template_print`, {
        id:that.data.id,
        type:2
      }).then((res) => {
        util.showToast('短信发送成功，请勿重复操作！')
      //   var thisInterval = setInterval(function () {
      //     count--;
      //     if (count == 0) {
      //         clearInterval(thisInterval)
      //         this.setData({
      //           text:'进行电子签约',
      //           isSign:true
      //         })
      //     } else {
      //         var text = count + "s后可再次获取"
      //         that.setData({
      //           text,
      //         })
      //     }

      // }, 1000)
      }).catch((err) => {
        console.log(err)
      })
    })
   
  },
  getSignStatus(id){
    const that = this;
    util.request(`v2/contract/electronic_contract/contractInfo`, {
      id,
      type:1
    }).then((res) => {
      if(res==5){
        util.request(`v2/contract/electronic_contract/selcontract`, {
          id,
          type:1
        }).then((re) => {
          that.setData({
            islook:false,
            isSign:true,
            url:re
          })
        }).catch((err) => {
          console.log(err)
        })
      } 
      if(res.status.code == 300){
        if (that.data.item.contractAuditStatus != 2) {
          this.setData({  
            isSign:true
          })
       }
      }
    }).catch((err) => {
      console.log(err)
    })
  },

  lookhetong(){
    this.openFile(this.data.url)
  },

  lookxieyi(){
    this.openFile(this.data.item.zukeProtocolUrl)
  },

  openFile(url){
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: url,
      success: function (re) {
        const filePath = re.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType:'pdf',
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },
  yulanxieyi(){
    var that = this
    util.request(`v2/contract/electronic_contract/tzxy_preview`, {
      id:that.data.id,
    }).then((re) => {
     that.openFile(re)
    }).catch((err) => {
      console.log(err)
    })
  },

  signxieyi(){
    var that = this
    util.request(`v2/contract/electronic_contract/tzxy_sign_send`, {
      id:that.data.id,
    }).then((re) => {
      util.showToast('短信发送成功，请勿重复操作！')
    }).catch((err) => {
      console.log(err)
    })
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