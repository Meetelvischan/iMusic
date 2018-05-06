<template>
  <div id="app">
    <img src="./assets/images/logo.png">
    <!-- router-view加载router里面的内容 -->
    <router-link to="/user/elvis">我是elvis</router-link>
    <router-link to="/user/chen">我是chen</router-link>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s
  }
</style>
