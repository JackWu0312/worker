// pages/work/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import dateTimePicker from '../../utils/dateTimePicker.js';
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    fileListall: [],
    columnsCost: [],
    fileListwanc:[],
    show: false,
    active: 1,
    showcomplete: false,
    showtest: false,
    zhifuTypeId: '',
    backInfo: null,
    chengdanType: 1,
    dateTime: null,
    dateTimeArray: null,
    radio:false,
    degree:2,
    // endYear: new Date().getFullYear() + 20
  },

 
  select(e) {
    this.setData({
      active: e.currentTarget.dataset.type,
      // chengdanType: 1
    })
  },
  selectchengdanType(e) {
    this.setData({ 
      degree: e.currentTarget.dataset.type
    })

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options.id)
    this.baoJieFuJian(options.id)
    // // var that = this
    // var obj = dateTimePicker.dateTimePicker('', this.data.endYear, this.data.showDate);
    // this.setData({
    //   dateTime: obj.dateTime,
    //   dateTimeArray: obj.dateTimeArray,
    //   // showDate: that.formatDateTime('yyyy-MM-dd hh:mm', new Date()),
    // });
  },
  getDetail(id) {
    var that = this
    util.request("v2/rentservice/complaint_letter/get_by_id", {
      id,
    }, 'POST').then((res) => {
      that.setData({
        val: res
      })
    }).catch((err) => {
      console.log(err)
    })
  },

  baoJieFuJian(id) {
    var that = this
    util.request("v2/accessory/pic/get_list", {
      tblId: id, //根据id获取附件
      type: 125, //图片类型
      subType: 2, //图片子分类
      pageNo: 1,
      pageSize: 30,
    }, 'POST').then((res) => {
      that.setData({
        fileList: res.list.map((val) => {
          var obj = {
            url: val.big
          }
          return obj
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  },



  test() {
    this.setData({
      showtest: !this.data.showtest
    })
  },
  onClosecomplete() {
    this.setData({
      showcomplete: !this.data.showcomplete
    })
  },

  onClose() {
    this.setData({
      show: !this.data.show
    })
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  


  
  bindRemark(e) {
    this.setData({
      repairContentJjr: e.detail.value
    })
  },

  bindcheckRemark(e){
    this.setData({
      checkRemark: e.detail.value
    })
  },
  bindrepairDetail(e) {
    this.setData({
      repairDetail: e.detail.value
    })
  },
  save() {
    var {
      active,
      repairContentJjr,
      val,
      repairDetail,
      backInfo,
      degree
    } = this.data
    if (active == 1) {
      if (!backInfo) {
        util.showToast('请选择人员')
        return
      }
      util.request("v2/rentservice/complaint_letter/send_orders", {
        repairContentJjr,
        id: val.id,
        degree:degree,
        personsInvolvedId: backInfo.id //任务对象
      
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
    } else if (active == 2) { 
      util.request("v2/rentservice/complaint_letter/my_handle_orders", {
        id: val.id,
        repairDetail
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
    } 
  },
  sure() {
    var {
      val,
      repairDetail,
    } = this.data
    util.request("v2/rentservice/complaint_letter/finish_orders", {
      "id": val.id,
      "repairDetail": repairDetail 
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
  saveyan(){
    var {
      val,
      checkRemark
    } = this.data
    util.request("v2/rentservice/complaint_letter/check_orders", {
      id:val.id,        //保洁ID
      checkRemark:checkRemark     //验收备注
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


  selepeople() {
    wx.navigateTo({
      url: `/pages/selepeople/index`
    });
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
    var type = e.currentTarget.dataset.type
    var list = type==1?this.data.fileListall:this.data.fileListwanc
    this.delImg(list[e.detail.index].id)
    list.splice(e.detail.index, 1)
    if(type==1){
      that.setData({
        fileListall: list
      });
    }else if(type==2){
      that.setData({
        fileListwanc: list
      });
    } 
  },
  afterRead(event) {
    var type = event.currentTarget.dataset.type
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
        var fileobj = type==1?that.data.fileListall:that.data.fileListwanc
        fileobj.push({
          id,
          big: JSON.parse(res.data).url,
          url: JSON.parse(res.data).url
        });
        that.saveImg({
          id,
          tblId: that.data.val.id, //根据id获取附件
          type: 125, //图片类型
          subType: 2, //图片子分类
        })
        if(type==1){
          that.setData({
            fileListall: fileobj
          });
        }else if(type==2){
          that.setData({
            fileListwanc: fileobj
          });
        }
      },
    });
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
  formatDateTime(fmt, date) {
    var o = {
      "M+": date.getMonth() + 1, //月份   
      "d+": date.getDate(), //日   
      "h+": date.getHours(), //小时   
      "m+": date.getMinutes(), //分   
      "s+": date.getSeconds(), //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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