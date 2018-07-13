<template>
  <div id="app">
    <!-- 搜索框 -->
    <search v-show="!blurBgShow" @searchShow="hideContent" @searchHide="showContent"></search>
    <!-- 内容区域 -->
    <transition name="fade">
      <div class="main-container" v-show="!blurBgShow&&contentShow">
        <div class="swiper-pagination" slot="pagination"></div>
        <swiper :options="swiperOption">
          <swiper-slide>
            <recommand></recommand>
          </swiper-slide>
          <swiper-slide>
            <h1>two</h1>
          </swiper-slide>
        </swiper>
      </div>
    </transition>
    <!-- 播放页 -->
    <transition name="play-show" @after-enter="showBlurBg" @before-leave="hideBlurBg" @after-leave="routerViewAnimation='page-slde'">
      <play v-show="playPageShow" @hidePage="hidePlay" :iconPause="iconPause" :iconPlay="iconPlay" @tap="tapButton" ></Play>
    </transition>

    <!-- 音乐控制栏 -->
    <transition name="bar-slide">
      <div id="music-bar" v-show="!playPageShow">
        <audio  id="music" :src="dataUrl"  @timeupdate="updateTime" @ended="playContinue" autoplay loop></audio>
        <div class="music-bar-image-container" @click="showPlayPage" @touchstart="showPlayPage">
          <img class="music-bar-image" :src="coverImgUrl" >
        </div>
        <p class="music-bar-text">{{song.name}}</p>
        <img class="music-bar-button" :src="isPlaying?iconPause:iconPlay" @click="tapButton" @touchend="tapButton" >
      </div>
    </transition>
  </div>
</template>

<script>
import {mapMutations, mapState, mapGetters} from 'vuex';
import search from './components/Search';
import {swiper,swiperSlide} from 'vue-awesome-swiper';
import recommand from './components/Recommand';
import play from './components/Play';
const TAB_NAME =['推荐','排行榜']
export default {
  name: 'App',
  data () {
    return {
      iconPlay: require('./assets/images/icon-play.png'),
      iconPause: require('./assets/images/icon-pause.png'),
      playPageShow: false,
      blurBgShow: false,
      contentShow: true,
      rankShow: true,
      routerViewAnimation: 'page-slide',
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          renderBullet(index,className){
            return `<span class="${className} swiper-pagination-bullet-custom">${TAB_NAME[index]}</span>`
          },
        },
        paginationClickable: true,
      },
    };
  },
  methods: {
    // 点击搜索时隐藏推荐内容 退出搜索时显示推荐内容
    showContent() {
      this.contentShow = true;
    },
    hideContent() {
      this.contentShow = false;
    },
    tapButton(event) {
      event.preventDefault();
      this.isPlaying?this.pause():this.play();
    },
    ...mapMutations([
      'play','pause','playContinue'
    ]),
    // 播放页动画相关事件
    showPlayPage(event){
      event.preventDefault();
      this.playPageShow = true;
    },
    hidePlayPage(event){
      event.preventDefault();
      this.playPageShow = false;
    },
    showBlurBg(){
      this.routerViewAnimation = 'fade';
      this.blurBgShow = true;
    },
    hideBlurBg(){
      this.blurBgShow = false;
    },
    updateTime() {
      this.$store.commit('updateCurrentTime',parseInt(document.getElementById('music').currentTime));
      this.$store.commit('updateDuration',parseInt(document.getElementById('music').duration))
    },
    //子组件触发hidePage，执行父组件的hidePlay
    hidePlay() {
      this.playPageShow = false;
    },

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
  components: {
    search,
    swiper,
    swiperSlide,
    recommand,
    play,
  },
  watch: {
    //监测当前state中的音乐是否处于播放状态，更新实际的音乐播放
    isPlaying(val) {
      if(val){
        document.getElementById('music').play();
      }else{
        document.getElementById('music').pause();
      }
    }
  }
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
  .main-container {
    margin-top: 50px;
    width: 100%;
    transition: all .1s ease;
  }
  /* swiper样式 */
  .swiper-wrapper {
    position:relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    transition-property:transform;
    box-sizing: content-box;
  }
  .swiper-slide {
    flex-shrink: 0;
    width: 100%;
    /* height: 100%; */
    position: relative;
    transition-property: transform;
    overflow: hidden;
  }
  .swiper-pagination {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    height: 50px;
  }
  .swiper-pagination-bullet-custom {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    text-align: center;
    line-height: 50px;
    color: #999;
    border-radius: 0 !important;
    background: #fff !important;
    opacity: 1 !important;
  }
  .swiper-pagination-bullet-active {
    color: #000;
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
    z-index: 100;
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

  /* 动画相关 */
  @keyframes imgFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  img[lazy=loaded] {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-name: imgFadeIn;
    animation-name: imgFadeIn;
  }
  img[lazy=error] {
    border-radius: 2px;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-name: imgFadeIn;
    animation-name: imgFadeIn;
  }
  /* 淡入淡出特效 */
  .fade-enter-active {
    transition: all .3s ease;
  }
  .fade-leave-active {
    transition:  all .3s ease-out;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  /* 页面滑动特效 */
  .page-slide-enter-active {
    transition: all .3s ease;
  }
  .page-slide-leave-active {
    transition: all .3s ease-out;
  }
  .page-slide-enter, .page-slide-leave-active {
    transform: translateX(100%);
  }
  /* PlayPageShow 弹出播放页动画 */
  .play-show-enter-active {
    transition: all .3s ease;
  }
  .play-show-leave-active {
    transition: all .3s ease-out;
  }
  .play-show-enter, .play-show-leave-active {
    transform: translate(-100vw,100vh);
  }
  /* 音乐bar特效; */
  .bar-slide-enter-active {
    transition: all .3s ease;
  }
  .bar-slide-leave-active {
    transition: all .3s ease-out;
  }
  .bar-slide-enter, .bar-slide-leave-active {
    margin-bottom: -50px;
  }
  /* 适配 */
  /* @media screen and (min-width: 68vh) {
    body {
      width: 100vw;
      margin: 0 auto;
    }

    #play-bar {
      width: 68vh;
    }
  } */
</style>
