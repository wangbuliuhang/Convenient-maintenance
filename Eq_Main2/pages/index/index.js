//连接数据库
const db = wx.cloud.database()
const user = db.collection('users')
// 获取全局应用程序实例对象
//const app = getApp();

// 创建页面实例对象
let Openid=''
Page({
  //以下为自定义点击事件
  login: function(){
    let that=this //这里的this是指全局的
    wx.showModal({
      title: '申请',
      content: '获取您的昵称、头像及小程序用户ID',
      success: function(res) {
       if (res.confirm) {
        console.log('用户点击确定')
        that.getopenid()
       }
      }
     })
    
  },
  //通过openid查询数据库
  getopenid(){
    let that=this  //这个不加不对，可以理解成前的this是此一层函数外的
    wx.cloud.callFunction({
      name:"getOpenid",
      success:function(res){  //这个地方仅仅是掉用云函数成功还是成功获取openid？
        console.log("获取成功",res.result.openid)
        Openid=res.result.openid
        wx.setStorageSync('openid', Openid)
        that.seekByOpenid()
      },
      fail:function(res){
        console.log("获取失败")
      }
    })
  },
  seekByOpenid(){
    let that=this
    user.where({
      openid:Openid
    }).get().then(res => {
      if(res.data.length>0) {
        console.log("存在用户",res.data)  //不用null或.length!=0
        //跳转到客户或设备维修员界面
        let url=''
        if(res.data[0].identify=='customer'){
          url='../userindex/userindex?openid='+Openid
        }
        else if(res.data[0].identify=='repairman'){
          url='../repairindex/repairindex'
        }
        else if(res.data[0].identify=='administrator'){
            url='../animindex/animindex'
        }
        wx.redirectTo({
          url:url
         })
      }
      
      else {
        console.log("不存在用户",Openid)
        wx.redirectTo({
         url: '../register/register?Openid='+Openid,
        })
      }
    })
  },
  onPullDownRefresh () {
    wx.stopPullDownRefresh()
  }
})

