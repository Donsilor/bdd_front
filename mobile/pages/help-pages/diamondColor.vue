<template>
  <div class="diamondColor">
    <Header :title="lang.header" />
    <div class="View">
      <dl>
        <dt>{{ lang.title }}</dt>
        <dd>
          <p>
            {{ lang.define }}
          </p>
        </dd>
        <dd>
          <p>
            {{ lang.rate }}
          </p>
        </dd>
      </dl>
    </div>
    <div class="importBox">
      <div class="total-box">
        <img :src="content[actIndex].url" class="diamond-details-4c-picture" />
        <div class="triangle-letter">
          <div class="triangle" />
          <div class="letter">
            <div
              v-for="(c, index) in content"
              :key="index"
              :class="{ active: actIndex === index }"
              @click="actIndex = index"
            >
              {{ c.name }}
            </div>
          </div>
        </div>
        <div class="that-desc">
          <span class="mcPink">{{ content[actIndex].name }}:</span>
          <span class="cl666">
            {{ content[actIndex].desc }}
          </span>
        </div>
      </div>
    </div>
    <div class="View">
      <dl>
        <dt>{{ lang.tips }}</dt>
        <dd>
          <section class="remind">
            <p class="ol">
              {{ lang.tip1 }}
            </p>
            <p class="ol">
              {{ lang.tip2 }}
            </p>
            <p class="ol">
              {{ lang.tip3 }}
            </p>
            <p class="ol">
              {{ lang.tip4 }}
            </p>
          </section>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import Header from '@/components/personal/header.vue'
export default {
  name: 'DiamondColor',
  components: {
    Header
  },
  data() {
    return {
      lang: this.LANGUAGE['help-pages'].diamondColor,
      actIndex: 0,
      content: this.CONDITION_INFO.color
    }
  }
}
</script>

<style scoped lang="less">
@import url('help-page.less');
.importBox {
  padding: 15px;
  background: rgba(245, 245, 245, 1);
}
.total-box {
  width: 100%;
  position: relative;
  padding: 40px 0;
  background: white;
  .diamond-details-4c-picture {
    display: block;
    width: 200px;
    height: 200px;
    margin: 23px auto 40px;
  }
  .triangle-letter {
    position: relative;
    width: 330px;
    margin: 0 auto 30px;
    .triangle {
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-right: 330/2px solid rgba(244, 244, 244, 1);
      border-bottom: 10px solid rgba(244, 244, 244, 1);
      border-left: 330/2px solid transparent;
    }
    .letter {
      position: absolute;
      top: -4px;
      left: 0;
      width: 330px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 28px;
      div {
        width: 28px;
        height: 28px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        border-radius: 14px;
        text-align: center;
      }
      .active {
        color: #fff;
        background: @mcPink;
      }
    }
  }
  .that-desc {
    font-size: 12px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 18px;
    min-height: 18 * 3px;
    padding: 0 16px;
    text-align: left;
  }
}
.mcPink {
  font-size: 14px;
  line-height: 16px;
  color: @mcPink;
}
.cl666 {
  font-size: 14px;
  line-height: 16px;
  color: #666;
}
</style>
