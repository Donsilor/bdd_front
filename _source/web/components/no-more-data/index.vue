<template>
  <div class="no-more-data">
    <i class="iconfont iconwugengduo"></i>
    <span>{{ $t(`${lang}.noMore`) }}</span>
  </div>
</template>
<script>
const lang = 'components.noMoreData'
export default {
  data() {
    return {
      lang
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.no-more-data {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  .iconfont {
    margin-right: 8px;
    font-size: 16px;
    color: rgba(153, 153, 153, 1);
  }
  span {
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
}
</style>
