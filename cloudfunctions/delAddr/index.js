// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'qrcode-server-h9qkv'
})
const db = cloud.database()

async function delAddr(addrId, userId) {
  const addrRes = await db.collection('addr').where({
    _id: addrId,
    adminId: userId
  }).get()
  
  if (addrRes.data) {
    const delAddrRes = await db.collection('addr').doc(addrId).remove()
    const delAddrAuthRes = await db.collection('addr_auth').where({
      addrId: addrId
    }).remove()
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const addrId = event.addrId
  if (addrId == undefined || addrId == null || addrId == '') {
    return {
      code: '400'
    }
  }

  try {
    const userInfoRes = await db.collection('user').where({
      openId: wxContext.OPENID
    }).get()
    if (userInfoRes.data) {
      const delAddrRes = await delAddr(addrId, userInfoRes.data[0]._id)
    }

    return {
      code: '200'
    }
  } catch (e) {
    console.error('删除地址失败', e)
    return Promise.reject(e)
  }
}