// pages/clean/index.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabActive: 1,
    backInfo: null,
    fileList: [{
      url: 'http://lianfayouthoss.oss-cn-shenzhen.aliyuncs.com/_1356bc30-4c3d-4bb6-a379-56534b48f9e7_b.png'
    }],
    pageNo: 1,
    pageSize: 10,
    totalPage: 0,
    list: [],
    houseId: '',
    queryOverDueData:''
  },
  people() {
    wx.navigateTo({
      url: `/pages/selepeople/index?type=1`
    });
  },
   getList() {
    var that = this
    const {
      pageNo,
      pageSize,
      tabActive,
      houseId,
      backInfo,
      queryOverDueData
    } = this.data
    util.request(`v2/rentservice/table_clean/get_list`, {
      "departmentId": backInfo?backInfo.dptmId:'', //房屋负责人部门id
      "jjrUserId":  backInfo?backInfo.id:'', //房屋负责人人员id
      "status": tabActive==6?'':tabActive, //状态筛选
      "houseId": houseId, //房源id
      "likeName": '',
      "grade": '', //评价
      "expectCompletionTimeStart": '',
      "expectCompletionTimeEnd": '',
      queryOverDueData:queryOverDueData,
      pageNo,
      pageSize
    }).then((res) => {
      that.setData({
        list: that.data.list.concat(res.list),
        totalPage: res.totalPage
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  addclean() {
    wx.navigateTo({
      url: `/pages/addclean/index`
    });
  },

  work(e) {
    wx.navigateTo({
      url: `/pages/work/index?id=`+e.currentTarget.dataset.id
    });
  },
  bindTabActive(e) {
    var that = this
    this.setData({
      pageNo: 1,
      list: [],
      tabActive: e.currentTarget.dataset.index,
      queryOverDueData:e.currentTarget.dataset.index==6?1:''
    },()=>{
      that.getList()
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    this.setData({
      pageNo: 1,
      list: [],
    },()=>{
      this.getList()
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
    var that = this
    const { totalPage ,pageNo,} = this.data
    if(pageNo<=totalPage){
      this.setData({
        pageNo:pageNo+1
      },()=>{
        that.getList()
      })
    }else{
      util.showToast('暂无更多数据！')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})