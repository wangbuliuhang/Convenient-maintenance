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
    array2:[],
    array3:[],
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


    this.dealing()
    this.unpaid()
    this.completed()
    this.swichNav({'target':{'dataset':{'current':0}}})
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
  dealing(){
    let that=this
    task.where({  //相应openid的用户和repairman为空时
      repairman:that.data.openid,
      complete: _.gte(0).and(_.lte(1))
    }).get({
      success:function(res){
        console.log("查询成功",res.data[0])
        that.setData({
          array1:res.data
        })
      }
    })
  },
  unpaid(){
    let that=this
    task.where({  //相应openid的用户和repairman为空时
      repairman:that.data.openid,
      complete: _.gte(2).and(_.lte(3))
    }).get({
      success:function(res){
        console.log("查询成功",res.data[0])
        that.setData({
          array2:res.data
        })
      }
    })
  },
  completed(){
    let that=this
    task.where({  //相应openid的用户和repairman为空时
      repairman:that.data.openid,
      complete:4
    }).get({
      success:function(res){
        console.log("查询成功",res.data[0])
        that.setData({
          array3:res.data
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
      url: '../repairindex/repairindex',
    })
  },
  to_my(){
    wx.redirectTo({
      url: '../my_detail/my_detail',
    })
  }
})

