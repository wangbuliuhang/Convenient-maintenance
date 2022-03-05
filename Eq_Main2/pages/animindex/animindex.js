//连接数据库
const db = wx.cloud.database()
const cus = db.collection('Cuetomer')
const task = db.collection('Task')
const rep = db.collection('Repairman')
const _ = db.command
// 创建页面实例对象
Page({
  name: "userindex",
  data: {
    array1:[],
    array_1:[],
    array4:[],
    array0:[],
    array23:[],
    openid:''
  },
  onLoad: function(e) {
    let that=this
    this.setData({
      openid:e.openid
    }),
    wx.getSystemInfo( {
      success: function( res ) {
        that.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    }),
    this.swichNav({'target':{'dataset':{'current':0}}})
    this.show_task()
  },
  bindChange: function( e ) {
    var that = this;
    if(e.detail.source=='autoplay'||e.detail.source=='touch')
    that.setData( { 
      currentTab: e.detail.current 
    });
  },
  swichNav: function( e ) {
    var that = this;
    if( this.data.currentTab === e.target.dataset.current ) {
      return false;
    } else {
      that.setData( {
        currentTab: e.target.dataset.current
      })
    }
  },
  show_task(){
    console.log("巴拉巴拉")
    let that=this
    wx.cloud.callFunction({
      name:'show_task',
      data:{
        a:-1
      },
      success:function(res){
        console.log(res)
        that.setData({
          array_1:res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name:'show_task',
      data:{
        a:1
      },
      success:function(res){
        console.log(res)
        that.setData({
          array1:res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name:'show_task',
      data:{
        a:0
      },
      success:function(res){
        console.log(res)
        that.setData({
          array0:res.result.data
        })
      },
      fail(){
        console.log("失败了")
      }
    })
    wx.cloud.callFunction({
      name:'show_task',
      data:{
        a:23
      },
      success:function(res){
        console.log(res)
        that.setData({
          array23:res.result.data
        })
      }
    })
  
  wx.cloud.callFunction({
    name:'show_task',
    data:{
      a:4
    },
    success:function(res){
      console.log(res)
      that.setData({
        array4:res.result.data
      })
    },
    fail(){
      console.log("失败了4")
    }
  })
  },

  assign(e){
    wx.redirectTo({
      url: '../animuser/animuser?_id='+e.currentTarget.dataset.id+'&assign='+1,
    })
  },
  pass(e){
    wx.cloud.database().collection("Task").where({
      _id:e.currentTarget.dataset.id,
      complete:1  //有了这个条件，就可以直接将其他的结果都混入待审核当中
    }).update({
      data:{
        complete:2
      },
      success:function(){
        wx.showToast({
          title: '提交成功',
          icon:'none',
          duration:1500
        })
      }
    })
  },
  onPullDownRefresh:function(){  //在调用完之后马上关掉下拉
    this.onLoad(wx.getStorageSync('openid'))
    this.onShow()
    wx.stopPullDownRefresh()
  },
  to_detail(e){
    console.log(e.currentTarget.dataset.id)
    wx.redirectTo({
      url: '../detail/detail?_id='+e.currentTarget.dataset.id,
    })
  },
  to_userindex(){
    wx.redirectTo({
      url: '../userindex/userindex',
    })
  },
  to_user(){
    wx.redirectTo({
      url: '../animuser/animuser',
    })
  },
  to_task(){
    wx.redirectTo({
      url: '../animindex/animindex',
    })
  }
})

