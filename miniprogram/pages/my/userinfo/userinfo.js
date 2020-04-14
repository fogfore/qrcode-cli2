// pages/userinfo/userinfo.js
const app = getApp()

Page({
  data: {
    disabled: true,
    loading: false,
    realUserInfo: {},
  },
  onReady: function () {
    this.getRealUserInfo()
  },
  getRealUserInfo: function () {
    let that = this
    wx.cloud.callFunction({
      name: 'getRealUserInfo'
    }).then(res => {
      const data = res.result.data
      if (data.length == 1) {
        that.setData({
          realUserInfo: data[0]
        })
      }
    })
  },
  inputRealName: function (e) {
    this.data.realUserInfo.realName = e.detail.value
    if (this.data.disabled) {
      this.setData({
        disabled: false
      })
    }
  },
  inputPhone: function (e) {
    this.data.realUserInfo.phone = e.detail.value
    if (this.data.disabled) {
      this.setData({
        disabled: false
      })
    }
  },
  saveUserInfo: function () {
    let that = this
    this.setData({
      loading: true
    })
    wx.cloud.callFunction({
      name: 'updateRealUserInfo',
      data: {
        realName: that.data.realUserInfo.realName,
        phone: that.data.realUserInfo.phone
      }
    }).then(res => {
      wx.switchTab({
        url: '../my',
      })
      wx.showToast({
        title: '保存成功',
      })
    }).catch(res => {
      that.setData({
        loading: false,
        disabled: true
      })
      wx.showToast({
        icon: 'none',
        title: '保存失败',
      })
    })
  }
})