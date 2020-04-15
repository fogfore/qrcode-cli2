// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'qrcode-server-h9qkv'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database({
    throwOnNotFound: false
  })

  try {
    const userInfoRes = await db.collection('user').where({
      openId: wxContext.OPENID
    }).get()
    if (userInfoRes.data) {
      const adminAuthRes = await db.collection('addr').doc(event.addrId).get()
      // 判断是否管理员
      if (adminAuthRes.data.adminId == userInfoRes.data[0]._id) {
          const existRes = await db.collection('addr_auth').where({
            addrId: event.addrId,
            userId: event.userId
          }).get()

          if (existRes.data.length == 0) {
            const addRes = await db.collection('addr_auth').add({
              data: {
                userId: event.userId,
                addrId: event.addrId,
                auth: '2'
              }
            })
          }
      }
    }

  } catch (e) {
    console.error('更新地址权限失败', e)
    return Promise.reject(e)
  }
}