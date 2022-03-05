
// 引入coolsite360交互配置设定
require('coolsite.config.js');

// 获取全局应用程序实例对象
var app = getApp();
const _ = wx.cloud.database().command
// 创建页面实例对象
Page({
  name: "my",
  data: {
    items: [
      { name: 'user', value: '我是' },
      { name: 'maintenance', value: '我是维修者', checked: 'true' },
    ],
   email:'',
   tel:'',
   identify:'',
   pre_identify:'',
   has_task:0,
   name:'',
   satisfaction:''
  },
onLoad(){
  let that=this
    wx.cloud.database().collection('users').where({
      _openid:wx.getStorageSync('openid')
    }).get({
      success:function(res){
      console.log("lalala",res.data[0].identify)
      that.setData({
        pre_identify:res.data[0].identify
        //pre_identify:'repairman'
      })
    }
    }),
    wx.cloud.database().collection('repairman').where({
      _openid:wx.getStorageSync('openid'),
    }).get({
      success(res){
        that.setData({
          satisfaction:res.data[0].satisfaction
        })
      }
    })
},
  //以下为自定义点击事件
  name(e){
    this.setData({
      name:e.detail.value
    })
  },
  email(e){
    this.setData({
      email:e.detail.value
    })
  },
  tel(e){
    this.setData({  //获取不到就改成input2
      tel:e.detail.value
    })
  },
 identify(e){
   let that=this
  this.setData({
    identify:e.detail.value,
  })
  console.log(that.data.identify)
 },
  to_index: function(){
    let that=this
    let url=''
    if(that.data.pre_identify=='customer') url='../userindex/userindex'
    else url='../repairindex/repairindex'
    wx.redirectTo({
      url: url,
    })
  },
  
  loginout(){
    wx.removeStorageSync('openid'),
    wx.redirectTo({
      url: '../index/index',
    })
  },
  change(){
    let that=this
    if(that.data.pre_identify!=that.data.identify){
      if(that.data.identify=="customer"){
      //console.log(that.data.pre_identify)
        wx.cloud.database().collection(that.data.pre_identify).where({
          _openid:wx.getStorageSync('openid'),
          has_task:0,
        }).remove({
          success:function(res){  //其实效果类似于complete
            if(res.stats.removed>0){
              wx.cloud.database().collection(that.data.identify).add({
                data:{
                  email:that.data.email,
                  tel:that.data.tel,
                  has_task:0,
                  identify:that.data.identify,
                  name:that.data.name
                },
                success:function(){
                  that.change_user()
                  console.log("修改成功1")
                }
              })
            }
            else{
              wx.showToast({
                title: '还有未完成任务',
                duration: 1000,
                icon: 'none'
              })
            }
        }
        })
    }
    else if(that.data.identify=="repairman"){
      wx.cloud.database().collection(that.data.pre_identify).where({
        _openid:wx.getStorageSync('openid'),
        has_task:0,
      }).remove({
        success:function(res){
          console.log(res)
          if(res.stats.removed>0){
            wx.cloud.database().collection(that.data.identify).add({
              data:{
                email:that.data.email,
                tel:that.data.tel,
                has_task:0,
                //identify:that.data.identify,
                name:that.data.name,
                satisfaction:0
              },
              success:function(){
                that.change_user()
                console.log("修改成功1")
              }
            })
          }
          else{
            wx.showToast({
              title: '还有未完成任务',
              duration: 1000,
              icon: 'none'
            })
          }
      }
      })
    }
    }
    else{
      wx.cloud.database().collection(that.data.identify).where({
        _openid:wx.getStorageSync('openid')
      }).update({
        data:{
          name:that.data.name,
          email:that.data.email,
          tel:that.data.tel
        },
        success:function(){
          //that.change_user()
          console.log("修改成功2",that.data.email,that.data.tel)
          
          wx.redirectTo({
            url: '../index/index',
            success:function(){
              wx.showToast({
                title: '修改成功',
                duration: 1000,
                icon: 'success'
              })
            }
          })
        }
      })
    }
  },
  change_user(){
    let that=this
    wx.cloud.database().collection('users').where({
      _openid:wx.getStorageSync('openid')
    }).update({
      data:{
        identify:that.data.identify
      },
      success:function(){
        wx.redirectTo({
          url: '../index/index',
          success:function(){
            wx.showToast({
              title: '修改成功',
              duration: 1000,
              icon: 'success'
            })
          }
        })
        
      }
    })
  },
  collection_code(){
    let that=this
    let imageUrl='cloud://znljt-fjn7n.7a6e-znljt-fjn7n-1300546603/'+wx.getStorageSync('openid')+'.png'  //维修员收款款二维码存储路径，直接用_openid
    let temp=[]
    temp.push(imageUrl)
    wx.previewImage({
      current: './', // 当前显示图片的http链接
      urls: temp, // 需要预览的图片http链接列表
    })
  },
  upload_collection(){
    let that=this
    let tempFilePaths=''
    let openid=wx.getStorageSync('openid')
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        tempFilePaths=res.tempFilePaths[0]
        wx.cloud.uploadFile({
          cloudPath:openid+'.png',
          filePath: tempFilePaths, // 小程序临时文件路径
          success:function(res) {
            // 返回文件 ID
            console.log("上传成功",res.fileID)
            wx.showToast({
              title: '提交成功',
              icon:'none',
              duration:1500
            })
          }
      })
      }
 })
}
})

