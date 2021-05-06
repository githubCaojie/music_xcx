// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否播放
    song: {}, // 歌曲详情
    musicId: '', // 歌曲ID
    musicLink: '', // 歌曲链接
    currentTime: '00:00',
    durationTime: '00:00',
    currentWidth: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId;
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId);

    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      this.setData({
        isPlay: true
      })
    }

    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = musicId;
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    // 音乐播放自然结束
    this.backgroundAudioManager.onEnded(()=>{
      // 自动切歌播放
      PubSub.publish('switchMusic','next');
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    })
    // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      let currentWidth = (this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration) * 450;
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },

  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    // 修改全局播放状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  
  // 点击暂停/播放的回调
  handleSwitch(event) {
    let type = event.currentTarget.id;
    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop()
    
    // 订阅来自recommendSong页面发布的musicId消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      // 获取音乐信息
      this.getMusicInfo(musicId)
      this.musicControl(true, musicId)
      // 取消订阅
      PubSub.unsubscribe('musicId')
    })
    // 发布消息数据给recommendSong页面
    PubSub.publish('switchType', type)
  },

  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', {ids: musicId})
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  // 控制播放/暂停
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    let {musicId, musicLink} = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },
  
  // 控制音乐的播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    if(isPlay) {
      if(!musicLink) {
        // 获取音乐播放链接
        let musicLinkData = await request('/song/url', {id: musicId});
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        })
      }
      // 歌曲播放
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
    }else {
      // 音乐暂停
      this.backgroundAudioManager.pause()
    }
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