//app.js
import {
  login
} from './utils/login.js'

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
              login(res.userInfo)
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})