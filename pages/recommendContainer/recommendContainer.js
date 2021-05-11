// pages/recommendContainer/recommendContainer.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendContainerDetail: [], // 歌单信息
    songUserDetail: [], //歌单用户信息
    index: 0
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
      recommendList: recommendContainer.playlist.tracks
    })
    

    // 定于来时songDetail页面发送的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let {recommendList, index} = this.data;
      if(type === 'pre') {
        (index === 0) && (index = recommendList.length)
        index -= 1;
      }else {
        (index === recommendList.length -1) && (index = -1)
        index += 1
      }
      // 更新下标
      this.setData({
        index
      })
      let musicId = recommendList[index].id;

      // 将id回传到detail页面
      PubSub.publish('musicId', musicId)
    });
  },
  
  toSongDetail(event) {
    let {song, index} = event.currentTarget.dataset;
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id,
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