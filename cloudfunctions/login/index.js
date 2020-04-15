const cloud = require('wx-server-sdk')

cloud.init({
  env: 'qrcode-server-h9qkv'
})

exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()

  try {
    const userInfoRes = await db.collection('user').where({
      openId: wxContext.OPENID
    }).get()

    let newUser = {
      updateTime: new Date()
    }
    Object.assign(newUser, event.userInfo)
    if (userInfoRes.data) {
      const updateRes = await db.collection('user').doc(userInfoRes.data[0]._id).update({
        data: newUser
      })
    } else {
      newUser.openId = wxContext.OPENID
      newUser.createTime = newUser.updateTime
      const addRes = await db.collection('user').add({
        data: newUser
      })
    }

    return {
      code: '200'
    }
  } catch (e) {
    console.error('登录失败', e)
    return Promise.reject('登录失败')
  }
}