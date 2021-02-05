<template>
  <div ref="layout-box" :class="['layout-box', language]">
    <div class="top-bar">
      <top-bar :fixed="true"></top-bar>
    </div>
    <div ref="layout-main" class="layout-main">
      <nuxt />
      <footer-bar></footer-bar>
    </div>
    <site-switch ref="site-switch"></site-switch>
    <!--    <live-chat></live-chat>-->
  </div>
</template>

<script>
import Mixin from './mixins'
export default {
  mixins: [Mixin],
  data() {
    return {
      tip: {
            'zh_CN': '请关闭无痕模式，否则会影响部分功能的使用',
            'zh_TW': '請關閉無痕模式，否則會影響部分功能的使用',
            'en_US': 'Please turn off the incognito mode, otherwise it will affect the use of some functions'
        }
    }
  },
  mounted() {
    var language = this.$store.state.language;

    function isLocalStorage() {
        var testKey = 'test',
            storage = window.localStorage;
        try {
            storage.setItem(testKey, 'testValue');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    if(isLocalStorage()){
        localStorage.test = "支持";
    }

    var test;

    if(window.localStorage){
        if(localStorage.test){
            test = localStorage.test;
        }
        else{
          this.$toast.show(this.tip[language])
          // test = "不支持";
        }
    }

    // alert(test);
  }
}
</script>

<style scoped>
.layout-box {
  display: flex;
  flex-direction: column;
}
.top-bar {
  flex-grow: 0;
  flex-shrink: 0;
  height: 44px;
  z-index: 20;
}
.layout-main {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
}
</style>
