// pages/error/error.js
Page({
  data: {
    title: null,
    desc: null
  },

  onLoad: function (options) {
    this.setData({
      title: options.title,
      desc: options.desc
    })
  },

  okBtn: function () {
    wx.navigateBack({})
  }
})