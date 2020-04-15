// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'qrcode-server-h9qkv'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  const $ = db.command.aggregate

  try {
    const queryRes = await db.collection('addr_auth').aggregate().lookup({
      from: 'user',
      let: {
        userId: '$userId'
      },
      pipeline: $.pipeline().match(_.expr($.and([
        $.eq(['$_id', '$$userId'])
      ]))).project({
        city: 0,
        country: 0,
        createTime: 0,
        updateTime: 0,
        gender: 0,
        language: 0,
        nickName: 0,
        openId: 0,
        province: 0,
      }).done(),
      as: 'user',
    }).match({
      addrId: event.addrId,
      auth: '2',
    }).replaceRoot({
      newRoot: $.arrayElemAt(['$user', 0])
    }).end()

    return {
      visitors: queryRes.list
    }
  } catch (e) {
    console.error('获取访客列表失败', e)
    return Promise.reject(e)
  }
}