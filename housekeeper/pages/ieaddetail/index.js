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
    showdate: false,
    showtime:false,
    minDate: new Date(2019, 0, 1).getTime(),
   
    defaultDate: new Date().getTime(),
    money:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.item){
      var item = JSON.parse(options.item)
      this.setData({
        item,
        index:options.index,
        indentType:item.type,
        type:item.key,
        typeId:item.feiYongTypeId,
        money:item.bqMonthMoney,
        desc:item.feiYongDesc,
        beginTime:item.bqBeginDate,
        endTime:item.bqEndDate,
        timenew:item.bqBackPayDate,
        time: `${item.bqBeginDate} - ${item.bqBeginDate}`
      })
    }
    this.setData({
      maxDate: new Date(2028, 0, 31).getTime()
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

  onDisplay() {
    this.setData({
      showdate: true,
    });
  },

  onClosedate() {
    this.setData({
      showdate: false
    });
  },

  onConfirmdate(event) {
    const [start, end] = event.detail;
    this.setData({
      showdate: false,
      time: `${this.formatDate(start)} - ${this.formatDate(end)}`,
      beginTime:this.formatDate(start),
      endTime:this.formatDate(end)  
    });
  },

  onDisplayTime() {
    this.setData({
      showtime: true,
    });
  },

  onClosedateTime() {
    this.setData({
      showtime: false
    });
  },

  onConfirmdateTime(event) {
    this.setData({
      showtime: false,
      timenew: this.formatDate(event.detail),
    });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },


  bindMoney(e) {
    this.setData({
      money: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  sure(){
    const {indentType,beginTime,endTime,money,desc,typeId,type,index,timenew} = this.data
    // var obj = {
    //   beginTime,
    //   endTime,
    //   money,
    //   desc,
    //   shouZhiType:indentType,
    //   moneyTypeId:typeId,
    //   key:type,
    //   typeId
    // }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var list = prevPage.data.list;
    if(index){
      var objlist = list[index]
      objlist.type=indentType
      objlist.key=type
      objlist.feiYongTypeId=typeId
      objlist.bqMonthMoney=money
      objlist.feiYongDesc=desc
      objlist.bqBeginDate=beginTime
      objlist.bqEndDate=endTime
      objlist.bqBackPayDate=timenew
      list.splice(index,1,objlist)
    }
    // else{
    //   list.push(obj) 
    // }
    prevPage.setData({
      list,
    },()=>{
      wx.navigateBack({
        delta: 1 // 返回上一级页面。
      })
    })



  },
  bindRemark(e) {
    this.setData({
      desc: e.detail.value
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