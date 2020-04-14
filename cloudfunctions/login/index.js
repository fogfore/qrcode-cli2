const cloud = require('wx-server-sdk')

cloud.init({
  env: 'qrcode-server-h9qkv'
})

exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  try {
    const userInfo = await db.collection('user').where({
      openId: wxContext.OPENID
    }).get()

    if (userInfo.data.length == 0) {
      return await db.collection('user').add({
        data: {
          openId: wxContext.OPENID,
          createTime: new Date(),
          updateTime: new Date()
        }
      })
    }

    return {
      userId: userInfo.data._id
    }
  } catch (e) {
    console.error('登录失败', e)
    return Promise.reject('登录失败')
  }
}