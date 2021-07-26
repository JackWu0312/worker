// pages/sign/index.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNo: false,
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
    columnsmNo: [],
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
    // urgentEmail: "", // 紧急联系邮箱
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
    companyId: '',
    fileListcontract: [],
    otherFeeData: [],
    fuZeRenList: [],
    list: [],
    backInfo: null,
    tiqianDays: '',
    fileListjiaoge: []
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
  configure(e) {
    if (e.currentTarget.dataset.type == 1) {
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
  getNo(value) {
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
  getContractNum() {
    var that = this
    if (this.data.companyId) {
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
    } else {
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

  selepeople() {
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
      backInfo: {
        id: wx.getStorageSync('info').id,
        nickName: wx.getStorageSync('info').nickName,
        dptm: wx.getStorageSync('info').dptm.name,
        dptmId: wx.getStorageSync('info').dptm.id
      },
      defaultDateend,
      startTime: that.formatDate(this.data.defaultDatestat),
      endTime: that.formatDate(defaultDateend),
      hetongType: options.hetongType, // 1 为新签    2 为续签  
      address: options.address,
      houseId: options.houseId,
      hetongId: util.getUUID(), //给合同生成合同id（不管新签，续签都需要自动生成合同id）
      shangHeTongId: options.hetongId,
      parentId: options.parentId,
      zujin: options.zujin,
      zuJinMin: options.zuJinMin,
      jiaogedanId: util.getUUID()
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

    if (options.hetongType == 2) {
      var heTongDada = {}
      heTongDada.id = options.hetongId; //合同id
      heTongDada.isGetFuzeren = "1"; //是否需要获取合同负责人信息，1:需要
      heTongDada.isGetChengZuRen = "1"; //是否需要获取成租人信息，1:需要
      heTongDada.isGetHeZuRen = "1"; //是否需要获取合租人信息，1:需要
      heTongDada.modifyType = 1 // 用户区分是续签，还是换房 '1':续签;'2':换房;
      this.findHeTongList(heTongDada);
    }
  },
  //  getPicData.tblId = picData.id;  //根据id获取附件
    // getPicData.type = picData.type;  //图片类型
    // getPicData.subType = picData.subType;  //图片子类
  getFuJianData(){
    var that = this
    util.request(`v2/accessory/pic/get_list`, {
      id
    }).then((res) => {
      that.setData({
        qiyeInfo: res
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  findHeTongList(obj) {
    var that = this
    var typeMark = ''
    var typeMarkMode=''
    const {
      columnsSf
    } = this.data
    util.request(`v2/compact/chengzu/get_by_id`, obj).then((value) => {
      for (let i = 0; i < that.data.listMark.length; i++) {
        if (that.data.listMark[i] == value.houseUser.channelSource.id) {
          typeMark = that.data.columnsMark[i]
        }
      }
      for (let i = 0; i < that.data.listMarkMode.length; i++) {
        if (that.data.listMarkMode[i] == '2aefeabb-5748-4cd1-8837-3583e9f8db55') {
          typeMarkMode = that.data.columnsMarkMode[i]
        }
      }
      that.setData({
        type: value.compactType,
        nickname: value.houseUser.nickname,
        phone: value.houseUser.phone,
        contractStandard: value.contractStandard,
        emergencyPeo: value.houseUser.emergencyPeo,
        emergencyPeoPhone: value.houseUser.emergencyPeoPhone,
        startTime: that.formatDate(that.addYers(that.formatDate(new Date((new Date(value.endTime)).getTime() + 1000 * 60 * 60 * 24).getTime())))  ,
        endTime: that.formatDate(that.addYers(that.formatDate(new Date(that.addYers(that.formatDate(new Date(value.endTime).getTime()))).getTime()))),
        jiage: value.jiage,
        yaJin: value.yaJin,
        typeMarkMode,
        tiqianType: value.tiqianType,
        tiqianDays:value.tiqianDays,
        cotenantList:value.heZuRenList,
        otherFeeData:value.otherFeeData,
        backInfo: {
          id: value.fzrList[0].id,
          nickName: value.fzrList[0].userName,
          dptm: value.chengjiaorenBumenId.name,
          dptmId: value.chengjiaorenBumenId.id
        },
        list:value.fzrList.splice(0,1)
      }, () => {
        that.getNormalHeTongNo()
      })


      if (value.compactType == 1) {
        that.setData({
          gender: value.houseUser.gender,
          homeAddress: value.houseUser.homeAddress,
          sfzNo: value.houseUser.sfzNo,
          idcardType: value.certificateType,
          typeSf: columnsSf[value.certificateType - 1],
          cardNo: value.houseUser.cardNo,
          cardType: value.houseUser.cardType,
          cardTypeZhihang: value.houseUser.cardTypeZhihang,
          typeMark: typeMark

        })
      } else {
        that.setData({
          lodgerName: value.lodgerName,
          lodgerPhone: value.lodgerPhone,
          lodgerIdcard: value.lodgerIdcard,
          lodgerSex: value.lodgerSex,
          lodgerAddr: value.lodgerAddr,
          idcardType: value.houseUser.certificateType,
          typeSf: columnsSf[value.houseUser.certificateType - 1]
        }, () => {
          that.getCompanyInfo(value.companyId)
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  getCompanyInfo(id) {
    var that = this
    util.request(`v2/sys/lianfa_company_info/get_by_id`, {
      id
    }).then((res) => {
      that.setData({
        qiyeInfo: res
      })
    }).catch((err) => {
      console.log(err)
    })
  },

  getPeiZhiList(houseId) {
    var that = this
    util.request(`v2/storage/house_pei_zhi/get_list`, {
      status: 1,
      houseId
    }).then((res) => {
      that.setData({
        peizhiList: res.list.map((val) => {
          val.check = true
          return val
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  onChange(e) {
    var index = e.currentTarget.dataset.index
    var isCheck = !this.data.peizhiList[index].check
    let change = "peizhiList[" + index + "].check";
    this.setData({
      [change]: isCheck
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
  getNewContractNo(houseId, startDate) {
    var that = this
    util.request(`v2/compact/chengzu/getNewContractNum`, {
      houseId,
      czStart: startDate
    }).then((res) => {
      that.setData({
        no: res
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  getHeTongNoData(houseId) {
    var that = this
    util.request(`v2/house/house_shouding/get_compactN`, {
      houseId,
    }).then((res) => {
      that.setData({
        no: res.no
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
  addcost(e) {
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
    if (frame == 1) {
      this.getNormalHeTongNo()
    } else {
      this.setData({
        no: ''
      }, () => {
        that.getContractNum()
      })
    }
    this.setData({
      frame
    })
  },
  getContractNum() {
    var that = this
    if (this.data.companyId) {
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
    } else {
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
  // bindeUrgentEmail(e) {
  //   this.setData({
  //     urgentEmail: e.detail.value
  //   })
  // },
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
    var jiaoge = event.currentTarget.dataset.jiaoge
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: util.imgHost, // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'image',
      formData: {
        user: 'test'
      },
      success(res) {
        var fileobj = type ? that.data[`fileList${type}`] : that.data.fileListcontract
        fileobj.push({
          id,
          url: JSON.parse(res.data).url
        });
        if (type) {
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
        } else {
          if (jiaoge == 1) {
            that.setData({
              fileListjiaoge: fileobj
            })
          } else {
            that.setData({
              fileListcontract: fileobj
            });
          }
          var sentdata = {
            big: JSON.parse(res.data).url,
            type: typeid,
            tblId: that.data.hetongId,
            subType: type,
            id: jiaoge == 1 ? that.data.jiaogedanId : id
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
    var list = type ? this.data[`fileList${type}`] : this.data.fileListcontract
    var id = list[e.detail.index].id
    list.splice(e.detail.index, 1)
    if (type) {
      this.setData({
        [`fileList${type}`]: list
      }, () => {
        that.delImg(id)
      })
    } else {
      this.setData({
        fileListcontract: list
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
  stepOne() {
    const {
      type,
      columnsId,
      columnsmubanId,
      nickname,
      phone,
      sfzNo,
      homeAddress,
      fileList0,
      fileList1,
      qiyeInfo,
      lodgerName,
      lodgerPhone,
      lodgerIdcard,
      lodgerAddr
    } = this.data
    var reg = /^1[0-9]{10}$/; //验证规则
    if (type == 1) { //1个人合同  2企业合同
      if (!columnsId) {
        util.showToast('请选择合同模板！')
        return
      }

      if (!sfzNo) {
        util.showToast('请输入证件号！')
        return;
      }

      if (!homeAddress) {
        util.showToast('请填写联系地址!')
        return;
      }
    } else {
      if (!columnsmubanId) {
        util.showToast('请选择合同模板！')
        return
      }
      if (!qiyeInfo) {
        util.showToast('请选择企业！')
        return
      }
      if (!lodgerName) {
        util.showToast('请输入入住人姓名！')
        return
      }
      if (!reg.test(lodgerPhone)) {
        util.showToast('请输入正确的入住人手机号！')
      }
      if (!lodgerIdcard) {
        util.showToast('请输入证件号！')
        return;
      }
      if (!lodgerAddr) {
        util.showToast('请填写联系地址!')
        return;
      }
    }
    if (!nickname) {
      util.showToast('请输入姓名！')
      return
    }
    if (!reg.test(phone)) {
      util.showToast('请输入正确的手机号码！')
      return;
    }
    if (fileList0.length == 0 || fileList1.length == 0) {
      util.showToast('请上传相关证明！')
      return;
    }
    this.setData({
      activetip: 2
    })
  },
  laststep(e) {
    this.setData({
      activetip: e.currentTarget.dataset.type
    })
  },
  stepTwo() {
    const {
      typeMarkMode,
      jiage,
      yaJin,
      columnsCostText,
      tiqianDays,
      tiqianType,
      time,
      columnsNoId,
      type,
      frame
    } = this.data

    if (type == 2 && frame == 2) {
      if (!columnsNoId) {
        util.showToast('请选择框架编号！')
        return;
      }
    }

    if (!typeMarkMode) {
      util.showToast('请选择成交方式！')
      return;
    }
    if (!jiage) {
      util.showToast('请写租金！')
      return;
    }
    if (!yaJin) {
      util.showToast('请写押金！')
      return;
    }
    if (!columnsCostText) {
      util.showToast('请选择付款方式！')
      return;
    }
    if (!tiqianDays) {
      tiqianType == 0 ? util.showToast('请写提前付款天数！') : util.showToast('请写固定付款日期！')
      return;
    }
    if (!time) {
      util.showToast('请选择签约日期！')
      return;
    }
    this.setData({
      activetip: 3
    })
  },


  save() {
    const {
      jiage,
      yaJin,
      zhifuTypeId,
      tiqianDays,
      tiqianType,
      startTime,
      endTime,
      lodgerIdcard,
      lodgerSex,
      lodgerAddr,
      lodgerName,
      emergencyPeoPhone,
      type,
      emergencyPeo,
      idcardType,
      nickname,
      freeStartDate,
      freeEndDate,
      houseId,
      hetongId,
      sfzNo,
      parentId,
      gender,
      channelSourceId,
      columnsId,
      columnsmubanId,
      frame,
      cardNo,
      chengjiaoTypeId,
      contractStandard,
      buchongRemark,
      time,
      homeAddress,
      cardTypeZhihang,
      no,
      cardType,
      hetongType,
      phone,
      otherFeeData,
      cotenantList,
      list,
      backInfo
    } = this.data
    var moneyData = {
      "monthMoney": jiage, //月租金
      "yaJin": yaJin, //押金
      "payTypeId": zhifuTypeId, //支付方式
      "prepaymentDays": tiqianDays, //
      "prepaymentDaysType": tiqianType, //
      "beginDate": startTime, //合同开始日期
      "endDate": endTime, //合同截止日期
      // "feiYongTypeId": "", //费用类型ID
      "ifMerge": "0", //最后一期不足月是否合并到第一期,0不合并，1合并
      "heTongList": [{
        monthMoney: jiage, //月租金
        payTypeId: zhifuTypeId, //支付方式
        beginDate: startTime, //合同开始时间
        endDate: endTime, //合同结束时间
        feiYongTypeId: "933283b8-3447-4582-b893-9ac266f387ce", //费用类型ID
        prepaymentDays: tiqianDays, //
        prepaymentDaysType: tiqianType, //
        freeBeginDate: freeStartDate, //合同开始日期
        freeEndDate: freeEndDate, //合同截止日期
      }], //自定义合同集合
      "qitaList": otherFeeData, //其他费用集合
      // "dids": [], //优惠他费用集合
      "freeBeginDate": freeStartDate, //免租开始时间
      "freeEndDate": freeEndDate, //免租结束时间
      "houseId": houseId,
      "id": hetongId, //给合同生成合同id（不管新签，续签都需要自动生成合同id）
      "parentHouseId": parentId,
      "signType": hetongType,
      "balanceType": 2,
      "zukePhone": phone,
      "modifyType": hetongType == 2 ? 1 : '', // 用户区分是续签，还是换房 '1':续签;'2':换房;
    };
    var listOne = [{
      userid: backInfo.id,
      type: 0
    }]
    var obj = {
      cotenantList,
      fuZeRenList: listOne.concat(list),
      id: hetongId,
      houseId,
      nickname,
      certificateType: idcardType,
      phone,
      emergencyPeo,
      emergencyPeoPhone,
      no,
      startTime,
      endTime,
      freeStartDate,
      freeEndDate,
      jiage,
      yaJin,
      chengjiaoTypeId,
      tiqianType,
      tiqianDays,
      zhifuTypeId,
      chengjiaorenBumenId: backInfo.dptmId,
      time,
      buchongRemark,
      contractStandard,
      channelSourceId,
      hetongType,
      listArray: [],
      changeFee: null
    }

    if (type == 1) {
      obj.sfzNo = sfzNo; // 租客身份证
      obj.gender = gender; // 租客性别-0:女，1:男
      obj.homeAddress = homeAddress // 紧急联系地址
      obj.cardNo = cardNo; // 银行卡号
      obj.cardType = cardType; // 所属银行
      obj.cardTypeZhihang = cardTypeZhihang; // 所属银行支行
      // obj.urgentEmail =urgentEmail; // 紧急联系邮箱
      obj.isElectron = 1
      obj.noType = 1
      obj.electronicTemplateId = columnsId

    } else {
      obj.lodgerName = lodgerName;
      obj.lodgerPhone = lodgerPhone;
      obj.lodgerIdcard = lodgerIdcard; // 租客身份证
      obj.lodgerSex = lodgerSex
      obj.lodgerAddr = lodgerAddr; // 紧急联系地址
      obj.companyId = qiyeInfo.id
      obj.isElectron = 2
      obj.electronicTemplateId = columnsmubanId
      if (frame == 2) {
        obj.noType = 2
      } else {
        obj.noType = 1
      }
    }

    wx.navigateTo({
      url: `/pages/iaed/index?data=${JSON.stringify(moneyData)}&obj=${JSON.stringify(obj)}`
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