// pages/addrinfo/addrinfo.js
const app = getApp()
const baseUrl = app.globalData.baseUrl

Page({
  data: {
    // 1 管理 2 访客 3 陌生
    auth: null,
    addrInfo: null,
  },
  onLoad: function (options) {
    const addrId = options.addrId
    let that = this
    if (addrId) {
      // 获取地址信息
      this.getAddrInfo(addrId)
      // 获取权限信息
      this.getAddrAuth(addrId)
    }
  },
  getAddrAuth: function (addrId) {
    let that = this
    wx.cloud.callFunction({
      name: 'getAddrAuth',
      data: {
        addrId: addrId
      }
    }).then(res => {
      if (res.result.auth) {
        that.setData({
          auth: res.result.auth
        })
      }
    }).catch(res => {
      wx.redirectTo({
        url: '../../error/error?title=获取权限信息失败&desc=系统错误，请稍后重试',
      })
    })
  },
  getAddrInfo: function (addrId) {
    let that = this
    const db = wx.cloud.database()
    db.collection('addr').doc(addrId).get().then(res => {
      if (res.data) {
        that.setData({
          addrInfo: res.data
        })
      }
    }).catch(res => {
      wx.redirectTo({
        url: '../../error/error?title=获取地址信息失败&desc=系统错误，请稍后重试',
      })
    })
  },
  dealAuth: function () {

  },
  delAddr: function () {
    if (this.data.auth != 1) {
      return
    }

  }
})