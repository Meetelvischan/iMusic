<template>
  <div id="play" class="music-play-page">
    <div class="music-album">
      <div class="play-page-hide-btn" @touchend.prevent.stop="hide" @click="hide">
        <img src="../assets/images/icon-jiantou.png" alt="">
      </div>
      <img v-lazy="coverImgUrl" alt="">
    </div>
    <div class="button-group">
      <!-- 设置磨砂背景 -->
      <img :src="coverImgUrl" class="blur-bg">
      <!-- 进度条 -->
      <div class="progress-bar-group">
        <div class="progress-bar">
          <div class="progress" :style="{width:indicatorPosition+'%'}"></div>
          <div class="indicator" :style="{left:indicatorPosition-1+'%'}"></div>
        </div>
        <div class="time-indicator">
          <span>{{currentTime}}</span>
          <span>{{duration}}</span>
        </div>
      </div>
      <div class="music-info">
        <p class="music-name">{{song.name}}</p>
        <p class="music-author">{{song.singer}}</p>
      </div>
      <!-- 歌词 -->
      <lyric :currentTime="currentTime" :songid="song.id"></lyric>
      <!-- 控制条 -->
      <div class="music-control">
        <ul>
          <li><img src="../assets/images/icon-like.png" alt=""></li>
          <li><img src="../assets/images/icon-shangyiqu.png" alt=""></li>
          <li><img :src="isPlaying?iconPause:iconPlay"  @touchend="playPause" @click="playPause"></li>
          <li><img src="../assets/images/icon-xiayiqu.png" alt=""></li>
          <li><img src="../assets/images/icon-list.png" alt="" @click.stop="tapActionSheet"></li>
        </ul>
      </div>
      <transition name="actionSheet-show">
        <actionSheet :actionSheetBg="coverImgUrl" :options="optionList" v-show="actionSheetShow" @closeActionSheet="tapActionSheet"></actionSheet>
      </transition>
    </div>
  </div>
</template>

<script>
  import {mapMutations,mapState,mapGetters} from 'vuex';
  import lyric from './Lyric';
  import actionSheet from './ActionSheet'
  export default {
    data() {
      return {
        actionSheetShow: false,
        optionList: ['hello','你好吗','徐良','something just like this']
      }
    },
    methods: {
      tapActionSheet() {
        this.actionSheetShow = !this.actionSheetShow;
      },
      hidePlayPage() {
        this.$parent.playPageShow = false;
      },
      hide() {
        this.$emit('hidePage');
      },
      playPause(event){
        this.$emit('tap',event);
      },
    },
    computed: {
      ...mapGetters([
        'coverImgUrl','currentTime','duration'
      ]),
      ...mapState({
        isPlaying: state => state.PlayService.isPlaying,
        song: state => state.PlayService.song,
        indicatorPosition: state => state.PlayService.currentTime / state.PlayService.duration *100,
      })
    },
    props: ['iconPause','iconPlay'],
    components: {
      lyric,
      actionSheet,
    }
  }
</script>

<style lang="scss" scoped>
  .music-play-page {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 5;
    .music-album {
      position: relative;
      width: 100%;
      height: 100vw;
      max-height: 68vh;
      img {
        width: 100%;
        display: block;
        z-index: 1;
      }
      .play-page-hide-btn {
        width: 20px;
        height: 20px;
        display: inline-block;
        position: absolute;
        left: 20px;
        top: 10px;
        z-index: 1;
        background: rgba(255, 255, 255, 0.56);
        border-radius: 100%;
        box-shadow: 2px 1px 5px rgba(0, 0, 0, 0.3);
        padding: 2px;
      }
    }
    .button-group {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        top: 100vw;
        background: rgba(255, 255, 255, 0.76);
        .blur-bg {
          display: block;
          position: absolute;
          width: 100%;
          z-index: -1;
          -webkit-filter: blur(30px);
          -moz-filter: blur(30px);
          -ms-filter: blur(30px);
          -o-filter: blur(30px);
          filter: blur(30px);
        }
        .progress-bar-group {
          .progress-bar {
            height: 10px;
            background: rgba(255, 255, 255, 0.2);
            position: relative;
            transition: all 0.1s ease-in-out;
            .progress {
              height: 100%;
              // background: linear-gradient(to right, #3494e6, #ec6ead);
              background: linear-gradient(to right, #be93c5, #7bc6cc);
              
            }
            .indicator {
              position: absolute;
              top: -4px;
              width: 18px;
              height: 18px;
              background: #51b9c0;
              border-radius: 100%;
              box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
            }
          }
          .time-indicator {
            span {
              padding: 0 10px;
            }
            span:last-child {
              float: right;
            }
          }
        }
        .music-info {
            .music-name {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
            }
            .music-author {
              text-align: center;
              color: #999;
            }
          }
        .music-control {
          margin-top: 10px;
          height: 50px;
          ul {
            list-style-type: none;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            li {
              img {
                display: block;
                width: 35px;
                margin: 0 auto;
              }
            }
          }
        }
      }
  }
  // 动画
  .actionSheet-show-enter-active {
    transition: all .3s ease;
  }
  .actionSheet-show-leave-active {
    transition: all .3s ease-out;
  }
  .actionSheet-show-enter,.actionSheet-show-leave-active {
    transform: translateY(100%);
    opacity: 0;
  }
</style>