// pages/news/index.js
const app = getApp()
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    bgck: 3,
    columns: [],
    show: false,
    showDong: false,
    columnsDong: [],
    showStatus: false,
    statusList: [{
        id: '',
        name: '状态'
      },
      {
        id: '20',
        name: '可租'
      },
      {
        id: '21',
        name: '空置'
      },
      {
        id: '22',
        name: '转租'
      },
      {
        id: '24',
        name: '申退'
      },
      {
        id: '23',
        name: '预到期'
      },
      {
        id: '25',
        name: '已到期'
      },
      {
        id: '40',
        name: '成租'
      },
      {
        id: '30',
        name: '预定'
      },
      {
        id: '10',
        name: '配置'
      },
      {
        id: '50',
        name: '不可租'
      },
      {
        id: '60',
        name: '脏房'
      }
    ],
    selStatus: '',
    showPic: false,
    showRent: false,
    columnsRent: [
      '整租',
      '合租'
    ],
    houseViewData: {
      louNo: '', // 楼栋
      houseItemId: '', //项目id
      pageSize: 999,
      pageNo: 1,
      houseStatus: '', //房屋状态
      shoudingStatus: '', //预定：1 未预定：0
      minZujin: '',
      maxZujin: '',
      rentType: 0, // 整租0、合租1
    },
    list:[],
    fangxing:'整租',
    statusTit:'不限',
    
  },
  zhujin(e){
    var that = this;
    var min = 'houseViewData.minZujin';
    var max = 'houseViewData.maxZujin';
    this.setData({
      [min]: e.target.dataset.min,
      [max]: e.target.dataset.max,
    },()=>{
        that.onClosePic()
        that.getlist()
    })
  },
  bindmin(e){
    var min = 'houseViewData.minZujin';
    this.setData({
      [min]: e.detail.value,
    })
  },
  bindmax(e){
    var max = 'houseViewData.maxZujin';
    this.setData({
      [max]: e.detail.value,
    })
  },
  sure(){
  console.log()
    if( parseInt( this.data.houseViewData.maxZujin)> parseInt( this.data.houseViewData.minZujin)){
      this.getlist()
      this.onClosePic()
    }else{
      util.showToast('输入最大值要大于最小值～')
    }
     
  },
  onConfirmRent(event) {
    var that = this
    const {
      index
    } = event.detail;
    var str = 'houseViewData.rentType';
    this.setData({
      [str]: index,
      fangxing:index===0?'整租':'合租'
    }, () => {
      that.getlist()
      that.onCloseRent()
    })
  },
  onshowRent() {
    this.setData({
      showRent: true
    })
  },
  onCloseRent() {
    this.setData({
      showRent: false
    })
  },
  selectStatus(e) {
    var that =this;
    var str = 'houseViewData.houseStatus';
    var shoudingStatus = 'houseViewData.shoudingStatus';
    this.setData({
      [str]: e.target.dataset.id,
      [shoudingStatus]: '',
      selStatus: e.target.dataset.id,
      statusTit: e.target.dataset.name =="状态"?'不限': e.target.dataset.name
    },()=>{
      that.getlist()
      if(!(that.data.selStatus==22||that.data.selStatus==24||that.data.selStatus==23||that.data.selStatus==25||that.data.selStatus==40)){
        that.onCloseStatus()
      }
    })
  },
  shouding(e){
    var that =this;
    var shoudingStatus = 'houseViewData.shoudingStatus';
    this.setData({
      [shoudingStatus]: e.target.dataset.shoudingstatus
    },()=>{
      that.getlist()
      that.onCloseStatus()
    })
  },
  onshowPic() {
    this.setData({
      showPic: true
    })
  },
  onClosePic() {
    this.setData({
      showPic: false
    })
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  showDong() {
    this.setData({
      showDong: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onCloseDong() {
    this.setData({
      showDong: false
    });
  },
  getproject() {
    const that = this;
    var str = 'houseViewData.houseItemId';
    util.request(`v2/item/house_item/get_list`).then((res) => {
      that.setData({
        listProject: res.list,
        selectProject: res.list[0],
        [str]: res.list[0].id,
        columns: res.list.map((m) => {
          return m.hiItemName
        })
      }, () => {
        that.getDongList();
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getDongList() {
    const that = this;
    var str = 'houseViewData.louNo';
    util.request(`v2/item/house_lou_dong/get_list`, {
      houseItemId: that.data.selectProject.id
    }).then((res) => {
      that.setData({
        listDong: res.list,
        dong: res.list[0],
        [str]: res.list[0].name,
        columnsDong: res.list.map((m) => {
          return m.name
        })
      }, () => {
        that.getlist()
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  onConfirmDong(event) {
    var that = this
    const {
      index
    } = event.detail;
    var str = 'houseViewData.louNo';
    this.setData({
      dong: that.data.listDong[index],
      [str]: that.data.listDong[index].name,
    }, () => {
      that.getlist()
      that.onCloseDong()
    })
  },
  onConfirm(event) {
    var that = this
    const {
      index
    } = event.detail;
    var str = 'houseViewData.houseItemId';
    var houseStatus = 'houseViewData.houseStatus';
    var shoudingStatus = 'houseViewData.shoudingStatus';
    var minZujin = 'houseViewData.minZujin';
    var maxZujin = 'houseViewData.maxZujin';
    var rentType = 'houseViewData.rentType';
    this.setData({
      selectProject: that.data.listProject[index],
      [str]:  that.data.listProject[index].id,
      [houseStatus]:"",
      [shoudingStatus]:"",
      [minZujin]:"",
      [maxZujin]:"",
      [rentType]:0,
      fangxing:'整租',
      statusTit:'不限',
    }, () => {
      that.getDongList()
      that.onClose()
    })
  },
  onShowStatus() {
    this.setData({
      showStatus: true
    });

  },
  onCloseStatus() {
    this.setData({
      showStatus: false
    });
  },
  getStatus() {

  },
  sortAsc(propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value2 < value1) {
            return 1;
        } else if (value2 > value1) {
            return -1;
        } else {
            return 0;
        }
    }
},
  getlist() {
    const that = this;
    util.request(`v2/house/focus_house/get_list`, that.data.houseViewData).then((res) => {
      if (res.list.length > 0) {
        var houseListData = res.list;
        houseListData.sort(that.sortAsc("loucengA"));
        var louCengArr = []; //楼层，包含每层对应的房源集合
        var currentLouCeng = -1; //标记当前楼层
        var houseListObj = {
          louCeng: "", //楼层
          houseList: [] //楼层对应的房源集合
        }; //每层对应的房源集合对象
        var hezuObj = {
          louCeng: "", //楼层
          houseList: [] //楼层对应的房源集合
        }
        var louCengArrhezu = [];
       
        for(var n =0,len=houseListData.length;n<len;n++){
          if (currentLouCeng != houseListData[n].loucengA) {
            //判断楼层是否发生变化
            if (currentLouCeng > -1) {
              hezuObj.louCeng = currentLouCeng;
              houseListObj.louCeng = currentLouCeng;
              if (houseListObj.houseList.length!=0) {
                houseListObj.houseList.sort(that.sortAsc("fangNo"));
              }
              if (hezuObj.houseList.length!=0) {
                hezuObj.houseList.sort(that.sortAsc("fangNo"));
              }
              if (houseListObj.houseList.length > 0) {
                louCengArr.push(houseListObj);
                 houseListObj = {
                  louCeng: "", //楼层
                  houseList: [] //楼层对应的房源集合
                }; //每层对应的房源集合对象
              }
              if (hezuObj.houseList.length > 0) {
                louCengArrhezu.push(hezuObj)
                hezuObj = {
                  louCeng: "", //楼层
                  houseList: [] //楼层对应的房源集合
                }
              }
            }
            currentLouCeng =  houseListData[n].loucengA;
          }
          if ( houseListData[n].isShared == 1) {
            hezuObj.houseList.push( houseListData[n]);
          } else {
            houseListObj.houseList.push( houseListData[n]);
          }
          if (n == houseListData.length - 1) {
            //循环最后一次
            houseListObj.louCeng =  houseListData[n].loucengA;
            hezuObj.louCeng = currentLouCeng;

            if (houseListObj.houseList.length!=0) {
              houseListObj.houseList.sort(that.sortAsc("fangNo"));
            }
            if (hezuObj.houseList.length!=0) {
              hezuObj.houseList.sort(that.sortAsc("fangNo"));
            }
            if (houseListObj.houseList.length > 0) {
              louCengArr.push(houseListObj);
            }
            if (hezuObj.houseList.length > 0) {
              louCengArrhezu.push(hezuObj)
            }
          }
        }
        this.setData({
          list: that.data.houseViewData.rentType==0?louCengArr:louCengArrhezu
        })
      
      }else{
        this.setData({
          list: []
        },()=>{
          util.showToast('暂无房源～')
        })
      }

    }).catch((err) => {
      console.log(err)
    })
  },
  detail(e){
    wx.navigateTo({
      url: `/pages/focus/index?id=`+e.currentTarget.dataset.value.id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    this.getproject();

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