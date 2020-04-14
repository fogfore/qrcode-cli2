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
    console.log(options)
    let that = this
    const db = wx.cloud.database()
    db.collection('addr').where({
      _id: options.addrId
    }).get({
      success: res => {
        console.log(res)
        console.log(res.data.length)
        if (res.data.length == 1) {
          console.log('开始设置')
          console.log(res.data[0]._openid + ' ' + app.globalData.openid)
          // console.log(res.data[0].visitors.indexOf(app.globalData.openid))
          let auth = 3
          // if (res.data[0]._openid == app.globalData.openid) {
          //   auth = 1
          // } else if (res.data[0].visitors.indexOf(app.globalData.openid) > -1) {
          //   auth = 2
          // }
          console.log('设置参数')
          that.setData({
            auth: auth,
            addrInfo: res.data[0]
          })
          wx.setNavigationBarTitle({
            title: res.data[0].name,
          })
          app.globalData.addrInfo = res.data[0]
          console.log(that.data)
        }
      }
    })
  },
  dealAuth: function () {

  },
  delAddr: function () {

  }
})