// pages/together/index.js
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    columns:[],
    columnsMode:['一次付清','随房租付','月付','季付','半年付','年付'],
    listTypeMode:[0,-1,1,3,6,12],
    showMode:false,
    feiYongMoney:'',
    feiYongDesc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.item){
      var item = JSON.parse(options.item)
      this.setData({
        feiYongTypeId:item.feiYongTypeId, //其他费用类型id
        fuKuanType:item.fuKuanType, //其他费用付款方式
        feiYongMoney:item.feiYongMoney, //其他费用金额
        feiYongDesc:item.feiYongDesc, //其他费用备注
        type:item.type,
        typeMode:item.typeMode,
        index:options.index,
      })
    }
    this.getMark()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindMoney(e){
    this.setData({
      feiYongMoney: e.detail.value
    })
  },
  bindRemark(e){
    this.setData({
      feiYongDesc: e.detail.value
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
      feiYongTypeId: that.data.listType[index],
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
      feiYongTypeId: that.data.listType[index],
      type: value
    }, () => {
      that.onClose()
    })
  },
  onCloseMode() {
    const me = this
    this.setData({
      showMode: !me.data.showMode
    })
  },
  onChangeMode(event) {
    const {
      value,
      index
    } = event.detail;
    var that = this
    this.setData({
      fuKuanType: that.data.listTypeMode[index],
      typeMode: value
    })
  },
  onConfirmMode(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      fuKuanType: that.data.listTypeMode[index],
      typeMode: value
    }, () => {
      that.onCloseMode()
    })
  },
  getMark() {
    var that = this
    util.request(`v2/sys/zi_dian/get_list_by_mark`, {
      mark: '93e9ae54-12b6-47ad-9419-11514d8c1712'
    }).then((res) => {
      that.setData({
        listType: res.list.map((val)=>{
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

  onShow: function () {

  },
  
  save() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    var list = prevPage.data.otherFeeData
    var index = this.data.index
    const {feiYongTypeId,fuKuanType,feiYongMoney,feiYongDesc,type,typeMode} = this.data
    var obj = {
      feiYongTypeId, //其他费用类型id
      fuKuanType, //其他费用付款方式
      feiYongMoney, //其他费用金额
      feiYongDesc, //其他费用备注
      type,
      typeMode,
      id:util.getUUID()
    }
    if (index) {
      list.splice(index, 1, obj)
    } else {
      list.push(obj)
    }
    prevPage.setData({
      otherFeeData: list
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