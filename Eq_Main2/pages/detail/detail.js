
// 引入coolsite360交互配置设定
require('coolsite.config.js');

// 获取全局应用程序实例对象
var app = getApp();
var util = require('../../utils/util.js');
// 创建页面实例对象
Page({

  name: "detail",

  data: {
    tempFilePaths: '',
    title:'',
    place:'',
    detail_des:'',
    create_date:'',
    change_date:'',
    complete:0,
    _id:'',
    customer:'',
    repairman:'',
    name1:'',
    tel1:'',
    email1:'',
    name2:'',
    tel2:'',
    email2:'',
    satisfaction:0,
    current1:70,  //当前进度条的数值
    current2:'',//当亲进度的文字描述
    curopenid:wx.getStorageSync('openid'),
    slider:0,  //当前评分
    has_task1:0,
    has_task2:0
  },

  onLoad (e) {
    console.log("00000",e._id)
    // 注册coolsite360交互模块
    let that=this
    app.coolsite360.register(this);
    that.getslider({'detail':{'value':6}})
    wx.cloud.database().collection("Task").where({
      _id:e._id
    }).get({
      success:function(res){
        that.setData({
          _id:e._id,
          title:res.data[0].title,
          place:res.data[0].place,
          detail_des:res.data[0].detail_des,
          create_date:res.data[0].create_date,
          change_date:res.data[0].change_date,
          complete:res.data[0].complete,
          customer:res.data[0].customer,
          repairman:res.data[0].repairman
        }),
        wx.cloud.database().collection("customer").where({
          _openid:that.data.customer
        }).get({
          success:function(res){
            that.setData({
              name1:res.data[0].name,
              tel1:res.data[0].tel,
              email1:res.data[0].email,
              has_task1:res.data[0].has_task
            })
            if(that.data.complete==-1){
              that.setData({
                current1:0,
                current2:"未分配维修员"
              })
            }
            else{
               wx.cloud.database().collection("repairman").where({
                _openid:that.data.repairman
              }).get({
                success:function(res){
                  console.log(that.data.repairman,"查询成成",res)
                  that.setData({
                    name2:res.data[0].name,
                    tel2:res.data[0].tel,
                    email2:res.data[0].email,
                    has_task2:res.data[0].has_task,
                    satisfaction:res.data[0].satisfaction
                  })
                }
              })
              if(that.data.complete==0){
                that.setData({
                  current1:20,
                  current2:"维修员未完成维修"
                })
              }
              else if(that.data.complete==1){
                that.setData({
                  current1:40,
                  current2:"维修审核中"
                })
              }
              else if(that.data.complete==2){
                that.setData({
                  current1:60,
                  current2:"客户未支付"
                })
              }
              else if(that.data.complete==3){
                that.setData({
                  current1:80,
                  current2:"客户未评价"
                })
              }
              else if(that.data.complete==4){
                that.setData({
                  current1:100,
                  current2:"已完成"
                })
              }
            }
            console.log("lll",that.data.current1)
            console.log("lll2",that.data.current2)
          }
        })

       
      }
    })
    
  },
 show1(identify){
  //var a = arguments[0] ? arguments[0] : 1;//设置第一个参数的默认值为1 
  if(identify!=2){
    identify=1
  }
   let that=this
  /* that.setData({  //这个是实验用的
     _id:'b1cb7d3a5f290f500000488217fbc8eb'
   })*/
   let tempFilePaths=[]
   for(let i=0;i<3;i++){
    let imageUrl='cloud://znljt-fjn7n.7a6e-znljt-fjn7n-1300546603/'+that.data._id+identify+i+'.png'
    tempFilePaths.push(imageUrl)
   }
   wx.previewImage({
    current: './', // 当前显示图片的http链接
    urls: tempFilePaths // 需要预览的图片http链接列表
  })
 },
 show2(){
   let that=this
   let complete=that.data.complete
   let curpoenid=wx.getStorageSync('openid')
   if(complete<=0){
     if(curpoenid==that.data.customer){
      wx.showToast({
        title: '维修员还未上传！',
        icon:'none',
        duration:2000
      })
     }
     else if(curpoenid==that.data.repairman){
      //维修员上传图片
      that.choose_up_image()
      //改变项目的complete
     }
   }else if(complete>0){
    that.show1(2)
   }

 },
 choose_up_image: function () {
  let that = this;
  wx.chooseImage({
    count: 3, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      wx.showLoading({
        title: '加载中',
      })
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      let tempFilePaths=res.tempFilePaths
      //打开loading 
      for(let i=0;i<tempFilePaths.length;i++){
        that.upload_img(tempFilePaths[i],i,tempFilePaths.length)  //这里如果直接用this那么选择的仅仅是chooseImage里面的
      }
      //关闭loading
    }
  })
},
 upload_img(tempFilePaths,i,k){
  //在另一个中用的时候要求点开详情页时获取到数据库中任务详细信息 得到_id
  let that=this
  wx.cloud.uploadFile({
    cloudPath:that.data._id+'2'+i+'.png', //1是指的客户，2是指的维修员
    filePath: tempFilePaths, // 小程序临时文件路径
    success:function(res) {
      // 返回文件 ID
      console.log("上传成功",res.fileID)
      wx.hideLoading()
      if(i==k-1){
        that.change_complete()
      }
    },
    fail:function(res)   //这里应该是没重写function函数要直接用error,不要改成输出
    {
      console.log("上传图片"+i+"失败")
      wx.hideLoading()
      wx.showToast({
        title: "上传图片"+i+"失败!",
        icon: 'none',
        duration: 1000
      })
    }
  })
},
  change_complete(){
    let that=this
    wx.cloud.database().collection("Task").where({
      _id:that.data._id
    }).update({
      data:{
        complete:that.data.complete+1,
        change_date:util.formatTime(new Date())
      }
      ,fail(){
        wx.hideLoading()
        wx.showToast({
          title: '提交失败!',
          icon: 'none',
          duration: 1000
        })
      },
      success(){
        that.setData({
          complete:that.data.complete+1
        })
        wx.hideLoading()
        wx.showToast({  //这个地方的处理有点粗糙
          title: '成功提交!',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  pay(){
    let that=this
    let complete=that.data.complete
    let curpoenid=wx.getStorageSync('openid')
    
      if(complete<2){
        wx.showToast({
          title: '维修员还未完成',
          icon:'none',
          duration:1500
        })
      }else if(complete==2){
        if(curpoenid==that.data.customer){
          let imageUrl='cloud://znljt-fjn7n.7a6e-znljt-fjn7n-1300546603/'+that.data.repairman+'.png'  //维修员收款款二维码存储路径，直接用_openid
          let temp=[]
          temp.push(imageUrl)
          wx.previewImage({
            current: './', // 当前显示图片的http链接
            urls: temp // 需要预览的图片http链接列表
          })
      }else if(curpoenid==that.data.repairman){
        wx.showLoading({
          title: '加载中',
        })
        that.dec1(0,1)   //已经确认支付，维修员任务数减一
        that.change_complete()
      }
      }else if(complete>2){
        wx.showToast({
          title: '支付已完成',
          icon:'none',
          duration:1500
        })
      }
    
  },
  getslider(e){
    this.setData({
      slider:e.detail.value
    })
  },
  evaluation(){
    wx.showLoading({
      title: '加载中',
    })
    let that=this
    let change=that.data.satisfaction
    console.log("zzzzza",that.data.satisfaction,that.data.slider)
    if(that.data.satisfaction<that.data.slider)
      change=that.data.satisfaction+(10-that.data.satisfaction)*(that.data.slider/10)
    else if(that.data.satisfaction>that.data.slider)
      change=that.data.satisfaction-that.data.satisfaction*(that.data.slider/10)
      console.log("zzzzz1",change)
    wx.cloud.database().collection("repairman").where({
      _openid:that.data.repairman
    }).update({
      data:{
        satisfaction:change
      },
      success:function(){
        console.log("zzzzz2",change)
        that.change_complete()
        that.dec1(1,0)  //评价结束，客户任务数减一
        wx.showToast({
          title:'评价成功',
          icon:'none',
          duration:1500
        })
      }
    })
  },
  dec1(i,j){
    let that=this
    if(i==1){
      wx.cloud.database().collection("customer").where({
        _openid:wx.getStorageSync('openid')
      }).update({
        data:{
          has_task:that.data.has_task1-1
        }
      })
    }
    if(j==1){
      wx.cloud.database().collection("repairman").where({
        _openid:wx.getStorageSync('openid')
      }).update({
        data:{
          has_task:that.data.has_task2-1
        }
      })
    }
  },
  onShow () {
    // 执行coolsite360交互组件展示
    app.coolsite360.onShow(this);
  },
  onPullDownRefresh () {
    let that=this
    let _id=that.data._id
    that.onLoad({'_id':_id})
    that.onShow()  //这个竟然有用
    wx.stopPullDownRefresh()
  },
  to_index: function(){
    let that=this
    let url=''
    if(wx.getStorageSync('openid')==that.data.customer) url='../userindex/userindex'
    else if(wx.getStorageSync('openid')==that.data.repairman) url='../repairindex/repairindex'
    else url='../animindex/animindex'
    wx.redirectTo({
      url: url,
    })
  }
})