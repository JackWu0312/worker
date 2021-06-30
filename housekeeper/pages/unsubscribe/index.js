// pages/unsubscribe/index.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList:[],
    indentType:1,
    showdate: false,
    minDate: new Date(2019, 0, 1).getTime(),
    maxDate: new Date(2030, 0, 31).getTime(),
    defaultDate: new Date().getTime(),
    imageList:[],
    money:0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =  this
    this.getDetail(options.id)
    this.setData({
      shoudingStatus:options.options,
      defaultDateFormat:that.formatDate(that.data.defaultDate)
    })
  },
  intent(e){
    this.setData({
        indentType: e.currentTarget.dataset.type
    })
  },
  onDisplay(e) {
    this.setData({
      showdate: true,
    });
  },
  getDetail(id){
    var that = this
    util.request(`v2/house/house_shouding/get`, {
      houseId:id,
    }).then((res) => {
      that.setData({
        value:res,
        fileList:res.picList.map((val)=>{
          val.url=val.big
          return val
        })
      })
    }).catch((err) => {
      console.log(err)
    })
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
      this.setData({
        showdate: false,
        defaultDateFormat: this.formatDate(event.detail),
      });
  },

  deleteImg(e) {
    var list = this.data.imageList
    list.splice(e.detail.index, 1)
    this.setData({
      imageList: list
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
        var fileobj = that.data.imageList
        fileobj.push({
          big: JSON.parse(res.data).url,
          url:JSON.parse(res.data).url
        });
        that.setData({
          imageList: fileobj
        });
      },
    });
  },
  sure(){
    var that = this
    const {value,note,shoudingStatus,indentType,defaultDateFormat,money ,imageList} = this.data
    util.request(`v2/house/house_shouding/return_reservation`, {
      id:value.id,
      shoudingStatus:shoudingStatus,
      indentType,
      note,
      predictTime:defaultDateFormat,
      money ,
      picList:imageList,
      remark :value.remark
    }).then((res) => {
      util.showToast('操作成功～')
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        }) 
      },1000)
    }).catch((err) => {
      console.log(err)
    })
  },

  bindNote(e) {
    this.setData({
      note: e.detail.value
    })
  },
  bindMoney(e) {
    this.setData({
      money: e.detail.value
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