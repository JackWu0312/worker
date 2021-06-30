// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    pageNo: 1,
    pageSize: 10,
    list: [],
    hasMore: true,
    listBar: [{
      "iconPath": "/static/tab_1_normal.png",
      "selectedIconPath": "/static/tab_1_active.png",
      "text": "未做工单"
    }, {
      "iconPath": "/static/tab_2_normal.png",
      "selectedIconPath": "/static/tab_2_active.png",
      "text": "历史工单"
    }, {
      "iconPath": "/static/tab_3_normal.png",
      "selectedIconPath": "/static/tab_3_active.png",
      "text": "个人中心"
    }]
  },
  tabChange(e) {
    console.log('tab change', e.detail)
    if (e.detail == 1) { //历史工单
      wx.reLaunch({
        url: '../history_order_repair/index',
      })
    } else if (e.detail == 2) { //个人中心
      wx.reLaunch({
        url: '../mine/index',
      })
    } else { //未做工单
        wx.reLaunch({
          url: '../order_repair/index',
        })
    }
  },
  detail(e) {
    if (e.target.dataset.index != null) {
      var worderOrder = JSON.stringify(this.data.list[e.target.dataset.index]);
      wx.navigateTo({
        url: '../order_detail_repair/index?workOrder=' + worderOrder + '&isHistory=0'
      })
    }
  },
  //联系客户
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.call,
    })
  },
  //取消订单
  cancel(e) {
    if (e.target.dataset.index != null) {
      console.log(e.target.dataset.index)
      var worderOrder = JSON.stringify(this.data.list[e.target.dataset.index]);
      wx.navigateTo({
        url: '../cancel_clean/index?workOrder=' + worderOrder
      })
    }
  },
  //完成订单
  complete(e) {
    wx.navigateTo({
      url: '../complete/index?id=' + e.target.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
        })
      },
    });
    this.getfollow()
  },

  getfollow() {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      data: {
        pageNo: _this.data.pageNo,
        pageSize: _this.data.pageSize,
        gcid: getApp().globalData.gcid,
        isGetApplyPic: 1,
        phone: wx.getStorageSync('userInfo').customerCalls,
        token: wx.getStorageSync('userInfo').token,
        workerId: wx.getStorageSync('userInfo').id,
        status: 1
      },
      url: getApp().globalData.url + 'v2/app/worker/repair/get_progress_list',
      method: "POST",
      success(res) {
        console.log('repair',res)
        if (res.data.result.list != null && res.data.result.list.length > 0) {
          _this.setData({
            list: _this.data.list.concat(res.data.result.list)
          })
          if (res.data.result.totalRecord == _this.data.list.length) {
            _this.setData({
              hasMore: false
            })
          }
        } else {
          _this.setData({
            hasMore: false
          })
        }

      }
    })
    wx.hideLoading({
      success: (res) => {},
    })
  },
  previmg(e) {
    var picUrl = e.target.dataset.picurl;
    var picList = e.target.dataset.piclist;
    var picsList = [];

    for(var index in picList){
      picsList.push(picList[index].big)
    }

    wx.previewImage({
      current: picUrl, // 当前显示图片的http链接  
      urls: picsList // 需要预览的图片http链接列表  
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    wx.hideHomeButton({
      success: (res) => {},
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
    if (this.data.hasMore) {
      this.setData({
        pageNo: this.data.pageNo + 1
      });
      this.getfollow()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})