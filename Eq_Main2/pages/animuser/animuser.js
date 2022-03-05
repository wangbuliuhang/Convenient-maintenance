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
    array0:[],
    array1:[],
    openid:'',
    assign:0,
    _id:''
  },
  onLoad: function(e) {
    let that=this
    this.setData({
      openid:e.openid,  //这个应该是管理员的openid
      assign:e.assign,  //不知道从别的地方访问缺少相应参数行吗 可以
      _id:e._id
    }),
    wx.getSystemInfo( {
      success: function( res ) {
        that.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    }),
  
    this.swichNav({'target':{'dataset':{'current':1}}})
    this.show_user()
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
  receive(e){
    wx.showLoading({
      title: '加载中',
    })
    let that=this
    if(that.data.assign==1){
      wx.cloud.database().collection("repairman").where({
        _openid:e.currentTarget.dataset.id
      }).get({
        success:function(res){
          if(res.data[0].has_task>=3){
            wx.showToast({
              title: '超过维修员任务数',
              icon:'none',
              duration:1500
            })
            that.setData({
              assign:0  //这个修改的一瞬间，wxml中的样式就被重新渲染
            })
          }
          else{
            let has_task=res.data[0].has_task
            wx.cloud.database().collection("Task").where({
              _id:that.data._id
            }).update({
              data:{
                repairman:e.currentTarget.dataset.id,
                complete:0
              },
              success:function(){
                  wx.cloud.database().collection("repairman").where({
                    _openid:e.currentTarget.dataset.id
                  }).update({
                    data:{
                      has_task:has_task+1
                    },
                    success:function(){
                      that.setData({
                        assign:0  //这个修改的一瞬间，wxml中的样式就被重新渲染
                      })
                      wx.hideLoading()
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
        }
      })
    }
  },
  onPullDownRefresh:function(){  //在调用完之后马上关掉下拉
    this.onLoad(wx.getStorageSync('openid'))
    this.onShow()
    wx.stopPullDownRefresh()
  },
  /*to_detail(e){
    console.log(e.currentTarget.dataset.id)
    wx.redirectTo({
      url: '../detail/detail?_id='+e.currentTarget.dataset.id,
    })
  },*/ //这个应该进客户和管理员的详细界面
  show_user(){
    let that=this
    wx.cloud.callFunction({
      name:'show_user',
      data:{
        a:0
      },
      success:function(res){
        console.log(res)
        that.setData({
          array0:res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name:'show_user',
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

