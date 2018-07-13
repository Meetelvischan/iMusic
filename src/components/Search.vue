<template>
  <div id="search">
    <div class="search-group">
      <div class="search-input">
        <img src="../assets/images/icon-search.png" alt="搜索">
        <form @submit.prevent="search(keyword)">
          <input type="text" placeholder="搜索 歌曲/专辑/歌手" v-model="keyword" @focus="focus">
        </form>
      </div>
      <div class="search-cancel" :class="{'search-cancel-show':searchShow}">
        <button id="search-cancel-button" @click="searchCancel">取消</button>
      </div>
    </div>
    <transition name="fade">
      <div class="search-keyword" v-if="searchResult==null&&searchShow">
        <div class="search-history">
          <div class="search-history-item" v-for="item in searchHistory" @click="search(item)">{{item}}</div>
        </div>
        <ul class="hot-keyword">
          <li v-for="(item,index) in hotKeyword" @click="search(item.k)">
            <span class="hot-keyword-index">{{index+1}}:</span>
            <span class="hot-keyword-name">{{item.k}}</span>
            <span class="hot-keyword-num">{{Math.round(item.n/1000)/10}}万</span>
          </li>
        </ul>
        <transition name="fade">
          <div class="clear-history" v-show="searchHistory.length"><button @click="clearHistory">清除历史</button></div>
        </transition>
      </div>
    </transition>
    <div class="result" v-if="searchResult!=null&&searchShow">
      <div class="searching">
        
      </div>
      <!-- 单曲搜索start -->
      <div class="result-group" v-if="searchResult.song!=null">
        <div class="group-header">
          <img class="group-icon" src="../assets/images/icon-music.png">
          <div class="group-title">单曲</div>
        </div>
        <div class="result-item" v-for="(item,index) in searchResult.song.itemlist">
          <div class="result-title" @click="play(index)">{{item.name}}</div>
          <div class="result-singer" @click="play(index)">{{item.singer}}</div>
          <div class="result-option">
            <img src="../assets/images/icon-...black.png" alt="" @click.prevent="tapActionSheet" @touchend.prevent="tapActionSheet">
          </div>
        </div>
      </div>
      <!-- 单曲搜索end -->
      <!-- actionSheet -->
      <transition name="actionSheet-show">
        <actionSheet v-show="actionSheetShow" @closeActionSheet="tapActionSheet"></actionSheet>
      </transition>

      <!-- 歌手搜索start -->
      <div class="result-group" v-if="searchResult.singer!=null">
        <div class="group-header">
          <img class="group-icon" src="../assets/images/icon-singer.png">
          <div class="group-title">歌手</div>
        </div>
        <div class="singer-item" v-for="item in searchResult.singer.itemlist" @click="showSinger(item.mid)">
          <img class="singer-img" v-lazy="item.pic">
          <div class="singer-name">{{item.name}}</div>
        </div>
      </div>
      <!-- 歌手搜索end -->
      <!-- 专辑搜索start -->
      <div class="result-group" v-if="searchResult.album!=null">
        <div class="group-header">
          <img class="group-icon" src="../assets/images/icon-album.png">
          <div class="group-title">专辑</div>
        </div>
        <div class="album-item" v-for="item in searchResult.album.itemlist" @click="showAlbum(item.mid)">
          <img class="album-img" v-lazy="item.pic">
          <div class="album-info">
            <div class="album-name">{{item.name}}</div>
            <div class="album-author">{{item.singer}}</div>
          </div>
        </div>
      </div>
      <!-- 专辑搜索end -->
    </div>
  </div>
</template>

<script>
import actionSheet from './ActionSheet';
export default {
  data(){
    return {
      keyword: '',
      hotKeyword: null,
      searchResult: null,
      searchHistory: [],
      searchShow: false,
      isAlbumShow: false,
      isSingerShow: false,
      mid: 0,
      singermid: 0,
      actionSheetShow: false,
    };
  },
  methods: {
    search: function(keyword){
      this.keyword = keyword.trim();
      this.$store.dispatch('search',keyword).then((response)=>{
        // 触发action，运行search，返回一个promise
        // console.log(response);
        this.searchResult = response.data.data;
        let index = this.searchHistory.indexOf(this.keyword);
        if(index !==-1){
          this.searchHistory.splice(index,1);
        };
        this.searchHistory.unshift(this.keyword);
        this.searchHistory = this.searchHistory.slice(0,5);
        localStorage.setItem('searchHistory',JSON.stringify(this.searchHistory));
      });
    },
    // 点击搜索框显示搜索相关项目
    focus: function(){
      this.searchShow = true;
      this.$emit('searchShow');
    },
    //点击取消隐藏搜索相关项目
    searchCancel: function(){
      this.searchShow = false;
      this.keyword = '';
      this.searchResult = null;
      this.$emit('searchHide');
    },
    clearHistory() {
      this.searchHistory = [];
    },
    play: function(index){
      this.$store.commit('setPlayList',{
        index,
        playList: this.searchResult.song.itemlist,
      });
      this.$store.state.PlayService.isPlaying = true;
    },
    showAlbum: function(mid){
      this.$router.push({name: 'album',params: {id: mid},})
    },
    showSinger(singermid){
      this.$router.push({name: 'singer',params: {id: singermid},})
    },
    tapActionSheet() {
      this.actionSheetShow = !this.actionSheetShow;
    }
  },
  created(){
    if(localStorage.searchHistory){
      this.searchHistory = JSON.parse(localStorage.searchHistory);
    };
    this.$store.dispatch('getHotKey').then((response)=>{
      // console.log(response);
      this.hotKeyword = response.data.data.hotkey.slice(0,10);
    });
  },
  components: {
    actionSheet,
  }
}
</script>

