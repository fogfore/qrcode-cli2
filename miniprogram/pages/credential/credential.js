// pages/credential/credential.js
const app = getApp()
const baseUrl = app.globalData.baseUrl

Page({

  data: {
    userInfo: {},
    addrId: null,
    credentialUrl: null
  },

  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }

    this.data.addrId = options.addrId
    wx.setNavigationBarTitle({
      title: options.addrName,
    })
    this.getCredential()
  },
  getCredential: function () {
    let that = this
    wx.downloadFile({
      url: baseUrl + '/qrcode/get/credential/' + this.data.addrId,
      header: {
        skey: wx.getStorageSync('skey')
      },
      success: function (res) {
        if (res.statusCode === 200) {
          that.setData({
            credentialUrl: res.tempFilePath
          })
        }
      }
    })
  }
})