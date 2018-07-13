import * as def from '../config/playMode.config';
/* eslint-disable */
export default {
  state: {
    index: 0,
    song: {
      name: def.DEFAULT_SONG_NAME,
      singer: '',
    },
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playList: [],
    playMode: def.SEQUENTIAL,
  },
  mutations: {
    playIndex(state, index) {
      state.index = index;
      state.song = state.playList[index];
    },
    //设置播放列表
    setPlayList(state, playListObj) {
      state.playList = playListObj.playList;
      state.index = playListObj.index;
      state.song = state.playList[state.index];
    },
    // 添加歌曲到播放列表
    addToPlayList(state, item) {
      state.playList.push(item);
    },
    // 从播放列表中删除
    deleteFromPlayList(state, index) {
      if (isNaN(index) || index >= state.playList.length) {
        return false;
      }
      if (index === state.index) {
        if (state.index === 0 && state.playList.length === 1) {
          state.song = {
            name: def.DEFAULT_SONG_NAME,
            singer: '',
          };
          state.coverImgUrl = def.DEFAULT_IMG;
        } else {
          state.song = state.playList[state.index + 1];
        }
      } else if (index < state.index) {
        state.index--;
      }
      state.playList.splice(index, 1);
    },
    // 添加为下一首播放
    addToPlayListAsNextPlay(state, item) {
      state.playList.splice(state.index + 1, 0, item);
    },
    // 更新歌曲当前时间
    updateCurrentTime(state, time) {
      state.currentTime = time;
    },
    // 更新已播放时间
    updateDuration(state, time) {
      state.duration = time;
    },
    // 播放
    play(state) {
      state.isPlaying = true;
    },
    // 暂停
    pause(state) {
      state.isPlaying = false;
    },
    // 播放上一首
    playPre(state) {
      state.index = (state.index - 1 + state.playList.length) % state.playList.length;
      // state.index = state.index==0?0:state.index - 1;
      state.song = state.playList[state.index];
    },
    // 播放下一首
    playNext(state) {
      state.index = (state.index + 1) % state.playList.length;
      state.song = state.playList[state.index];
    },
    playContinue(state) {
      switch (state.playMode) {
        case def.SINGLE: {
          break;
        }
        case def.SEQUENTIAL: {
          state.index = (state.index + 1) % state.playList.length;
          state.song = state.playList[state.idnex];
          break;
        }
        case def.RANDOM: {
          state.index = Math.floor(Math.random() * state.playList.length);
          state.song = state.playList[state.index];
          break;
        }  
      }
    },
    // 改变播放模式
    changePlayMode(state) {
      state.playMode = (state.playMode + 1) % 3;
    },
    // 设置专辑id
    setAlbumId(state, albumId) {
      state.song = {...state.song,albumId}
    },
  },
  getters: {
    //获取当前时间
    currentTime: (state) => parseInt(state.currentTime / 60) + ':' + (state.currentTime % 60),
    // 获取播放时间
    duration: (state) => parseInt(state.duration / 60) + ':' + (state.duration % 60),
    // 获取封面地址
    coverImgUrl: (state) => {
      if (typeof state.song.albummid === 'undefined') {
        return def.DEFAULT_IMG;
      } else {
        return "https://y.gtimg.cn/music/photo_new/T002R500x500M000" + state.song.albummid + ".jpg";
      }
    }
  }
}