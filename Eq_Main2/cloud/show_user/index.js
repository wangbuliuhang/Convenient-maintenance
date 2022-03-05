// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"znljt-fjn7n"
})

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.a==0)
    return cloud.database().collection('customer').get()
 else if(event.a==1)
    return cloud.database().collection('repairman').get()
}