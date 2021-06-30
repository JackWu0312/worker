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
    minDate: new Date(2019, 0, 1).getTime(),
    maxDate: new Date(2030, 0, 31).getTime(),
    defaultDate: new Date().getTime(),
    fileList: [],
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
        indentType:item.shouZhiType,
        money:item.money,
        desc:item.desc,
        beginTime:item.beginTime,
        endTime:item.endTime,
        time: `${item.beginTime} - ${item.endTime}`
      })
    }
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
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },

  onConfirmdate(event) {
    const [start, end] = event.detail;
    this.setData({
      showdate: false,
      time: `${this.formatDate(start)} - ${this.formatDate(end)}`,
      beginTime:this.formatDate(start),
      endTime:this.formatDate(end)
    });
    // }
  },

  deleteImg(e) {
    var list = this.data.fileList
    list.splice(e.detail.index, 1)
    this.setData({
      fileList: list
    })
  },
  afterRead(event) {
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
          big: JSON.parse(res.data).url,
          url: JSON.parse(res.data).url
        });
        that.setData({
          fileList: fileobj
        });
      },
    });
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
    const {indentType,beginTime,endTime,money,desc,fileList,typeId,type,index} = this.data
    var obj = {
      beginTime,
      endTime,
      money,
      desc,
      shouZhiType:indentType,
      picList:fileList,
      moneyTypeId:typeId,
      key:type,
      typeId
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var list = prevPage.data.list;
    var total =0.0
    if(index){
      list.splice(index,1,obj)
    }else{
      list.push(obj) 
    }
    for (let i = 0,len= list.length; i < len; i++) {
      if(list[i].shouZhiType==2){
        total=total-Number( list[i].money)
      }else {
        total=total+Number( list[i].money)
      }
    }
    prevPage.setData({
      list,
      total
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