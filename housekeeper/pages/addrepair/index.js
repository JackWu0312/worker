// pages/revenue/index.js
const util = require("../../utils/util.js");
import dateTimePicker from '../../utils/dateTimePicker.js';
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
    fileList: [],
    money:'',
    houseInfo:null,
    degree:2,

   
    dateTime: null,
    dateTimeArray: null,
    endYear: new Date().getFullYear() + 20
  },
  changeDateTime(e) {
    // arr此处使用新数据，否则数据不刷新
    var arr = e.detail.value, dateArr = this.data.dateTimeArray;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    let showDate = `${dateArr[0][arr[0]]}-${dateArr[1][arr[1]]}-${dateArr[2][arr[2]]} ${dateArr[3][arr[3]]}:${dateArr[4][arr[4]]}`;
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      showDate: showDate
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var obj = dateTimePicker.dateTimePicker('', this.data.endYear, this.data.showDate);
    this.getMark()
    this.setData({
      nickName: wx.getStorageSync('info').nickName,
      phone: wx.getStorageSync('info').phone,
      id:util.getUUID(),
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      showDate: that.formatDateTime('yyyy-MM-dd hh:mm', new Date()),
    });
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
  
  rax(e) {
    this.setData({
      indentType: e.currentTarget.dataset.rax
    })
  },
  raxdegree(e){
    this.setData({
      degree: e.currentTarget.dataset.rax
    })
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
    var list =this.data.fileList
    this.delImg(list[e.detail.index].id)
    list.splice(e.detail.index, 1)
    that.setData({
      fileList: list
    });
  },
  afterRead(event) {
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
        var fileobj = that.data.fileList
        fileobj.push({
          id,
          big: JSON.parse(res.data).url,
          url: JSON.parse(res.data).url
        });
        that.saveImg({
          id,
          tblId: that.data.id, //根据id获取附件
          type: 122, //图片类型
          subType: 1, //图片子分类
        })
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
  bindnickName(){
    this.setData({
      nickName: e.detail.value
    })
  },
  bindphone(){
    this.setData({
      phone: e.detail.value
    })
  },
  bindchengzuName(){
    this.setData({
      chengzuName: e.detail.value
    })
  },
  bindchengzuPhone(){
    this.setData({
      chengzuPhone: e.detail.value
    })
  },
  bindrepairServiceContent(e){
    this.setData({
      repairServiceContent: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  sure(){
    var {
      id,
      houseInfo,
      indentType,
      nickName,
      phone,
      degree,
      chengzuName,
      chengzuPhone,
      showDate,
      repairServiceContent,
      typeId
    } = this.data
    if (!houseInfo) {
      util.showToast('请选择房源')
      return
    }
    if(indentType==1){
      if (!nickName) {
        util.showToast('请填写联系人')
        return
      }
      if (!phone) {
        util.showToast('请填写联系电话')
        return
      }
    }else{
      if (!chengzuName) {
        util.showToast('请填写租客姓名')
        return
      }
      if (!chengzuPhone) {
        util.showToast('请填写租客电话')
        return
      }
    }
    if(!typeId){
      util.showToast('请选择维修类型')
      return
    }
    util.request("v2/rentservice/table_web_repair/save", {
      "id":id,   //保洁id
      "status": "1",
      "customerCalls": indentType==1?phone:chengzuPhone,//联系电话
      "expectCompletionTime":showDate,//预计维修时间
      "degree": degree,//紧急程度-1紧急 2一般（默认）
      "type": indentType,//任务来源-1公司 2租户（默认）
      "repairContent": "",//维修内容
      "repairServiceContent": repairServiceContent,//备注
      "customer": indentType==1?nickName:chengzuName,//（申请人）客户姓名
      "houseId": houseInfo.houseId,//房源编号
      "repairTypeId":typeId
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

  depositall(){
    wx.navigateTo({
      url: `/pages/depositall/index`
    });
  },
  onClose() {
    const me = this
    this.setData({
      show: !me.data.show
    })
  },
  getMark() {
    var that = this
    util.request(`v2/sys/zi_dian/get_list_by_mark`, {
      mark: '0dc1fd1a-2991-4f43-8497-a144b644b3f0'
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
  /*
 * 格式化时间
 */
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