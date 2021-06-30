// const host = 'http://192.168.1.51:8089/' 
const host = 'http://112.74.166.48:82/'   //测试环境
// const host = 'http://pms.xmlfey.com/' //正式环境
        
/**        
 * 封封微信的的request 
 */ 
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: host + url, 
      data: data,       
      method: method,  
      header: {
        'Content-Type': 'application/json',
        'Wechat-Auth-Token': wx.getStorageSync('token')  
      }, 
      success: function(res) {
        if (res.data.errno == 0) {
          resolve(res.data); 
        }  else {  
          if (res.data.errmsg.length >= 8) {
            showToast(res.data.errmsg)
          } else {
            showErrorToast(res.data.errmsg)
          }
        }
      }, 
      fail: function(err) {
        reject(err)
      }
    })
  });
} 

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image:"../static/icon_error.png",
    duration: 2000
  })
}

function showToast(msg) {
  wx.showToast({
    title: msg,
    icon: "none",
    duration: 2000
  })
}
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  }); 
}

function loginByWeixin() {
  return new Promise(function(resolve, reject) {
    return login().then((res) => {
      wx.getUserInfo({
        withCredentials: true,
        success: function (data) {
          wx.setStorageSync('code',  res.code);
          request('wx/auth/loginByweixin', {
            "code": res.code,
            "iv": data.iv, 
            "encryptedData": data.encryptedData,
            "inviteCode": wx.getStorageSync('inviteCode'), 
            "platform": {
              "value": 1
            }, 
            // "userInfo": data.userInfo,
          }, 'POST').then(res => {
            if (res.errno === 0) {
              //存储用户信息
              if (res.data){
                wx.setStorageSync('userInfo', res.data.user);
                wx.setStorageSync('token', res.data.token);
              }
              resolve(res);
            } else {
              reject(res);
            }
          }).catch((err) => {
            reject(err);
          });
        }
      })
    }).catch((err) => {
      reject(err);
    })
  });
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
module.exports = {
  request,
  loginByWeixin,
  showErrorToast,
  showToast,
  formatTime
}




