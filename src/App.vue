<template>
  <div id="app">
    <transition>
      <div id="music-bar">
        <audio src=""></audio>
        <div class="music-bar-image-container">
          <img class="music-bar-image" :src="coverImgUrl" >
        </div>
        <p class="music-bar-text">{{song.name}}</p>
        <img class="music-bar-button" :src="isPlaying?iconPause:iconPlay" >
      </div>
    </transition>
  </div>
</template>

<script>
import {mapMutations, mapState, mapGetters} from 'vuex'; 
export default {
  name: 'App',
  data () {
    return {
      iconPlay: require('./assets/images/icon-play.png'),
      iconPause: require('./assets/images/icon-pause.png'),
    };
  },
  computed: {
    ...mapGetters([
      'coverImgUrl'
    ]),
    ...mapState({
      dataUrl(state) {
        return 'https://dl.stream.qqmusic.qq.com/C100' + state.PlayService.song.mid + '.m4a?fromtag=46';
      },
      isPlaying: state => state.PlayService.isPlaying,
      song: state => state.PlayService.song,
    }),
  },
};
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  html {
    overflow-x: hidden;
    background: #eee;
  }
  body {
    display: flex;
    overflow-x: hidden;
  }
  #app {
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
    width: 100%;
    height: 100%;
  }
  #music-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: -webkit-linear-gradient(top, #f9f9f9, #f3f3f3);
    border-radius: 5px 5px 0 0;
  }
  .music-bar-image-container {
    width: 37.5px;
    height: 37.5px;
    padding-left: 15px;
    cursor: pointer;
  }
  .music-bar-image {
    display: inline-block;
    width: 37.5px;
    height: 37.5px;
    border-radius: 5px;
  }
  .music-bar-text {
    flex-grow: 1;
    padding-left: 10px;
    cursor: pointer;
  }
  .music-bar-button {
    width: 20px;
    height: 20px;
    padding-right: 15px;
    cursor: pointer;
  }
</style>
