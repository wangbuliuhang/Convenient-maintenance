
// 引入coolsite360交互配置设定
require('coolsite.config.js');

// 获取全局应用程序实例对象
var app = getApp();
var util = require('../../utils/util.js');
// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "add",
  /**
   * 页面的初始数据
   */

  data: {
    tempFilePaths: '',
    title:'',
    place:'',
    detail:'',
    create_date:'',
    has_task:5,
    _id:''
  },

  onLoad () {
    // 注册coolsite360交互模块
    app.coolsite360.register(this);
  },

  //以下为自定义点击事件
  chooseimage: function () {
    let that = this;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths:res.tempFilePaths
        })
      }
    })
  },
  userindex: function(options){
    wx.redirectTo({
      url: '../userindex/userindex',
    })
  },
  submit(e){
    var m = (new Date()).getMinutes().toString();//获得当前分钟数
//开始缓存池中没有分钟数，当前分钟数肯定不等于缓存中的分钟数，当前可以执行
    if (m != wx.getStorageSync('m')){  //这个地方还是有点漏洞，上传的太慢了
      wx.setStorageSync('m', m)//把分钟数放到缓存
      let that=this
      this.setData({
        title:e.detail.value.input1,
        place:e.detail.value.input2,
        detail:e.detail.value.input3,
        create_date:util.formatTime(new Date())
      }),
      wx.cloud.database().collection("customer").where({
        _openid:wx.getStorageSync('openid')
      }).get({
        success:function(res){
          that.setData({
            has_task:res.data[0].has_task,
            _id:res.data[0]._id
          })
          if(that.data.has_task>=5){
            wx.showToast({
              title: '达到任务上线',
              duration: 1000,
              icon: 'none'
            })
        }else{
          //创建 上传图片 用户任务数加一 最后显示创建成功
          that.create()
        }
      }
    })
  }
  else
  {
      //当发生了1分钟内多次点击等事件，弹窗提示或者做别的操作。
      wx.showToast({
        title: '每分钟只能提交一次！',
        icon: 'none',
        duration: 1000
      })
  }
    
  },
  create(){
    let that=this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.database().collection("Task").add({
      data:{
        create_date:that.data.create_date,
        change_date:that.data.create_date,
        complete:-1,
        customer:wx.getStorageSync('openid'),
        detail_des:that.data.detail,
        place:that.data.place,
        title:that.data.title,
        repairman:''
      },
      success(res){
        console.log("创建成功1",res)
        //res._id 唯一标识
        that.setData({
          _id:res._id
        })
        //上传图片
        for(let i=0;i<that.data.tempFilePaths.length;i++){
          that.upload_img(that.data.tempFilePaths[i],i,that.data.tempFilePaths.length)  //这里如果直接用this那么选择的仅仅是chooseImage里面的
        }
        //加一
      },
      fail:function(){
        wx.showToast({
          title: '上传失败!',
          icon: 'none',
          duration: 1000
        })
      }
      })
  },
  upload_img(tempFilePaths,i,k){
    //在另一个中用的时候要求点开详情页时获取到数据库中任务详细信息 得到_id
    let that=this
    wx.cloud.uploadFile({
      cloudPath:that.data._id+'1'+i+'.png', //1是指的客户，2是指的维修员
      filePath: tempFilePaths, // 小程序临时文件路径
      success:function(res) {
        // 返回文件 ID
        console.log("上传成功",res.fileID)
        if(i==k-1){
          that.add1()
        }
      },
      fail:function(res)   //这里应该是没重写function函数要直接用error,不要改成输出
      {
        console.log("上传图片"+i+"失败")
        wx.showToast({
          title: "上传图片"+i+"失败!",
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //cloud://znljt-fjn7n.7a6e-znljt-fjn7n-1300546603/1596422485335.png
  add1(){
    let that=this
    wx.cloud.database().collection("customer").where({
      _openid:wx.getStorageSync('openid')
    }).update({
      data:{
        has_task:that.data.has_task+1
      }
      ,fail(){
        wx.showToast({
          title: '上传失败!',
          icon: 'none',
          duration: 1000
        })
      },
      success(){
        wx.hideLoading()
        wx.showToast({  //这个地方的处理有点粗糙
          title: '上传成功!',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  onPullDownRefresh () {
    wx.stopPullDownRefresh()
}

})

//date具体做的时候按照怎么好生成就用什么格式 不一定非要date类型 string类型也可

