// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'qrcode-server-h9qkv'
})

// 1 管理员 2 访客 3未知
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  try {
    const userInfoRes = await db.collection('user').where({
      openId: wxContext.OPENID
    }).get()

    if (userInfoRes.data.length == 1) {
      const addrAuthRes = await db.collection('addr_auth').where({
        addrId: event.addrId,
        userId: userInfoRes.data[0]._id
      }).get()

      if (addrAuthRes.data.length == 1) {
        return {
          userInfo: userInfoRes.data[0],
          auth: addrAuthRes.data[0].auth
        }
      }
    }

    return {
      auth: '3'
    }

  } catch (e) {
    console.error('获取地址权限失败', e)
    return Promise.reject(e)
  }
}