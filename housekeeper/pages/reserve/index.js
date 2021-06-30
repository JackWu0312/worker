// pages/reserve/index.js
const util = require("../../utils/util.js");
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    columns: ['身份证', '护照', '港澳通行证', '台湾同胞证'],
    show: false,
    indentType: 1,
    showdate: false,
    minDate: new Date(2019, 0, 1).getTime(),
    maxDate: new Date(2030, 0, 31).getTime(),
    defaultDate: new Date().getTime(),
    time: 1,
    certificateType: 1,
    type: '身份证',
    fileList: [],
    list: [],
    zukeName: '',
    zukePhone: '',
    zukeSfz: ''
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
          url:JSON.parse(res.data).url
        });
        that.setData({
          fileList: fileobj
        });
      },
    });
  },
  onDisplay(e) {
    this.setData({
      showdate: true,
      time: e.currentTarget.dataset.time
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
    if (this.data.time == 1) {
      this.setData({
        showdate: false,
        acceptDate: this.formatDate(event.detail),
      });
    } else {
      this.setData({
        showdate: false,
        endtime: this.formatDate(event.detail),
      });
    }
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
    this.setData({
      certificateType: index + 1,
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
      certificateType: index + 1,
      type: value
    }, () => {
      that.onClose()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      address: options.address,
      houseId: options.id,
      shoudingStatus:options.shoudingStatus
    })
  },

  bindName(e) {
    this.setData({
      zukeName: e.detail.value
    })
  },
  bindMoney(e) {
    this.setData({
      money: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      zukePhone: e.detail.value
    })
  },
  bindSfz(e) {
    this.setData({
      zukeSfz: e.detail.value
    })
  },
  bindRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  modify(e) {
    if (e.currentTarget.dataset.type == 0) {
      wx.navigateTo({
        url: `/pages/modify/index`
      });
    } else {
      wx.navigateTo({
        url: `/pages/modify/index?data=${JSON.stringify(e.currentTarget.dataset.item)}&index=${e.currentTarget.dataset.index}`
      });
    }
  },

  sure() {
    const that = this;
    const {
      houseId,
      zukeName,
      zukePhone,
      zukeSfz,
      indentType,
      money,
      endtime,
      acceptDate,
      remark,
      fileList,
      list,
      certificateType,
      shoudingStatus
    } = this.data

    if(!zukeName){
      util.showToast('请输入租客姓名！')
      return;
    }
    var reg = /^1[0-9]{10}$/; //验证规则

    if(!reg.test(zukePhone)){
      util.showToast('请输入正确的手机号码！')
      return;
    }
    if(!zukeSfz){
      util.showToast('请输入证件号！')
      return;
    }

    if(!money){
      util.showToast('请输入定金！')
      return;
    }
    if(!acceptDate){
      util.showToast('请选择定金失效时间！')
      return;
    }
    if(!money){
      util.showToast('请选择签约时间！')
      return;
    }
    if(list.length==0){
      util.showToast('请添加收定人！')
      return;
    }
    util.request(`v2/house/house_shouding/insert`, {
      houseId,
      zukeName,
      zukePhone,
      zukeSfz,
      indentType,
      money,
      endtime,
      acceptDate,
      remark,
      fuZeRenList:list,
      certificateType,
      picList:fileList,
      shoudingStatus
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