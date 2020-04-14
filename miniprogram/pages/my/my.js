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
      this.login()
    } else {
      wx.showToast({
        icon: 'none',
        title: '授权失败',
      })
    }
  },
  login: function () {
    wx.cloud.callFunction({
      name: 'login'
    }).catch(res => {
      wx.navigateTo({
        url: '../error/error?title=系统错误&desc=系统错误，稍后重试',
      })
    })
  }
})