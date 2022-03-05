
// 引入coolsite360交互配置设定
require('coolsite.config.js');

// 获取全局应用程序实例对象
// 创建页面实例对象
Page({
  data: {
    name:'',
    identify:'',
    satisfaction:'',
    tel:''
  },
  onLoad(){
    let that=this
    wx.cloud.database().collection('users').where({
      _openid:wx.getStorageSync('openid')
    }).get({
      success:function(res){
      that.setData({
        identify:res.data[0].identify
      })
      wx.cloud.database().collection(that.data.identify).where({
        _openid:wx.getStorageSync('openid')
      }).get({
        success:function(res){
          that.setData({
            name:res.data[0].name,
            tel:res.data[0].tel,
            email:res.data[0].email
          })
          if(that.data.identify=='repairman'){
            that.setData({
              satisfaction:res.data[0].satisfaction
            })
          }
        }
      })
    }
    })
  },
  loginout(){
    wx.removeStorageSync('openid'),
    wx.redirectTo({
      url: '../index/index',
    })
  },
  to_information(){
    wx.redirectTo({
      url: '../my/my',
    })
  },
  to_index: function(){
    let that=this
    let url=''
    if(that.data.identify=='customer') url='../userindex/userindex'
    else url='../repairindex/repairindex'
    wx.redirectTo({
      url: url,
    })
  },
})

