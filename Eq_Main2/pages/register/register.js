

// 获取全局应用程序实例对象
const app = getApp();

let Openid=''
// 创建页面实例对象
Page({
  data: {
    name:'',
    tel:'',
    email:'',
    identify:''
  },
  onLoad: function (e) {
    Openid = e.Openid
    console.log("传来的参数", e.Openid)
  },
  radioChange(e){
    console.log(e.detail.value)
    this.setData({
      identify:e.detail.value
    })
  },
  register(e) {
    let that=this
      if (e.detail.value.name.length == 0 || e.detail.value.tel.length == 0|| e.detail.value.email.length == 0||this.data.identify=='') 
      {  //这一部分还要拓展，每个内容
        wx.showToast({
          title: '内容不得为空!',
          icon: 'none',
          duration: 1500
        })
      }  
      else{
        that.setData({
          name:e.detail.value.name,
          tel:e.detail.value.tel,
          email:e.detail.value.email
        })
        //往数据库里插数据
        wx.cloud.database().collection('users').add({
          data:{
            openid:Openid,
            identify:that.data.identify
          },
          success:function(res){
            that.insert_identify()
            console.log("注册成功1")
            //调用函数继续插入，插入到相应的身份表中，成功后跳转到相应界面
            let url=''
            if(that.data.identify=='customer'){
              url='../userindex/userindex?openid='+Openid
            }
            else if(that.data.identify=='repairman'){
              url='../repairindex/repairindex?openid='+Openid
            }
            wx.redirectTo({
              url: url,
            })
          },
          fail:function(){
            console.log("注册失败")
          }
        })
        
        }
    },
    insert_identify(){
      let that=this
      if(that.data.identify=="customer"){
        wx.cloud.database().collection("customer").add({
          data:{
            name:that.data.name,
            tel:that.data.tel,
            email:that.data.email,
            has_task:0
          },success:function(){
            console.log("注册成功2")
            wx.showToast({
              title: '注册成功',
              duration: 1000,
              icon: 'success'
            })
          }
        })
      }else if(that.data.identify=="repairman"){
        wx.cloud.database().collection("repairman").add({
          data:{
            name:that.data.name,
            tel:that.data.tel,
            email:that.data.email,
            has_task:0,
            satisfaction:0
          },success:function(){
            console.log("注册成功2")
            wx.showToast({
              title: '注册成功',
              duration: 1000,
              icon: 'success'
            })
          }
        })
      }
    }

})

