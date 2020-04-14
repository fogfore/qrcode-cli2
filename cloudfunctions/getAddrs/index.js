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
    const totalRes = await db.collection('addr').count()
    const total = totalRes.total
    const pageNum = 20
    const maxPage = Math.ceil(total / pageNum)
    let curPage = event.curPage
    if (curPage == undefined || curPage < 1 || curPage > maxPage) {
      curPage = 1
    }
  
    const addrsRes = await db.collection('addr').skip((curPage - 1) * pageNum).limit(pageNum).get()
    let addrs = []
    if (addrsRes.data) {
      addrsRes.data.forEach(value => {
        addrs.push({
          _id: value._id,
          name: value.name
        })
      });
    }

    return {
      maxPage: maxPage,
      curPage: curPage,
      addrs: addrs
    }
  } catch (e) {
    console.error('获取地址列表失败', e)
    return Promise.reject(e)
  }
}