const host = 'https://tzcs.xmlfey.com/'   
// const host = 'http://112.74.166.48:82/' 
const imgHost= 'https://tzcs.xmlfey.com/UploadAllObjectServlet?server=upload&'


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



/**        
 * 封封微信的的request 
 */
function request(url, data = {}, method = "POST") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: host + url,
      data: {
        userid: wx.getStorageSync('info').id,
        token: wx.getStorageSync('info').token,
        gcid: '0592002',
        params: data
      }, 
      method: method,
      // header: {
      //   'Content-Type': 'application/json',
      //   'Wechat-Auth-Token': wx.getStorageSync('token')  
      // }, 
      success: function (res) {
        if (res.data.status.code == 200) {
          resolve(res.data.result);
        } else if(res.data.status.code == 300){
          resolve(res.data);
        } else {
          if (res.data.status.code == 1000) { 
            wx.removeStorage({
              key: 'info',
              success: function () {
                showToast(res.data.status.msg)
                setTimeout(() => {
                  wx.navigateTo({
                    url: '/pages/login/index'
                  });
                }, 1000)
              }
            })
           
          } else {
            if (res.data.status.msg.length >= 8) {
              showToast(res.data.status.msg)
            } else {
              showErrorToast(res.data.status.msg)
            }
          }

        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: "../static/icon_error.png",
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
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function loginByWeixin() {
  return new Promise(function (resolve, reject) {
    return login().then((res) => {
      wx.getUserInfo({
        withCredentials: true,
        success: function (data) {
          wx.setStorageSync('code', res.code);
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
              if (res.data) {
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
function getUUID() {
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

	var chars = CHARS,
		uuid = [],
		i
	var r
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
	uuid[14] = '4'
	for (i = 0; i < 36; i++) {
		if (!uuid[i]) {
			r = 0 | (Math.random() * 16)
			uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
		}
	}
	uuid = uuid.join('')
	//随机替换 “-”
	var chars = [
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z'
	]
	for (var i = 0; i < 4; i++) {
		var id = Math.ceil(Math.random() * 35)
		uuid = uuid.replace('-', chars[id])
	}
	return uuid
}

module.exports = {
  request,
  loginByWeixin,
  showErrorToast,
  showToast,
  formatTime,
  imgHost,
  getUUID,
}