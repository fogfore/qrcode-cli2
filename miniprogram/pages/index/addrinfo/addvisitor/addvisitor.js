// pages/addvisitor/addvisitor.js
const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({
  data: {
    addrInfo: null,
    userInfo: null,
    showUserInfo: false,
    loading: false,
  },
  onLoad: function (options) {
    if (app.globalData.addrInfo == undefined || app.globalData.addrInfo == null) {
      wx.redirectTo({
        url: '../../../error/error?title=获取地址信息失败&desc=系统错误，请退出重试',
      })
    }
    this.setData({
      addrInfo: app.globalData.addrInfo,
      search: this.search.bind(this)
    })
    wx.setNavigationBarTitle({
      title: this.data.addrInfo.name,
    })
  },
  search: function (value) {
    let that = this
    const addrId = this.data.addrInfo._id
    return new Promise((resolve, reject) => {
      const db = wx.cloud.database()
      db.collection('user').where({
        realName: value
      }).get().then(res => {
        if (res.data) {
          let result = []
          for (const item of res.data) {
            result.push({
              text: item.realName + ' ' + item.phone,
              value: item
            })
          }
          resolve(result)
        }
      })
    })
  },
  selectResult: function (e) {
    this.setData({
      userInfo: e.detail.item.value,
      showUserInfo: true
    })
  },
  addVisitor: function () {
    let that = this
    if (!this.data.loading) {
      this.setData({
        loading: true
      })
      wx.cloud.callFunction({
        name: 'addVisitor',
        data: {
          addrId: this.data.addrInfo._id,
          userId: this.data.userInfo._id,
        }
      }).then(res => {
        that.setData({
          loading: false,
          showUserInfo: false
        })
        wx.showToast({
          icon: 'success',
          title: '添加成功',
        })
      }).catch(res => {
        wx.redirectTo({
          url: '../../../error/error?title=系统错误&desc=系统错误，请稍后重试',
        })
      })
    }
  }
})