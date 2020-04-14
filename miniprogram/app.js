//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'qrcode-server-h9qkv'
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
          this.login()
        }
      }
    })
  },
  login: function () {
    wx.cloud.callFunction({
      name: 'login'
    }).catch(res => {
      wx.redirectTo({
        url: '../error/error?title=系统错误&desc=系统错误，稍后重试',
      })
    })
  },
  globalData: {
    userInfo: null
  }
})