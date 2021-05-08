// pages/recommendContainer/recommendContainer.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendContainerDetail: [], // 歌单信息
    songUserDetail: [], //歌单用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let {id} = options;
    // 获取歌单详情
    let recommendContainer = await request('/playlist/detail', {id});
    this.setData({
      recommendContainerDetail: recommendContainer.playlist,
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