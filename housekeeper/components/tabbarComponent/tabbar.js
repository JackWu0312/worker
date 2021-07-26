// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#FBFBFB",
        "color": "#929292",
        "selectedColor": "#3CCC93",
        "list": [
          {
            "pagePath": "/pages/home/index",
            "iconPath": "icon/tab1.png",
            "selectedIconPath": "icon/tab1-active.png",
            "text": "工作台"
          },
          {
            "pagePath": "/pages/resources/index",
            "iconPath": "icon/tab2.png",
            "selectedIconPath": "icon/tab2-active.png",
            "text": "资源池"
          },
          {
            "pagePath": "/pages/more/index",
            "iconPath": "icon/icon_release.png",
            "isSpecial": true,
            "text": ""
          },
          {
            "pagePath": "/pages/news/index",
            "iconPath": "icon/tab3.png",
            "selectedIconPath": "icon/tab3-active.png",
            "text": "消息"
          },
          {
            "pagePath": "/pages/my/index",
            "iconPath": "icon/tab4.png",
            "selectedIconPath": "icon/tab4-active.png",
            "text": "我的"
          },
    
        ]
      }
    } 
  },
   
  /**
   * 组件的初始数据
   */
  data: {
    // isIphoneX: app.globalData.systemInfo.model.search('iPhone X') != -1 ? true : false
  },

  /**
   * 组件的方法列表 
   */
  methods: {  

  }
})
