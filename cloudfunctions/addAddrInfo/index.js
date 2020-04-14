// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'qrcode-server-h9qkv'
})
const db = cloud.database({
  throwOnNotFound: false,
})

async function addAddrInfo(tx, data) {
  await tx.collection('addr').add({
    data: {
      name: data.name,
      location: data.location,
      desc: data.desc,
      adminId: data.adminId
    }
  }).then(res => {
    data._id = res._id
  })
  await tx.collection('addr_auth').add({
    data: {
      addrId: data._id,
      userId: data.adminId,
      auth: '1'
    }
  })

  return {
    addrId: data._id
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    await db.collection('user').where({
      openId: wxContext.OPENID
    }).get().then(res => {
      event.adminId = res.data[0]._id
    })
    if (event.adminId == undefined) return Promise.reject('系统错误')
    
    return await db.runTransaction(tx => addAddrInfo(tx, event))
  } catch (e) {
    console.error(`添加地址失败`, e)
    return Promise.reject('添加地址失败')
  }
}