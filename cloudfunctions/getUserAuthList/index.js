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
  if (event.addrId == undefined || event.addrId == null ||
    event.realName == undefined || event.realName == null) return {
    code: '400'
  }

  try {
    const queryRes = await db.collection('user').aggregate().lookup({
      from: 'addr_auth',
      let: {
        userId: '$_id'
      },
      pipeline: $.pipeline().match(_.expr($.and([
        $.eq(['$addrId', event.addrId]),
        $.eq(['$userId', '$$userId'])
      ]))).project({
        _id: 0,
        addrId: 1,
        userId: 1,
        auth: 1
      }).done(),
      as: 'addrAuth'
    }).replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$addrAuth', 0]), '$$ROOT'])
    }).project({
      addrAuth: 0
    }).match({
      realName: event.realName,
      auth: null
    }).end()

    console.error(queryRes)

    return {
      code: '200',
      data: queryRes.data
    }
  } catch (e) {
    console.error('查询用户失败', e)
    return Promise.reject(e)
  }
}