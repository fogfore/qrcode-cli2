export function login(userInfo) {
  wx.cloud.callFunction({
    name: 'login',
    data: {
      userInfo: userInfo
    }
  }).catch(res => {
    wx.redirectTo({
      url: '../error/error?title=系统错误&desc=系统错误，请稍后重试',
    })
  })
}