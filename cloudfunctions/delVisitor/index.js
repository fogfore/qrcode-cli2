// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'qrcode-server-h9qkv'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  try {
    const addrRes = await db.collection('addr').doc(event.addrId).get()
    const userRes = await db.collection('user').where({
      openId: wxContext.OPENID
    }).get()

    if (addrRes.data.adminId == userRes.data[0]._id) {
      const delRes = await db.collection('addr_auth').where({
        userId: event.userId,
        addrId: event.addrId,
        auth: '2'
      }).remove()
    }

    return {
      code: '200'
    }
  } catch (e) {
    console.error('删除访客异常', e)
    return Promise.reject(e)
  }
}