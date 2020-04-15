// pages/visitorlist/visitorlist.js
const app = getApp()
const baseUrl = app.globalData.baseUrl

Page({
  data: {
    addrInfo: null,
    visitors: []
  },
  onLoad: function (options) {
    if (app.globalData.addrInfo == undefined || app.globalData.addrInfo == null) {
      wx.redirectTo({
        url: '../../../error/error?title=获取地址信息失败&desc=系统错误，请退出重试',
      })
    }
    this.setData({
      addrInfo: app.globalData.addrInfo
    })
    wx.setNavigationBarTitle({
      title: app.globalData.addrInfo.name,
    })
    this.getVisitors()
  },
  getVisitors: function () {
    wx.cloud.callFunction({
      name: 'getVisitors',
      data: {
        addrId: this.data.addrInfo._id
      }
    }).then(res => {
      if (res.result.visitors) {
        const visitors = res.result.visitors
        for (let i = 0; i < visitors.length; i++) {
          visitors[i].slideBtn = [{
            text: '删除',
            data: visitors[i]._id
          }]
        }
        this.setData({
          visitors: visitors
        })
      }
    })
  },
  slideButtonTap: function (e) {
    console.log(e)
    let that = this
    const userId = e.detail.data
    wx.cloud.callFunction({
      name: 'delVisitor',
      data: {
        addrId: this.data.addrInfo._id,
        userId: userId
      }
    }).then(res => {
      wx.showToast({
        icon: 'success',
        title: '删除访客成功',
      })
      this.getVisitors()
    }).catch(res => {
      wx.redirectTo({
        url: '../../../error/error?title=删除访客失败&desc=系统错误，请稍后重试',
      })
    })
  }
})