<template>
  <div class="recommand">
    <div class="loading" v-if="loading">
      {{loadingState}}
    </div>
    <div class="container" v-if="!loading">
      <swiper :options="swiperOptionIn" class="swiper-position">
        <swiper-slide v-for="item in slider" :key="item.id">
          <img class="recommand-swiper-img" v-lazy="item.picUrl" @click="jump(item)">
        </swiper-slide>
        <div class="swiper-pagination-white swiper-pagination-position" slot="pagination"></div>
      </swiper>
      <!-- 热门歌单 -->
      <div class="hot-list">
        <div class="list-title">
          <p class="title-text">热门歌单</p>
        </div>
        <div class="list-content">
          <div class="list-item" v-for="item in songList" @click="$router.push({name: 'cd',params: {id: item.dissid}})">
            <div class="list-img">
              <img v-lazy="item.picUrl">
              <div class="listen-count">
                <img src="../assets/images/icon-erji.svg" alt="">
                <span>{{Math.round(item.accessnum/1000)/10+'万'}}</span>
              </div>
            </div>
            <div class="list-info">
              <p class="list-name">{{item.songListDesc}}</p>
              <p class="list-author">{{item.songListAuthor}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {swiper,swiperSlide} from 'vue-awesome-swiper';
  import {types} from '../config/playMode.config';
  export default {
    data(){
      return {
        loadingState: '正在加载...',
        loading: true,
        slider: [],
        songList: [],
        radioList: [],
        swiperOptionIn: {
          pagination: {
            el: '.swiper-pagination-white',
            clickable: true,
          },
          autoplay: true,
          loop: true,
        }
      }
    },
    methods: {
      jump(info){
        window.open(info.linkUrl);
        // switch(info.type){
        //   case types.ALBUM:
        //     this.$router.push({
        //       name: 'album',
        //       params: {
        //         id: info.id
        //       }
        //     });
        //     break;
        //   case types.CD: 
        //     this.$router.push({
        //       name: 'cd',
        //       params: {
        //         id: info.id
        //       }
        //     });
        //     break;
        //   case types.JUMP:
        //     window.open(info.jumpurl);
        //     braek;
        //   default:
        //     console.log(info);
        // }
      }
    },
    created: function(){
      this.$store.dispatch('getRecommands').then((response)=>{
        this.loading = false;
        console.log(response);
        this.slider = response.data.data.slider;
        this.songList = response.data.data.songList;
      },(response)=>{
        this.loadingState = '加载失败';
        console.log(response);
      })
    },
    computed: {
      listenCount: num=>Math.round(num/1000)/10 + '万',
    },
    components: {
      swiper,
      swiperSlide,
    }
  }
</script>

<style lang="scss">
  .recommand {
    .loading {
      width: 100%;
      height: 100%;
      line-height: 150px;
      text-align: center;
      color: #999;
    }
    .container {
      
      .swiper-position {
        position: relative;
        height: 180px;
        .recommand-swiper-img {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
        .swiper-pagination-position {
          position: absolute;
          left: calc(50% - 25px);
          bottom: 0;
          z-index: 10;
        }
      }
      .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        margin-left: 2px;
        display: inline-block;
        border-radius: 100%;
        background: #000;
        opacity: 0.2;
        button {
          border: none;
          margin: 0;
          padding: 0;
          box-shadow: none;
          appearance: none;
        }
      }
      .swiper-pagination-bullet-active {
        opacity: .8;
        background: #fff;
      }
      
      .hot-list {
        display: flex;
        flex-direction: column;
        margin-top: 1px;
        background: #fff;
        box-shadow: 0 0 10px #ddd;
        .list-title {
          height: 50px;
          line-height: 50px;
          text-align: center;
        }
        .list-content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-around;
          .list-item {
            width: 45%;
            margin-bottom: 10px;
            .list-img {
              position: relative;
              img {
                width: 100%;
                border-radius: 10%;
              }
              .listen-count {
                position: absolute;
                bottom: 5px;
                left: 10px;
                color: #fff;
                font-size: 12px;
                display: flex;
                flex-direction: row;
                align-items: center;
                img {
                  display: inline-block;
                  width: 15px;
                  height: 15px;
                  margin-right: 5px;
                }
              }
              
            }
            .list-info {
                padding: 0 5px;
                font-size: 14px;
                .list-name {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .list-author {
                  color: #777;
                }
            }
          }
        }
      }
    }
  }
</style>
