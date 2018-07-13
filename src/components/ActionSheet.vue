<template>
  <div id="actionSheet">
    <div class="itemList">
      <div class="close">
        <img src="../assets/images/icon-jiantou.png" alt="" @click="close" @touchend.prevent="close">
      </div>
      <div class="item" v-for="item in options">{{item}}</div>
      <div class="bg-blur">
        <img :src="actionSheetBg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      
    }
  },
  methods: {
    close() {
      this.$emit('closeActionSheet');
    }
  },
  props: ['actionSheetBg','options']
}
</script>

<style lang="scss" scoped>
  #actionSheet {
    position: absolute; 
    left: 0;
    bottom: 0;
    width: 100%;
    max-height: 50vh;
    overflow: hidden;
    z-index: 1000;
    border-radius: 20px 20px 0 0;
    box-shadow: 1px -3px 5px rgba(0, 0, 0, 0.1);
    .itemList {
      width: 100%;
      max-height: 50vh;
      overflow: scroll;
      .close {
        width: 100vw;
        height: 40px;
        line-height: 40px;
        background: rgba(255, 255, 255, .76);
        text-align: center;
        img {
          display: inline-block;
          width: 25px;
          height: 25px;
        }
      }
      .bg-blur {
        display: block;
        position: absolute;
        top: 0;
        width: 100vw;
        z-index: -1;
        -webkit-filter: blur(30px);
        -moz-filter: blur(30px);
        -ms-filter: blur(30px);
        -o-filter: blur(30px);
        filter: blur(30px);
      }
      .item {
        width: 100vw;
        height: 50px;
        font-size: 20px;
        background: rgba(255, 255, 255, .76);
        text-align: center;
        line-height: 50px;
        border-bottom: 1px solid #e4dfdf;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
</style>
