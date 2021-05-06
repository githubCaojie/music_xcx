// pages/personal/personal.js
let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的坐标
let moveDustance = 0; // 手指移动的距离

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "translateY(0)",
    coveTransition: '',
    userInfo: {}, // 用户信息
    recenPlayList: {}, // 播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户的基本信息
    
    let userInfo = JSON.parse(wx.getStorageSync('userInfo'));
    if(userInfo) {
      this.setData({
        userInfo
      })
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },

  // 获取用户播放记录function
  async getUserRecentPlayList(userId) {
    let recenPlayListData = await request('/user/record',{uid: userId, type: 0})
    let index = 0;
    let recenPlayList = recenPlayListData.allData.splice(0, 10).map(item => {
      item.id = index ++;
      return item
    })
    this.setData({
      recenPlayList
    })
  },

  handleTouchStart(event) {
    console.log('start')
    startY = event.touches[0].clientY;
    this.setData({
      coveTransition: ''
    })
  },

  handleTouchMove(event) {
    console.log('move')
    moveY = event.touches[0].clientY;
    moveDustance = moveY - startY;
    if(moveDustance <= 0) {
      return;
    }
    if(moveDustance >= 80) {
      moveDustance = 80
    }
    // 动态更新coverTransform
    this.setData({
      coverTransform: `translateY(${moveDustance}rpx)`,
      coveTransition: ''
    })
  },

  handleTouchEnd() {
    console.log('end')
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coveTransition: 'transform 1s linear'
    })
  },

  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})