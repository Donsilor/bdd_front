<template>
  <div>
    <div v-if="1" class="to-top go-top" src="url" @click="backTop">
      <!-- <i class="iconfont iconhuidaodingbu"></i> -->
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        btnFlag: true
      }
    },
    mounted() {
      window.addEventListener('scroll', this.scrollToTop);
      // console.log(scroll)
    },
    destroyed() {
      window.removeEventListener('scroll', this.scrollToTop)
    },
    methods: {
      // 点击图片回到顶部方法，加计时器是为了过渡顺滑
      backTop() {
        // const that = this
        // let timer = setInterval(() => {
        //   let ispeed = Math.floor(-that.scrollTop / 5)
        //   document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
        //   if (that.scrollTop === 0) {
        //     clearInterval(timer)
        //   }
        // }, 16)

        this.$emit('goToTop',0)
      },

      // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
      // scrollToTop() {
      //   const that = this
      //   let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      //   that.scrollTop = scrollTop
      //   if (that.scrollTop > 60) {
      //     that.btnFlag = true
      //   } else {
      //     that.btnFlag = false
      //   }
      // }
    }
  }
</script>

<style>
  .to-top {
    position: absolute;
    bottom: 102px;
    right: 26px;
    z-index: 9999;
    width: 42px;
    height: 42px;
    border-radius: 6px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
    background:#ff6900 url(../../static/common/toTop.png) no-repeat center 60%;
    background-size: 85% 85%;
  }
  .to-top:hover{
    background-color: #8b766c;
  }

  .to-top .iconfont {
    color: #fff;
    font-size: 26px;
  }


</style>
