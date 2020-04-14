// pages/addaddr/addaddr.js
const app = getApp()
const baseUrl = app.globalData.baseUrl

Page({
  data: {
    addrInfo: {},
    loading: false
  },

  onLoad: function (options) {
    if (app.globalData.userInfo == null) {
      wx.switchTab({
        url: '../my',
      })
      wx.showToast({
        icon: 'none',
        title: '请先授权',
      })
    }
    wx.setNavigationBarTitle({
      title: '新增地址',
    })
  },

  inputName: function (e) {
    this.data.addrInfo.name = e.detail.value
  },

  inputLocation: function (e) {
    this.data.addrInfo.location = e.detail.value
  },

  inputDesc: function (e) {
    this.data.addrInfo.desc = e.detail.value
  },

  saveAddr: function () {
    let that = this
    this.setData({
      loading: true
    })
    wx.cloud.callFunction({
      name: 'addAddrInfo',
      data: this.data.addrInfo
    }).then(res => {
      wx.switchTab({
        url: '../my',
      })
      wx.showToast({
        title: '添加成功',
      })
    }).catch(res => {
      wx.redirectTo({
        url: '../../error/error?title=保存失败&desc=服务器错误，请稍后重试',
      })
    })
  }
})