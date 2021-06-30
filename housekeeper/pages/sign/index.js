// pages/sign/index.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNo:false,
    activetip: 1,
    type: 1, //1为个人合同，2为企业合同
    freeStartDate: '', //免租开始
    freeEndDate: '', //免租结束
    defaultDatestat: new Date((new Date()).getTime() + 1000 * 60 * 60 * 24).getTime(),
    defaultDateend: '',
    startTime: '',
    endTime: '',
    showdatefree: false,
    showdSign: false,
    time: '',
    showdate: false,
    columnsmNo:[],
    fileList0: [],
    fileList1: [],
    fileList2: [],
    fileList3: [],
    columnsSf: ['身份证', '护照', '港澳通行证', '台湾同胞证'],
    showSf: false,
    idcardType: 1, //证件类型
    typeSf: '身份证',
    contractStandard: 0, // 0 制式 1非制式
    columns: [],
    columnsmuban: [],
    columnsMark: [],
    showmuban: false,
    show: false,
    qiyeInfo: null,
    nickname: "", // 租客姓名
    gender: 1, // 租客性别-0:女，1:男
    phone: "", // 租客电话
    homeAddress: '', //联系地址
    sfzNo: '', //租客身份证
    showMark: false,
    emergencyPeo: "", //紧急联系人
    emergencyPeoPhone: "", //紧急联系人电话
    cardNo: "", // 银行卡号
    cardType: "", // 所属银行
    cardTypeZhihang: "", // 所属银行支行
    urgentEmail: "", // 紧急联系邮箱
    lodgerName: '',
    lodgerPhone: '',
    lodgerIdcard: '',
    lodgerSex: 1,
    bindlodgerAddr: "",
    cotenantList: [],
    frame: 1, //1普通 2框架
    columnsMarkMode: [],
    showMarkMode: false,
    showcost: false,
    columnsCost: [],
    tiqianType: 0, //0 提前付款天数 1固定付款日期
    companyId:'',
    fileListcontract:[],
    otherFeeData:[],
    fuZeRenList:[],
    list:[],
    backInfo:null,
    fileListjiaoge:[]
    // isXinQian : 1, // 1 为新签，2 为续签
  },
  modify(e) {
    if (e.currentTarget.dataset.type == 0) {
      wx.navigateTo({
        url: `/pages/modify/index`
      });
    } else {
      wx.navigateTo({
        url: `/pages/modify/index?data=${JSON.stringify(e.currentTarget.dataset.item)}&index=${e.currentTarget.dataset.index}`
      });
    }
  },
  configure(e){
    if (e.currentTarget.dataset.type==1) {
      wx.navigateTo({
        url: `/pages/configure/index?item=${JSON.stringify(e.currentTarget.dataset.item)}&index=${e.currentTarget.dataset.index}&houseId=${this.data.houseId}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/configure/index?houseId=${this.data.houseId}`
      });
    }
  },
  addYers(dateText) {
    var date = new Date(dateText);
    date.setFullYear(date.getFullYear() + 1);
    // date.setDate(date.getDate()-1);
    return date.getTime()
  },
  addmonth(dateText, num) {
    var date = new Date(dateText);
    // date.setFullYear(date.getFullYear()+1);
    date.setMonth(date.getMonth() + num);

    return date.getTime()

  },
  setmonth(e) {
    var that = this
    var month = e.currentTarget.dataset.month
    var defaultDateend = this.addmonth(this.data.startTime, Number(month))
    defaultDateend = new Date((new Date(defaultDateend)).getTime() - 1000 * 60 * 60 * 24).getTime()
    this.setData({
      defaultDateend,
      endTime: that.formatDate(defaultDateend),
    })
  },
  onClosemuban() {
    const me = this
    this.setData({
      showmuban: !me.data.showmuban
    })
  },
  onChangemuban(event) {
    const {
      value,
      index
    } = event.detail;
    var that = this
    this.setData({
      columnsmubanId: that.data.columnsmubanList[index],
      columnsmubanText: value
    })
  },
  onConfirmmuban(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      columnsmubanId: that.data.columnsmubanList[index],
      columnsmubanText: value
    }, () => {
      that.onClosemuban()
    })
  },

  onClose() {
    const me = this
    this.setData({
      show: !me.data.show
    })
  },
  onChange(event) {
    const {
      value,
      index
    } = event.detail;
    var that = this
    this.setData({
      columnsId: that.data.columnsList[index],
      columnsText: value
    })
  },
  onConfirm(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      columnsId: that.data.columnsList[index],
      columnsText: value
    }, () => {
      that.onClose()
    })
  },

  onCloseNo() {
    const me = this
    this.setData({
      showNo: !me.data.showNo
    })
  },
  // onChangeNo(event) {
  //   const {
  //     value,
  //   } = event.detail;
  //   this.setData({
  //     columnsNoId: value,
  //   })
  // },
  onConfirmNo(event) {
    var that = this
    const {
      value,
    } = event.detail;
    this.setData({
      columnsNoId: value,
    }, () => {
      that.onCloseNo()
      that.getNo(value)
    })
  },
  getNo(value){
    util.request(`v2/house/part_house/getKnoByNum`, {
      "frameNumber": value,
    }).then((res) => {
      this.setData({
        no: res
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getContractNum(){
    var that = this
    if(this.data.companyId){
      util.request(`v2/sys/lianfa_company_info/getNumberByCompany`, {
        "companyId": that.data.companyId,
        "status": 1
      }).then((res) => {
        this.setData({
          columnsNo: res.list.map((val) => {
            return val.number
          })
        })
      }).catch((err) => {
        console.log(err)
      })
    }else{
      util.showToast('请选择企业信息！')
    }
  },


  onCloseMark() {
    const me = this
    this.setData({
      showMark: !me.data.showMark
    })
  },
  onChangeMark(event) {
    const {
      value,
      index
    } = event.detail;
    var that = this
    this.setData({
      channelSourceId: that.data.listMark[index],
      typeMark: value
    })
  },
  onConfirmMark(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      channelSourceId: that.data.listMark[index],
      typeMark: value
    }, () => {
      that.onCloseMark()
    })
  },

  onCloseMarkMode() {
    const me = this
    this.setData({
      showMarkMode: !me.data.showMarkMode
    })
  },
  onChangeMarkMode(event) {
    const {
      value,
      index
    } = event.detail;
    var that = this
    this.setData({
      chengjiaoTypeId: that.data.listMarkMode[index],
      typeMarkMode: value
    })
  },
  onConfirmMarkMode(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      chengjiaoTypeId: that.data.listMarkMode[index],
      typeMarkMode: value
    }, () => {
      that.onCloseMarkMode()
    })
  },


  onClosecost() {
    const me = this
    this.setData({
      showcost: !me.data.showcost
    })
  },
  onChangecost(event) {
    const {
      value,
      index
    } = event.detail;
    var that = this
    this.setData({
      zhifuTypeId: that.data.listMarkCost[index],
      columnsCostText: value
    })
  },
  onConfirmcost(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      zhifuTypeId: that.data.listMarkCost[index],
      columnsCostText: value
    }, () => {
      that.onClosecost()
    })
  },

  selepeople(){
    wx.navigateTo({
      url: `/pages/selepeople/index`
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var defaultDateend = this.addYers(this.formatDate(new Date().getTime()))
    this.setData({
      backInfo:{
        id:  wx.getStorageSync('info').id, nickName: wx.getStorageSync('info').nickName ,dptm: wx.getStorageSync('info').dptm.name
      },
      defaultDateend,
      startTime: that.formatDate(this.data.defaultDatestat),
      endTime: that.formatDate(defaultDateend),
      hetongType: options.hetongType,
      address: options.address,
      houseId: options.houseId,
      hetongId: util.getUUID(), //给合同生成合同id（不管新签，续签都需要自动生成合同id）
      shangHeTongId:options.hetongId,
      parentId: options.parentId,
      zujin: options.zujin,
      zuJinMin: options.zuJinMin,
      jiaogedanId:util.getUUID()
      // isXinQian:options.hetongId?2:1
    }, () => {
      that.setData({
        minDate: new Date(2019, 0, 1).getTime(),
      }, () => {
        that.setData({
          maxDate: new Date(2028, 0, 31).getTime(),
        })
      })
    })
    this.getTemplate()
    this.getContractTemplate()
    this.getMark()
    this.getMarkMode()
    this.getMarkCost()
    this.getNormalHeTongNo()
    this.getPeiZhiList(options.houseId)
  },
  getPeiZhiList(houseId){
    var that = this
    util.request(`v2/storage/house_pei_zhi/get_list`, {
      status:1,
      houseId
    }).then((res) => {
      that.setData({
        peizhiList:res.list.map((val)=>{
          val.check=true
          return val
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  onChange(e){
    var index = e.currentTarget.dataset.index
    var isCheck = !this.data.peizhiList[index].check
    let change = "peizhiList["+ index +"].check";
    this.setData({
      [change]:isCheck
    })
  },
  getNormalHeTongNo() {
    var houseId = this.data.houseId;
    var startDate = this.data.startTime;
    if (startDate && new Date(startDate) >= new Date("2021-01-01")) {
      this.getNewContractNo(houseId, startDate);
    } else {
      this.getHeTongNoData(houseId);
    }
  },
  getNewContractNo(houseId,startDate) {
    var that = this
    util.request(`v2/compact/chengzu/getNewContractNum`, {
      houseId,
      czStart: startDate
    }).then((res) => {
      that.setData({
        no:res
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getHeTongNoData(houseId){
    var that = this
    util.request(`v2/house/house_shouding/get_compactN`, {
      houseId,
    }).then((res) => {
      that.setData({
        no:res.no
      })
    }).catch((err) => {
      console.log(err)
    })
  },

  contractType(e) {
    this.setData({
      type: e.currentTarget.dataset.contracttype
    })
  },
  format(e) {
    this.setData({
      contractStandard: e.currentTarget.dataset.contractstandard
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  activetipbind(e) {
    this.setData({
      activetip: e.currentTarget.dataset.index
    })
  },
  together(e) {
    if (e.currentTarget.dataset.item) {
      var id = e.currentTarget.dataset.item.id
      var nickname = e.currentTarget.dataset.item.nickname
      var gender = e.currentTarget.dataset.item.gender
      var phone = e.currentTarget.dataset.item.phone
      var sfzNo = e.currentTarget.dataset.item.sfzNo
      var index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: `/pages/together/index?id=${id}&nickname=${nickname}&gender=${gender}&phone=${phone}&sfzNo=${sfzNo}&index=${index}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/together/index`
      });
    }
  },
  addcost(e){
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: item ? `/pages/addcost/index?item=${JSON.stringify(item)}&index=${ e.currentTarget.dataset.index}` : `/pages/addcost/index`
    });
  },
  seleenterprise() {
    wx.navigateTo({
      url: `/pages/seleenterprise/index`
    });
  },
  getTemplate() {
    util.request(`v2/dynamicTemplate/contract_template/get_list`, {
      type: 1,
      status: "1" //0：已禁用  1：已启用
    }).then((res) => {
      this.setData({
        columnsList: res.list.map((val) => {
          return val.id
        }),
        columns: res.list.map((val) => {
          return val.contractTemplateName
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getContractTemplate() {
    util.request(`v2/dynamicTemplate/contract_template/get_list`, {
      type: 2,
      status: "1" //0：已禁用  1：已启用
    }).then((res) => {
      this.setData({
        columnsmubanList: res.list.map((val) => {
          return val.id
        }),
        columnsmuban: res.list.map((val) => {
          return val.contractTemplateName
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  },

  bindNickname(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  bindAddress(e) {
    this.setData({
      homeAddress: e.detail.value
    })
  },
  clickGender(e) {
    this.setData({
      gender: e.currentTarget.dataset.gender
    })
  },
  bindframe(e) {
    var that = this
    var frame = e.currentTarget.dataset.frame
    if(frame==1){
      this.getNormalHeTongNo()
    }else{
      this.setData({
        no:''
      },()=>{
        that.getContractNum()
      })
    }
    this.setData({
      frame
    })
  },
  getContractNum(){
    var that = this
    if(this.data.companyId){
      util.request(`v2/sys/lianfa_company_info/getNumberByCompany`, {
        "companyId": that.data.companyId,
        "status": 1
      }).then((res) => {
        this.setData({
          columnsNo: res.list.map((val) => {
            return val.number
          })
        })
      }).catch((err) => {
        console.log(err)
      })
    }else{
      util.showToast('请选择企业信息！')
    }
  },
  clicklodgerSex(e) {
    this.setData({
      lodgerSex: e.currentTarget.dataset.gender
    })
  },
  tiqian(e) {
    this.setData({
      tiqianType: e.currentTarget.dataset.tiqiantype
    })
  },
  bindsfzNo(e) {
    this.setData({
      sfzNo: e.detail.value
    })
  },
  bindLodgerIdcard(e) {
    this.setData({
      lodgerIdcard: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindeMergencyPeo(e) {
    this.setData({
      mergencyPeo: e.detail.value
    })
  },
  bindeMergencyPeoPhone(e) {
    this.setData({
      bindeMergencyPeoPhone: e.detail.value
    })
  },
  bindeCardNo(e) {
    this.setData({
      cardNo: e.detail.value
    })
  },
  bindeCardType(e) {
    this.setData({
      cardType: e.detail.value
    })
  },
  bindtiqianDays(e) {
    this.setData({
      tiqianDays: e.detail.value
    })
  },
  bindbuchongRemark(e) {
    this.setData({
      buchongRemark: e.detail.value
    })
  },
  bindeCardTypeZhihang(e) {
    this.setData({
      cardTypeZhihang: e.detail.value
    })
  },
  bindeUrgentEmail(e) {
    this.setData({
      urgentEmail: e.detail.value
    })
  },
  bindLodgerName(e) {
    this.setData({
      lodgerName: e.detail.value
    })
  },
  bindjiage(e) {
    this.setData({
      jiage: e.detail.value
    })
  },
  bindyaJin(e) {
    this.setData({
      yaJin: e.detail.value
    })
  },
  bindLodgerPhone(e) {
    this.setData({
      lodgerPhone: e.detail.value
    })
  },
  bindlodgerAddr(e) {
    this.setData({
      bindlodgerAddr: e.detail.value
    })
  },
  onCloseSf() {
    const me = this
    this.setData({
      showSf: !me.data.showSf
    })
  },
  onChangeSf(event) {
    const {
      value,
      index
    } = event.detail;
    this.setData({
      idcardType: index + 1,
      typeSf: value
    })
  },
  onConfirmSf(event) {
    var that = this
    const {
      value,
      index
    } = event.detail;
    this.setData({
      idcardType: index + 1,
      typeSf: value
    }, () => {
      that.onCloseSf()
    })
  },
  getMark() {
    var that = this
    util.request(`v2/sys/zi_dian/get_list_by_mark`, {
      mark: '44d8d93e-73f2-475e-a854-ec0a0cf513ad'
    }).then((res) => {
      that.setData({
        listMark: res.list.map((val) => {
          return val.id
        }),
        columnsMark: res.list.map((val) => {
          return val.key
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getMarkMode() {
    var that = this
    util.request(`v2/sys/zi_dian/get_list_by_mark`, {
      mark: '6ae4d789-4d0b-476d-ab0b-7411614f269d'
    }).then((res) => {
      that.setData({
        listMarkMode: res.list.map((val) => {
          return val.id
        }),
        columnsMarkMode: res.list.map((val) => {
          return val.key
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getMarkCost() {
    var that = this
    util.request(`v2/sys/zi_dian/get_list_by_mark`, {
      mark: '31841886-28ec-45dc-aaec-67c40f7a73fe'
    }).then((res) => {
      that.setData({
        listMarkCost: res.list.map((val) => {
          return val.id
        }),
        columnsCost: res.list.map((val) => {
          return val.key
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  afterRead(event) {
    var that = this
    var id = util.getUUID()
    const {
      file
    } = event.detail;
    var type = event.currentTarget.dataset.type
    var typeid = event.currentTarget.dataset.typeid
    var jiaoge =  event.currentTarget.dataset.jiaoge
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: util.imgHost, // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'image',
      formData: {
        user: 'test'
      },
      success(res) {
        var fileobj = type?that.data[`fileList${type}`]:that.data.fileListcontract
        fileobj.push({
          id,
          url: JSON.parse(res.data).url
        });
        if(type){
          that.setData({
            [`fileList${type}`]: fileobj
          });
          // , () => {
          //   var sentdata = {
          //     big: JSON.parse(res.data).url,
          //     type: typeid,
          //     tblId: that.data.hetongId,
          //     subType: type,
          //     id
          //   }
          //   that.saveImg(sentdata)
          // }
        }else{
          if(jiaoge==1){
            that.setData({
              fileListjiaoge: fileobj
            })
          }else{
            that.setData({
              fileListcontract: fileobj
            });
          }
          var sentdata = {
            big: JSON.parse(res.data).url,
            type: typeid,
            tblId:that.data.hetongId,
            subType: type,
            id:jiaoge==1 ?that.data.jiaogedanId:id
          }
          that.saveImg(sentdata)
        }
       
      },
    });
  },
 
  saveImg(obj) {
    util.request(`v2/accessory/pic/save`, obj).then((res) => {
      util.showToast('上传成功！')
    }).catch((err) => {
      console.log(err)
    })
  },
  deleteImg(e) {
    var that = this
    var type = e.currentTarget.dataset.type
    var list = type?this.data[`fileList${type}`]:this.data.fileListcontract
    var id = list[e.detail.index].id
    list.splice(e.detail.index, 1)
    if(type){
      this.setData({
        [`fileList${type}`]: list
      }, () => {
        that.delImg(id)
      })
    }else{
      this.setData({
        fileListcontract:list
      }, () => {
        that.delImg(id)
      })
    }
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
  delcoten(e) {
    var index = e.currentTarget.dataset.index
    var list = this.data.cotenantList
    list.splice(index, 1)
    this.setData({
      cotenantList: list
    })

  },
  onClosedate() {
    this.setData({
      showdate: false
    });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  onConfirmdate(event) {
    var that = this
    const [start, end] = event.detail;
    this.setData({
      showdate: false,
      startTime: this.formatDate(start),
      endTime: this.formatDate(end)
    }, () => {
      that.setData({
        freeStartDate: '',
        freeEndDate: '',
        minDatefree: new Date(that.data.startTime).getTime(),
        maxDatefree: new Date(that.data.endTime).getTime(),
        defaultDatestatfree: new Date(that.data.startTime).getTime(),
      })
      that.getNormalHeTongNo()
    });
  },
  onDisplay(e) {
    this.setData({
      showdate: true,
    });
  },
  onClosedatefree() {
    this.setData({
      showdatefree: false
    });
  },
  onConfirmdatefree(event) {
    const [start, end] = event.detail;
    this.setData({
      showdatefree: false,
      freeStartDate: this.formatDate(start),
      freeEndDate: this.formatDate(end)
    });
  },
  onDisplayfree(e) {
    if (this.data.startTime) {
      this.setData({
        showdatefree: true,
        minDatefree: new Date(this.data.startTime).getTime(),
        maxDatefree: new Date(this.data.endTime).getTime(),
        defaultDatestatfree: new Date(this.data.startTime).getTime(),
      });
    } else {
      util.showToast('请先选择合同期限！')
    }

  },
  closeFree() {
    this.setData({
      freeStartDate: '',
      freeEndDate: ''
    })
  },


  onCloseSign() {
    this.setData({
      showdSign: false
    });
  },

  onConfirmSign(event) {
    this.setData({
      showdSign: false,
      time: this.formatDate(event.detail),
    });
  },
  onDisplaySign(e) {
    this.setData({
      showdSign: true,
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