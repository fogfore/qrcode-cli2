// pages/visitorinfo/visitorinfo.js
const app = getApp()
const baseUrl = app.globalData.baseUrl

Page({
  data: {
    visitor: {},
    permitVisit: false,
    addrId: null,
    addrName: null
  },

  onLoad: function (options) {
    this.data.addrId = options.addrId
    this.data.addrName = options.addrName
    wx.setNavigationBarTitle({
      title: options.addrName,
    })
    this.getVisitor(options.credential, options.addrId)
  },
  getVisitor: function (credential, addrId) {
    let that = this
    wx.request({
      url: baseUrl + '/user/get/visitorinfo',
      method: 'POST',
      header: {
        skey: wx.getStorageSync('skey')
      },
      data: {
        credential: credential,
        addrId: addrId
      },
      success: function (res) {
        if (res.data.status == '200') {
          let visitor = res.data.data
          let permitVisit = that.isPermitVisit(visitor.auth)
          that.setData({
            visitor: visitor,
            permitVisit: permitVisit
          })
        } else {
          wx.redirectTo({
            url: '/pages/error/error?title=拒绝访问&desc=该用户没有访问' + that.data.addrName + '的权限',
          })
        }
      }
    })
  },
  isPermitVisit: function (auth) {
    if (auth == '1' || auth == '2') {
      return true
    }
    return false
  }
})