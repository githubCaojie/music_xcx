// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],//导航标签
    navId: '',//导航标识
    videoList: [],//视频
    videoUpdateTime: [],//记录播放时长
    isTriggered: false,//表示下拉刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();
  },
  
  //获取导航数据
  async getVideoGroupListData(){
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0,20),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId);
  },

  //点击切换导航的回调
  changeNav(event){
    let navId = event.currentTarget.id;//通过id向event事件传参，传的数字会转为string
    this.setData({
      navId: navId>>>0,
      videoList: []
    })

    //显示正在加载
    wx.showLoading({
      title: '正在加载',
    })
    //动态获取当前导航的动态数据
    this.getVideoList(this.data.navId);
  },

  //获取视频列表数据
  async getVideoList(navId){
    if(!navId){
      return;
    }
    let VideoListData = await request('/video/group',{id: navId});
    if(VideoListData.datas.length === 0){
      wx.showToast({
        title: '暂无推荐视频',
        icon: 'none'
      })
      return;
    }
    //关闭加载提示
    wx.hideLoading();
    
    let index = 0;
    let videoList = VideoListData.datas.map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      videoList: videoList,
      //关闭下拉刷新
      isTriggered: false
    })
  },

  //自定义下拉刷新
  handleRefresher(){
    this.getVideoList(this.data.navId);
  },
  handleToLower() {
    console.log('scroll-view')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getVideoList(this.data.navId);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    if(from === 'button') {
      return {
        title: 'button来自manster云音乐的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }else {
      return {
        title: 'menu来自manster云音乐的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }
  }
})