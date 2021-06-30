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
        url: '../history_order_distribution/index',
      })
    } else if (e.detail == 2) { //个人中心
      wx.reLaunch({
        url: '../mine/index',
      })
    } else { //未做工单
      //配货
      wx.reLaunch({
        url: '../order_distribution/index',
      })
    }
  },

  detail(e) {
    if (e.target.dataset.index != null) {
      var worderOrder = JSON.stringify(this.data.list[e.target.dataset.index]);
      wx.navigateTo({
        url: '../order_detail_distribution/index?workOrder=' + worderOrder + '&isHistory=1'
      })
    }
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
    //获取保洁列表数据
    wx.request({
      data: {
        pageNo: _this.data.pageNo,
        pageSize: _this.data.pageSize,
        gcid: getApp().globalData.gcid,
        type: 2 //1.未做工单，2.历史工单
      },
      url: getApp().globalData.url + 'v2/rentservice/table_clean/get_table_clean_second_list',
      method: "POST",
      success(res) {
        console.log(res.data.result.list)
        if (res.data.result.list.length > 0) {
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
        selected: 1
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