//index.js
//获取应用实例
const app = getApp()
const baseUrl = app.globalData.baseUrl

Page({
  data: {
    curPage: 1,
    maxPage: 1,
    addrs: [],
    loadMoreTip: '',
    pullRefresh: false,
    loadStatus: false
  },
  onLoad: function () {
    this.getInitAddrs()
  },
  onPullRefresh: function () {
    this.getInitAddrs()
    this.setData({
      pullRefresh: false
    })
  },
  getInitAddrs: function () {
    let that = this
    this.setData({
      loadStatus: true
    })
    wx.showLoading({
      title: 'loading...',
    })
    wx.cloud.callFunction({
      name: 'getAddrs',
    }).then(res => {
      that.setData({
        curPage: res.result.curPage,
        maxPage: res.result.maxPage,
        addrs: res.result.addrs,
        loadStatus: false
      })
      wx.hideLoading()
    }).catch(res => {
      that.setData({
        loadStatus: false
      })
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '获取地址列表失败',
      })
    })
  },
  getMoreAddrs: function (curPage) {
    let that = this
    this.setData({
      loadStatus: true,
      loadMoreTip: 'loading...'
    })
    wx.cloud.callFunction({
      name: 'getAddrs',
      data: {
        curPage: curPage
      }
    }).then(res => {
      console.error(res)
      let newAddrs = that.data.addrs.concat(res.result.addrs)
      that.setData({
        curPage: res.result.curPage,
        maxPage: res.result.maxPage,
        addrs: newAddrs,
        loadMoreTip: '获取更多',
        loadStatus: false
      })
    }).catch(res => {
      that.setData({
        loadMoreTip: '获取失败，请稍后重试!',
        loadStatus: false
      })
    })
  },
  scrollToLower(e) {
    const {
      curPage,
      maxPage,
      loadStatus
    } = this.data
    if (curPage == maxPage) {
      this.setData({
        loadMoreTip: '没有更多数据'
      })
    } else if (!loadStatus) {
      this.getMoreAddrs(curPage + 1)
    }
  }
})