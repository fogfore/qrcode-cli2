import {login} from '../../utils/login.js'

const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

      // 登录
      login(e.detail.userInfo)
    } else {
      wx.showToast({
        icon: 'none',
        title: '授权失败',
      })
    }
  }
})