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
    <div class="search-keyword" v-if="searchResult==null&&searchShow">
      <div class="search-history">
        <div class="search-history-item" v-for="item in searchHistory" @click="search(item)">{{item}}</div>
      </div>
      <ul class="hot-keyword">
        <li v-for="(item,index) in hotKeyword" @click="search(item.k)">
          <span class="hot-keyword-index">{{index+1}}:</span>
          <span class="hot-keyword-name">{{item.k}}</span>
        </li>
      </ul>
    </div>
    <div class="result" v-if="searchResult!=null&&searchShow">
      <!-- 单曲搜索start -->
      <div class="result-group" v-if="searchResult.song!=null">
        <div class="group-header">
          <img class="group-icon" src="../assets/images/icon-music.png">
          <div class="group-title">单曲</div>
        </div>
        <div class="result-item" v-for="(item,index) in searchResult.song.itemlist">
          <div class="result-title" @click="play(index)">{{item.name}}</div>
          <div class="result-singer" @click="play(index)">{{item.singer}}</div>
        </div>
      </div>
      <!-- 单曲搜索end -->
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
    };
  },
  methods: {
    search: function(keyword){
      this.keyword = keyword;
      this.$store.dispatch('search',keyword).then((response)=>{
        // 触发action，运行search，返回一个promise
        this.searchResult = response.data.data;
        let index = this.searchHistory.indexOf(keyword);
        if(index !==-1){
          this.searchHistory.splice(index,1);
        };
        this.searchHistory.unshift(keyword);
        this.searchHistory = this.searchHistory.slice(0,10);
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
    play: function(index){
      this.$store.commit('setPlayList',{
        index,
        list: this.searchResult.song.itemlist,
      });
    },
    showAlbum: function(mid){
      this.$router.push({name: 'album',params: {id: mid},})
    },
    showSinger(singermid){
      this.$router.push({name: 'singer',params: {id: singermid},})
    }
  },
  created(){
    if(localStorage.serchHistory){
      this.searchHistory = JSON.parse(localStorage.searchHistory);
    };
    this.$store.dispatch('getHotKey').then((response)=>{
      this.hotKeyword = response.data.data.hotkey.slice(0,5);
    });
  },
}
</script>

<style lang="scss" scoped>
  .search-group {
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    background: #fff;
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
      font-size: 16px;
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
        padding: 0 5px;
        border: 1px solid #000;
        border-radius: 14px;
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
  }
  .result {
    margin: 60px 10px;
    background: #eee;
    display: flex;
    flex-direction: column;
    justify-content: flex-startss;
    .result-group {
      background: #eee;
      .group-header {
        display: flex;
        flex-direction: row;
        height: 40px;
        align-items: center;
        padding: 0 0 5px 10px;
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
        margin-left: 10px;
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
        margin-left: 10px;
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
          }
          .album-author {
            font-size: 12px;
            color: #929292;
            line-height: 20px;
          }
        }
      }
    }
    
  }
</style>
