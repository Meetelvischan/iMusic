<template>
  <div id="lyric">
    <p class="lyric-item" v-for=" item in currentLyric">{{item}}</p>
  </div>
</template>

<script>
import Base64 from '../utils/base64.js';
export default {
  data() {
    return {
      lyric: null,
    }
  },
  props: ['songid','currentTime'],
  methods: {

  },
  computed: {
    currentLyric() {
      if(this.lyric !==null){
        let that = this;
        let pastLyric = [];
        let i = 0;
        Object.keys(this.lyric).forEach(key=>{
          if(key.split(':').reduce((a,b)=>
            parseInt(a) * 60 * 100 + b.split('.').reduce((a,b)=>parseInt(a) * 100 + parseInt(b))) - 120 <=that.currentTimeStamp){
              if(that.lyric[key] !=='\n'){
                pastLyric.push(that.lyric[key]);
              }
          }else if(i<=1 && that.lyric[key] !=='\n'){
            pastLyric.push(that.lyric[key]);
            i++;
          }
        });
        return pastLyric.slice(pastLyric.length - 4,pastLyric.length - 1)
      }
    },
    currentTimeStamp() {
      let t = this.currentTime.split(':');
      return(parseInt(t[0]) * 60 + parseInt(t[1])) * 100;
    }
  },
  watch: {
    songid(id) {
      this.$store.dispatch('getLyric',id).then(response=>{
      let lyric = Base64.decode(response.data.lyric);
      if(lyric.length<30){
        this.lyric =  {'[00:00.00]': '此歌曲为没有填词的纯音乐，请您欣赏'};
      }else {
        this.lyric = lyric.split('[').slice(5).map(str=>{
        let t = str.split(']');
        return {[t[0]]: t[1]};
        })
        .reduce((a,b)=>{
          return {...a,...b};
        });
      }
      });
      // console.log(this.lyric);
      // 最终获取的格式为：
      // {{offset:0 :" "},{00:00.10: "Lemon Tree"},{xx.xx.xx: "xxxx"}};
    },
  }
}
</script>

<style lang="scss" scoped>
  #lyric {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    flex-grow: 1;
    transition: all .3s ease;
    .lyric-item {
      text-align: center;
      font-size: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      &:first-child {
        font-size: 14px;
        color: #4d4d4d;
      }
      &:last-child {
        font-size: 14px;
        color: #4d4d4d;
      }
    }
  }
</style>