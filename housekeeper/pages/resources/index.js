// pages/resources/index.js
const app = getApp()
const util = require("../../utils/util.js");
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    active: 1,
    show: false,
    tabActive: 5,
    pageNo: 1,
    pageSize: 10,
    totalPage: 0,
    list: [],
    pool:[],
    houseInfo: null,
    showMode:false,
    showSquare:false,
    columnsMode:["全部","公寓租赁","商业租赁"],
    columnsSquare:["全部","个人","企业"],
    demand:0,
    type:0
  },

  showPopup(e) {
    this.setData({
      show: true,
      houseInfo: null,
      shoudingId: e.currentTarget.dataset.id
    });
  },
  onCloseMode() {
    const me = this
    this.setData({
      showMode: !me.data.showMode
    })
  },
 
  onConfirmMode(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      demand: index==2?3:index,
      demandType: value
    }, () => {
      that.setData({
        pageNo: 1,
        pool:[],
      },()=>{
        that.onCloseMode()
        that.getpool()
      })
    })
  },

  onCloseSquare() {
    const me = this
    this.setData({
      showSquare: !me.data.showSquare
    })
  },
 
  onConfirmSquare(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      type: index,
      typeType: value
    }, () => {
      that.setData({
        pageNo: 1,
        pool:[],
      },()=>{
        that.onCloseSquare()
        that.getpool()
      })
    })
  },

  getpool(){
    var that = this
    const {
      pageNo,
      pageSize,
      demand,
      type
    } = this.data
    util.request(`v2/resource/customer_pool/search`, {
      demand, // 需求类型
      type, // 客户类型
      keywords: null, // 搜索关键字
      pageNo,
      pageSize
    }).then((res) => {
      that.setData({
        pool: that.data.pool.concat(res.list),
        totalPage: res.totalPage
      })
    }).catch((err) => {
      console.log(err)
    })
  },




  onClose() {
    this.setData({
      show: false
    });
  },
  bindActive(e) {
    var that = this
    this.setData({
      active: e.currentTarget.dataset.index,
      pageNo: 1,
      list: [],
      pool:[], 
    },()=>{
      if(that.data.active==1){
        this.getpool();
      }else{
        this.getList();
      }
    })
  },
  bindTabActive(e) {
    var that = this
    this.setData({
      tabActive: e.currentTarget.dataset.index,
      list: [],
      pageNo: 1,
    }, () => {
      that.getList()
    })
  },


  deposit() {
    wx.navigateTo({
      url: `/pages/deposit/index`
    });
  },


  cancel(e) {
    var val = e.currentTarget.dataset.item
    const that = this;
    Dialog.alert({
      message: `是否取消预定？`,
      showCancelButton: true
    }).then(() => {
      util.request("v2/house/house_shouding/return_reservation", {
        id: val.id,
        balanceSheetId: val.tbsId,
        houseId: val.house.id,
        indentType: "2",
        money: "0",
        note: "",
        shoudingStatus: "0"
      }, 'POST').then((res) => {
        util.showToast('操作成功～')
        setTimeout(() => {
          that.setData({
            list: [],
            pageNo: 1,
          }, () => {
            that.getList()
          })
        }, 1000)
      }).catch((err) => {
        console.log(err)
      })
    }).catch(() => {});;
  },
  save() {
    var that = this
    const {
      houseInfo,
      shoudingId
    } = this.data
    util.request(`v2/house/house_shouding/shouding_active`, {
      houseId: houseInfo.houseId,
      shoudingId: shoudingId
    }).then((res) => {
      util.showToast('操作成功～')
      setTimeout(() => {
        that.setData({
          list: [],
          pageNo: 1,
          show: false
        }, () => {
          that.getList()
        })
      }, 1000)
    }).catch((err) => {
      console.log(err)
    })
  },

  sign(e){
    var hetongType =  1
    var item = e.currentTarget.dataset.item
    var hetongId = item.hetongId || item.chengZuId
    console.log(item)
    var str = `${item.house.quyuCName}${item.house.louNo}号楼${item.house.men}单元${item.house.fangNo}室${item.house.fangjianName=='整租'?'整租':item.house.fangjianName}${item.house.fangjianName=='整租'?'':'间'}`
    wx.navigateTo({
      url: `/pages/sign/index?hetongType=${hetongType}&address=${str}&houseId=${item.house.id}&parentId=${item.parenthouseId}&zujin=${item.house.zujin}&zuJinMin=${item.house.dijia}&hetongId=${hetongId}`
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    // app.editTabbar();
    if(this.data.active==1){
      this.getpool()
    }else{
      this.getList();
    }
  },
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  getList() {
    var that = this
    const {
      pageNo,
      pageSize,
      tabActive
    } = this.data
    util.request(`v2/house/house_shouding/get_house_shouding_list`, {
      keyWords: "",
      maxPreTime: "",
      minPreTime: "",
      overdueFlag: tabActive == 5 ? '' : tabActive,
      pageNo,
      pageSize
    }).then((res) => {
      var listAll = res.list.map((val) => {
        var myDate = new Date();
        var now = myDate.valueOf();
        var time = new Date(val.endtime).valueOf();
        if (val.isSign != 1 && val.isUnsubscribe != 1) {
          if (time >= now) {
            val.isYudingFlag = 1
          } else {
            val.isYudingFlag = 2
          }
        }

        if (time >= now) {
          val.isYuding = 1
        } else {
          val.isYuding = 2
        }
        return val
      })
      that.setData({
        list: that.data.list.concat(listAll),
        totalPage: res.totalPage
      })
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
    var that = this
    const {
      totalPage,
      pageNo,
    } = this.data
    if (pageNo < totalPage) {
      this.setData({
        pageNo: pageNo + 1
      }, () => {
        if(that.data.active==1){
          this.getpool();
        }else{
          this.getList();
        }
      })
    } else {
      util.showToast('暂无更多数据！')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})