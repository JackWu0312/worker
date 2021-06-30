// pages/complete/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    banner: [], //轮播图片
    chooseViewShowBanner: true,
    show: false,
    chengdanfang: "",
    chengdanType: null,
    fee_input: null,
    remarks_input: "",
    urlList: []
  },

  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  fee_input: function (e) {
    this.setData({
      fee_input: e.detail.value
    });
  },

  remarks_input: function (e) {
    this.setData({
      remarks_input: e.detail.value
    });
  },
  select_company() {
    this.setData({
      chengdanfang: "公司",
      chengdanType: "1",
      show: false
    })
  },
  select_tenant() {
    this.setData({
      chengdanfang: "租户",
      chengdanType: "2",
      show: false
    })
  },
  select_owner() {
    this.setData({
      chengdanfang: "业主",
      chengdanType: "3",
      show: false
    })
  },
  //提交数据
  submit() {
    if (this.data.chengdanType == null) {
      wx.showToast({
        title: '请选择承担方！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.fee_input == null) {
      wx.showToast({
        title: '请输入最终费用！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var _this = this;
    wx.showLoading({
      title: '提交中...',
    })
    console.log(_this.data.urlList.length)
    //完成维修工单
    if (wx.getStorageSync('workType') == 1) {
      wx.request({
        data: {
          chengdanType: _this.data.chengdanType,
          totalPrice: _this.data.fee_input,
          repairDetail: _this.data.remarks_input,
          id: _this.data.id,
          gcid: getApp().globalData.gcid,
          picList: _this.data.urlList,
          phone:wx.getStorageSync('userInfo').customerCalls,
          token:wx.getStorageSync('userInfo').token
        },
        method: "POST",
        url: getApp().globalData.url + 'v2/app/worker/repair/finish_orders',
        success(res) {
          wx.reLaunch({
            url: '../order_clean/index',
          })
        }
      })
    } else if (wx.getStorageSync('workType') == 2) {
      //完成保洁
      wx.request({
        data: {
          chengdanType: _this.data.chengdanType,
          totalPrice: _this.data.fee_input,
          finishRemark: _this.data.remarks_input,
          id: _this.data.id,
          picList: _this.data.urlList,
          gcid: getApp().globalData.gcid,
          phone:wx.getStorageSync('userInfo').customerCalls,
          token:wx.getStorageSync('userInfo').token
        },
        method: "POST",
        url: getApp().globalData.url + 'v2/rentservice/table_clean/finish_orders',
        success(res) {
          wx.reLaunch({
            url: '../order_clean/index',
          })
        }
      })
    }
    wx.hideLoading({
      success: (res) => {},
    })
  },
  /** 选择图片Banner */
  chooseBanner: function () {
    var that = this;
    if (this.data.banner.length < 3) {
      wx.chooseImage({
        count: 3 - that.data.banner.length, //最多选择2张图片- that.data.banner.length,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log(res.tempFilePaths);
          if (res.tempFilePaths.count == 0) {
            return;
          }
          //上传图片
          wx.uploadFile({
            filePath: res.tempFilePaths[0],
            name: 'uploadfile_ant',
            url: getApp().globalData.url + 'UploadAllObjectServlet?server=upload&',
            success: function (res) {
              console.log(res.data);
              //保存上传后的图片链接
              var _urlList = that.data.urlList;
              _urlList.push({
                big: res.data.url,
                middle: res.data.url,
                small: res.data.url,
              })
              that.setData({
                urlList: _urlList
              })
            }
          })
          //填充图片
          var imgArrNow = that.data.banner;
          imgArrNow = imgArrNow.concat(res.tempFilePaths);
          that.setData({
            banner: imgArrNow
          })
          that.chooseViewShowBanner();
        }
      })
    } else {
      wx.showToast({
        title: '限制选择3个文件',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  /** 删除图片Banner */
  deleteImvBanner: function (e) {
    var banner = this.data.banner;
    var _urlList = this.data.urlList;
    var itemIndex = e.currentTarget.dataset.id;
    banner.splice(itemIndex, 1);
    _urlList.splice(itemIndex, 1);
    this.setData({
      banner: banner,
      urlList: _urlList
    })
    //判断是否隐藏选择图片
    this.chooseViewShowBanner();
  },


  /** 是否隐藏图片选择Banner*/
  chooseViewShowBanner: function () {
    if (this.data.banner.length >= 3) {
      this.setData({
        chooseViewShowBanner: false
      })
    } else {
      this.setData({
        chooseViewShowBanner: true
      })
    }
  },
  /** 查看大图Banner */
  showImageBanner: function (e) {
    var banner = this.data.banner;
    var itemIndex = e.currentTarget.dataset.id;
    console.log("itemIndex:" + JSON.stringify(e))
    wx.previewImage({
      current: banner[itemIndex], // 当前显示图片的http链接
      urls: banner // 需要预览的图片http链接列表
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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