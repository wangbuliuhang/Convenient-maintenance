// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"znljt-fjn7n"
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
 
  if(event.a==-1)
    return cloud.database().collection('Task').where({
      complete:-1
    }).get()
  else if(event.a==1)
    return cloud.database().collection('Task').where({
      complete: 1
    }).get()
    else if(event.a==4)
    return cloud.database().collection('Task').where({
      complete:4
    }).get()
    else if(event.a==0)
    return cloud.database().collection('Task').where({
      complete:0
    }).get()
  else if(event.a==23)
    return cloud.database().collection('Task').where({
      complete: _.gte(2).and(_.lte(3))
    }).get()
  
}