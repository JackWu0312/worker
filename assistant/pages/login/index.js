// pages/login/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: null,
    codeFromNet: null,
    disabled: false,
    codename: "获取验证码",
    codeNum: null
  },
  phoneNum: function (e) {
    this.setData({
      phoneNum: e.detail.value
    });
  },
  codeNum: function (e) {
    this.setData({
      codeNum: e.detail.value
    });
  },
  //获取验证码
  getCode() {
    if (this.data.phoneNum == null) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.phoneNum.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else {
      wx.showLoading({
        title: '获取中...',
      })
      var phoneStr = this.data.phoneNum;
      var _this = this;
      wx.request({
        data: {
          phone: phoneStr
        },
        url: getApp().globalData.url + 'v2/sms/worker/get_code',
        method: "POST",
        success(res) {
          _this.setData({
            codeFromNet: res.data.result.code
          });
          var num = 61;
          var timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false
              })

            } else {
              _this.setData({
                codename: num + "s"
              })
            }
          }, 1000)
        }
      })
      wx.hideLoading({
        success: (res) => {},
      })
    }
  },
  //登录
  toLogin() {
    //判断手机号及验证码是否为空
    if (this.data.phoneNum == null) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.codeFromNet == null) {
      wx.showToast({
        title: '请获取验证码！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.codeFromNet != this.data.codeNum) {
      wx.showToast({
        title: '输入的验证码有误，请重新输入！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }

    wx.showLoading({
      title: '登录中...',
    })
    var phoneStr = this.data.phoneNum;
    var codeStr = this.data.codeNum;
    wx.request({
      data: {
        phone: phoneStr,
        code: codeStr
      },
      url: getApp().globalData.url + 'v2/app/worker/login',
      method: "POST",
      success(res) {
        console.log(res)
        wx.setStorageSync('isLogin', true)
        wx.setStorageSync('userInfo', res.data.result)
        // wx.reLaunch({
        //   url: '../order/index',
        // })
        if(wx.getStorageSync('workType') == 1){//维修
          wx.reLaunch({
            url: '../order_repair/index',
          })
        }else if(wx.getStorageSync('workType') == 2){//保洁
          wx.reLaunch({
            url: '../order_clean/index',
          })
        }else if(wx.getStorageSync('workType') == 3){//装修
          wx.reLaunch({
            url: '../order_renovation/index',
          })
        }else if(wx.getStorageSync('workType') == 4){//配货
          wx.reLaunch({
            url: '../order_distribution/index',
          })
        }
      }
    })
    wx.hideLoading({
      success: (res) => {},
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})