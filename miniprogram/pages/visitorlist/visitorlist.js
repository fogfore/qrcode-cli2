// pages/visitorlist/visitorlist.js
const app = getApp()
const baseUrl = app.globalData.baseUrl

Page({
  data: {
    addrId: null,
    addrName: null,
    visitors: []
  },
  onLoad: function (options) {
    this.setData({
      addrId: options.addrId,
      addrName: options.addrName
    })
    wx.setNavigationBarTitle({
      title: options.addrName,
    })
    let that = this
    wx.request({
      url: baseUrl + '/user/list/visitors/' + options.addrId,
      header: {
        skey: wx.getStorageSync('skey')
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == '200') {
          let data = res.data.data
          for (let i = 0; i < data.length; i++) {
            if (data[i].addrAuth == 1) {
              data[i].slideBtns = [{
                text: '删除',
                data: data[i].id
              }]
            }
          }
          that.setData({
            visitors: data
          })
        }
      }
    })
  },
  slideButtonTap: function (e) {
    let that = this
    wx.request({
      url: baseUrl + '/user/del/visitor',
      method: 'POST',
      header: {
        skey: wx.getStorageSync('skey')
      },
      data: {
        addrId: this.data.addrId,
        visitorId: e.detail.data
      },
      success: function (res) {
        if (res.data.status == '200') {
          that.onLoad({
            addrId: that.data.addrId,
            addrName: that.data.addrName
          })
          wx.showToast({
            title: '删除成功',
            duration: 3000
          })
          that.onLoad({
            addrId: that.data.addrId,
            addrName: that.data.addrName
          })
        }
      }
    })
  }
})