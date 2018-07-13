<template>
  <div id="singer">
    <div class="singer-photo">
      <img v-lazy="imgurl" alt="">
    </div>
    <div class="header-bar">
      <div class="back-button">
        <div class="back-icon">
          <img src="../assets/images/icon-back.svg" v-if="isDark">
          <img src="../assets/images/icon-back-white.svg" v-if="isDark">
        </div>
        <div class="back-text">
          歌手
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDark: false,
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
  }
  #singer {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-x: hidden;
    position: absolute;
    background: #fff;
    z-index: 2;
    top: 0;
    .singer-photo {
      position: absolute;
      width: 100%;
      height: 100vw;
      max-width: 68vh;
      max-height: 68vh;
      img {
        width: 100%;
        height: 100vw;
        max-width: 68vh;
        max-height: 68vh;
      }
    }
    .header-bar {
      position: absolute;
      top: 0;
      height: 50px;
      width: 100%;
      max-width: 68vh;
      z-index: 2;
      .back-button {
        height: 25px;
        margin: 12.5px 12.5px 12.5px 5px;
        float: left;
        .back-icon {
          width: 25px;
          height: 25px;
          float: left;
          img {
            width: 25px;
          }
        }
      }
      .back-text {
        line-height: 25px;
        float: left;
      }
    }

  }
</style>