<style lang="scss" scoped>
  // 淡入淡出特效
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s ease-in-out;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .search-slide-enter-active {
    transition: all .3s ease-in;
  }
  .search-slide-leave-active {
    transition: all .3s ease-out;
  }
  .search-slide-enter, .search-slide-leave-active {
    opacity: 0;
    transform: translateY(-100%);
  }
  //actionSheet动画 
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
  .search-group {
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    background: #fff;
    z-index: 1;
  }
  .search-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    background: #eee;
    border-radius: 5px;
    margin: 10px;
    img {
      display: inline-block;
      height: 30px;
      width: 30px;
      margin: 0 5px;
    }
    form,input {
      flex-grow: 1;
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      border-radius: 5px;
      background: #eee;
      font-size: medium;
    }
  }
  .search-cancel {
    height: 40px;
    width: 0;
    line-height: 40px;
    margin: 10px auto;
    overflow: hidden;
    transition: width 0.3s;
    cursor: pointer;
    button {
      display: inline-block;
      width: 40px;
      outline: none;
      border: none;
      background: #fff;
      font-size: 18px;
      font-weight: 400;
    }
  }
  .search-cancel-show {
    width: 55px;
  }
  .search-keyword {
    margin: 60px 0 50px 0;
    background: #eee;
    display: flex;
    flex-direction: column;
    .search-history {
      display: flex;
      flex-wrap: wrap;
      background: #fff;
      padding: 0 10px;
      max-height: 66px;
      .search-history-item {
        margin: 5px;
        padding: 2px 6px;
        border-radius: 14px;
        color: #fff;
        background: linear-gradient(to right, #be93c5, #7bc6cc);
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
      }
    }
    .hot-keyword {
      list-style-type: none;
      background: #fff;
      li {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 0 10px;
        border-bottom: 1px solid #eee;
        .hot-keyword-index {
          padding-right: 10px;
        }
        .hot-keyword-name {
          flex-grow: 1;
        }
      }
    }
    .clear-history {
      button {
      display: inline-block;
      width: 100%;
      outline: none;
      border: none;
      background: #fff;
      font-size: 16px;
      height: 40px;
      font-weight: 700;
      }
    }  
  }
  .result {
    margin: 60px 10px;
    background: #eee;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .searching {
      text-align: center;
    }
    .result-group {
      background: #eee;
      .group-header {
        display: flex;
        flex-direction: row;
        height: 40px;
        align-items: center;
        padding-top: 5px;
        background: #eee;
        .group-icon {
          width: 25px;
          height: 25px;
        }
        .group-title {
          margin-left: .5em;
        }
      }
      .result-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #fff;
        border-radius: 5px;
        border-bottom: 1px solid #eee;
        height: 40px;
        padding-left: 10px;
        cursor: pointer;
        .result-title {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .result-singer {
          color: #929292;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          flex-grow: 1;
          margin-left: .5em;
        }
        .result-option {
          padding-right: .5em;
          img {
            display: block;
            width: 20px;
            height: 20px;
          }
        }
      }
      .singer-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 40px;
        padding: 5px 10px;
        background: #fff;
        border-bottom: 1px solid #eee;
        border-radius: 5px;
        cursor: pointer;
        .singer-img {
          height: 40px;
          width: 40px;
          border-radius: 50%;
        }
        .singer-name {
          padding: 3px 10px;
        }
      }
      .album-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 40px;
        padding: 5px 10px;
        background: #fff;
        border-bottom: 1px solid #eee;
        border-radius: 5px;
        cursor: pointer;
        .album-img {
          height: 40px;
          width: 40px;
          border-radius: 50%;
        }
        .album-info {
          display: flex;
          flex-direction: column;
          padding-left: 15px;
          .album-name {
            font-size: 14px;
            line-height: 20px;
            max-height: 20px;
            max-width: 270px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .album-author {
            font-size: 12px;
            color: #929292;
            line-height: 20px;
            max-width: 270px;
            max-height: 20px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
    
  }
</style>
