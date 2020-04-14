// pages/addvisitor/addvisitor.js
const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({
  data: {
    addrInfo: null,
    realUserInfo: null,
    userInfo: null,
    showUserInfo: false,
    loading: false,
  },
  onLoad: function (options) {
    if (app.globalData.addrInfo == null || app.globalData.addrInfo == undefined) {
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
    return new Promise((resolve, reject) => {
      const db = wx.cloud.database()
      db.collection('user').where({
        realName: {
          $regex: '.*' + value + '.*',
          $options: 'i'
        }
      }).get({
        success: res => {
          if (res.data.length > 0) {
            let temp = []
            for (let i = 0; i < res.data.length; i++) {
              temp.push({
                text: res.data[i].name + ' ' + res.data[i].phone,
                value: res.data[i]
              })
            }
          }
        }
      })
    })
  },
  selectResult: function (e) {
    console.log(e)
    this.setData({
      realUserInfo: e.detail.item.value,
      showUserinfo: true
    })
  },
  addVisitor: function () {
    let that = this
    this.setData({
      loading: true
    })
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('addr').where({
      _id: this.data.addrInfo._id
    }).update({
      data: {
        visitors: _.addToSet(this.data.realUserInfo._openid)
      },
      success: res => {
        that.setData({
          loading: false,
          showUserInfo: false
        })
        wx.showToast({
          icon: 'success',
          title: '添加成功',
        })
      },
      fail: res => {
        wx.redirectTo({
          url: '../../../error/error?title=添加用户失败&desc=服务器错误，请稍后重试',
        })
      }
    })
  }
})