// pages/refund/index.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showdate: false,
    minDate: new Date(2019, 0, 1).getTime(),
    maxDate: new Date(2030, 0, 31).getTime(),
    tuiZuType: 0,
    listType: [],
    list: [],
    columns: [],
    show:false,
    showmuban:false,
    columnsmuban:[],
    isshow:false
  },
  showAll(){
    this.setData({
      isshow:!this.data.isshow
    })
  },
  onClosemuban() {
    const me = this
    this.setData({
      showmuban: !me.data.showmuban
    })
  },
  onChangemuban(event) {
    const {
      value,
      index
    } = event.detail;
    var that = this
    this.setData({
      quitReason: that.data.listTemplate[index].id ,
      typemuban: value
    })
  },
  onConfirmmuban(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      quitReason: that.data.listTemplate[index].id ,
      typemuban: value
    }, () => {
      that.onClosemuban()
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
      quitReason: that.data.listReason[index].id ,
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
      quitReason: that.data.listReason[index].id ,
      type: value
    }, () => {
      that.onClose()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.getMark()
    this.getReason()
    this.getTemplate()
    this.getDeatil(options.chengZuId)
    this.setData({
      chengzuId: options.chengZuId,
      adress: options.adress,
      shoudingStatus: options.shoudingStatus,
      // defaultDateFormat:that.formatDate(that.data.defaultDate)
    }, () => {
      that.getRent()
      that.getcost()
    })
  },
  getDeatil(id) {
    var that = this
    util.request(`v2/compact/chengzu/get_by_id`, {
      id,
    }).then((res) => {
      var tuiZuType = 0
      if (new Date().getTime() < new Date(res.endTime).getTime()) {
        tuiZuType = 1
      }
      that.setData({
        val: res,
        tuiZuType,
        defaultDate: new Date(res.endTime).getTime(),
        defaultDateFormat: res.endTime
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
  onDisplay(e) {
    this.setData({
      showdate: true,
    });
  },
  getRent() {
    var that = this
    const {
      listType
    } = this.data
    const {
      tuiZuType,
      chengzuId,
      defaultDateFormat
    } = this.data
    util.request(`v2/compact/chengzu/violation_calculate`, {
      tuiZuType,
      chengzuId,
      tuiOrWeiDate: defaultDateFormat
    }).then((res) => {
      var list = res.list.map((val) => {
        for (let i = 0; i < listType.length; i++) {
          if (val.moneyTypeId == listType[i].id) {
            val.key = listType[i].key
            val.typeId=listType[i].id
            break
          }
        }
        return val
      })
      that.setData({
        list,
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getcost() {
    var that = this
    const {
      chengzuId
    } = this.data
    util.request(`v2/balance/table_balance_sheet/get_zuke_tbs_by_chengzu_id`, {
      chengzuId,
    }).then((res) => {
      that.setData({
        costList: res.list
      });
    }).catch((err) => {
      console.log(err)
    })
  },

  getReason() {
    var that = this
    util.request(`v2/sys/zi_dian/get_list_by_mark`, {
      mark: 'ae94db82-3397-4b19-8613-0ebed777be80'
    }).then((res) => {
      that.setData({
        listReason: res.list,
        columns: res.list.map((val) => {
          return val.key
        }),
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getTemplate(){
    var that = this
    util.request(`v2/dynamicTemplate/contract_template/get_list`,{
      pageNo: 1,
      pageSize: 999,
      type: 3,
    }).then((res) => {
      that.setData({
        listTemplate: res.list,
        columnsmuban: res.list.map((val) => {
          return val.contractTemplateName
        }),
      })
    }).catch((err) => {
      console.log(err)
    })
  },

  getMark() {
    var that = this
    util.request(`v2/sys/zi_dian/get_list_by_mark`, {
      mark: '93e9ae54-12b6-47ad-9419-11514d8c1712'
    }).then((res) => {
      that.setData({
        listType: res.list
      }, () => {
        that.getRent()
      })
    }).catch((err) => {
      console.log(err)
    })
  },

  revenue(e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: item ? `/pages/revenue/index?item=${JSON.stringify(item)}&index=${ e.currentTarget.dataset.index}` : `/pages/revenue/index`
    });
  },

  bindRemark(e) {
    this.setData({
      tuiOrWeiRemark: e.detail.value
    })
  },
  sure() {
    const {
      chengzuId,
      shoudingStatus,
      list,
      tuiZuType,
      tuiOrWeiRemark,
      quitReason,
      defaultDateFormat,
      // fileList
    } = this.data
    util.request(`v2/compact/chengzu/contributions`, {
      id: chengzuId,
      tuiOrWeiDate: defaultDateFormat,
      tuiOrWeiRemark,
      tuizuType: tuiZuType,
      quitReason,
      shouZhiList: list,
      // picList: fileList,
      shoudingStatus: shoudingStatus
    }).then((res) => {
      util.showToast('退租成功～')
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }).catch((err) => {
      console.log(err)
    })
  },


  // deleteImg(e) {
  //   var list = this.data.fileList
  //   list.splice(e.detail.index, 1)
  //   this.setData({
  //     fileList: list
  //   })
  // },
  // afterRead(event) {
  //   var that = this
  //   const {
  //     file
  //   } = event.detail;
  //   // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  //   wx.uploadFile({
  //     url: util.imgHost, // 仅为示例，非真实的接口地址
  //     filePath: file.url,
  //     name: 'image',
  //     formData: {
  //       user: 'test'
  //     },
  //     success(res) {
  //       var fileobj = that.data.fileList
  //       fileobj.push({
  //         big: JSON.parse(res.data).url,
  //         url: JSON.parse(res.data).url
  //       });
  //       that.setData({
  //         fileList: fileobj
  //       });
  //     },
  //   });
  // },
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