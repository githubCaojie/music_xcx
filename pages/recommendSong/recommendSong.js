// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '', // 天
    month: '', // 月
    recommendList: [], // 推荐的歌曲数据
    index: 0, // 点击的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    // 更新日期
    this.setData({
      day: this.appendzero(new Date().getDate()),
      month: this.appendzero(new Date().getMonth() + 1)
    })

    this.getRecommendList();

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
  // 日期不足两位补0
  appendzero(d) {
    if(d < 10) return '0' + d;
    else return d
  },

  // 获取每日推荐数据
  async getRecommendList() {
    let recommendList = [];
    let recommendListData = await request('/recommend/songs');
    for (let i in recommendListData.data.dailySongs) {
      recommendList.push(recommendListData.data.dailySongs[i])
      for(let r in recommendListData.data.recommendReasons) {
        if(recommendListData.data.dailySongs[i].id === recommendListData.data.recommendReasons[r].songId){
          recommendList[i].recommendReasons = recommendListData.data.recommendReasons[r].reason
        }
      }
    }
    this.setData({
      recommendList
    })
  },

  toSongDetail (event) {
    let {song, index} = event.currentTarget.dataset;
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id,
    })
  },

  toSongDetailAll() {
    let songId = this.data.recommendList[0].id
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + songId,
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