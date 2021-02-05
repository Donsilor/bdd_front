<template>
  <div class="engagementRings-component">
    <div class="swiper-box">
      <swiper1 :auto="true" :duration="5000">
        <div v-for="(each, n) in goodsImages" :key="n">
          <nuxt-link
            :to="
              `/image-view?path=${$helpers.base64Encode(
                JSON.stringify(goodsImages)
              )}`
            "
            ><img :src="each"
          /></nuxt-link>
        </div>
      </swiper1>

      <div class="activity-sign" v-if="goodInfo.coupon.discount || goodInfo.coupon.money">
        <div class="triangle" v-if="goodInfo.coupon.discount">{{ this.$store.state.language == 'en_US' ? discountUs(this.goodInfo.coupon.discount.discount)+'%' : discountConversion(this.goodInfo.coupon.discount.discount)}}{{ lang.discounts2 }}</div>
        <div class="triangle" v-if="goodInfo.coupon.money">{{ lang.discounts1 }}</div>
      </div>

    </div>
    <div class="title">
      <span class="discount-icon" v-if="goodInfo.coupon.discount">{{ this.$store.state.language == 'en_US' ? discountUs(this.goodInfo.coupon.discount.discount)+'%' : discountConversion(this.goodInfo.coupon.discount.discount)}}{{ lang.discounts2 }}</span>
      <span class="discount-icon padding" v-if="goodInfo.coupon.money">￥</span>
      {{ goodInfo.goodsName }}
    </div>

    <div class="price" v-if="!goodInfo.coupon.discount">{{ formatCoin(goodInfo.coinType) }} {{ formatNumber(showPi) }}</div>

    <div class="discount-price" v-else>
      <div class="old-price">{{ formatCoin(goodInfo.coinType) }} {{ formatNumber(showPi) }}</div>
      <div class="new-price">{{ formatCoin(goodInfo.coinType) }} {{ formatNumber(showP2) }}</div>
    </div>
    
    <div class="promise-box">
      <div
        v-for="(c, index) in goodInfo.goodsServicesJsons"
        :key="index"
        class="promise-info"
      >
        <div class="promise-img">
          <img :src="$IMG_URL + c.img" alt="" />
        </div>
        <span>{{ c.name }}</span>
      </div>
    </div>
    <div v-if="goodInfo.goodsMod === 1" class="include-box">
      <span>{{ lang.include }}</span>
      <div>
        <i class="iconfont iconstar-jt" />
      </div>
    </div>

    <div class="select-box" @click="showAttr = true">
      <div class="select-line" v-if="goodInfo.carats">
        <span>{{ lang.inlay }}</span>
        <span>{{ chooseCarat }}</span>
      </div>
      <!-- <div class="bd-b" v-if="goodInfo.carats"></div> -->
      <div class="select-line">
        <span>{{ lang.goodsMaterial }}：</span>
        <span>{{ chooseMaterials }}</span>
      </div>
      <!-- <div class="bd-b"></div> -->
      <div class="select-line margin-bottom-10">
        <span>
          <span>{{ lang.goodsSize }}（{{ lang['us-version'] }}）</span>
          <div @click="openSize()">!</div>：
        </span>
        <span>{{ chooseSize }}</span>
      </div>

      <i class="iconfont iconyou"></i>
    </div>

    <div
      v-if="goodInfo.goodsMod === 1 && inSale && canAddCart"
      class="custom-made-word"
    >
      {{ lang.cmw }}
      <div class="triangle" />
    </div>
    <div
      v-if="goodInfo.goodsMod === 1 && inSale && canAddCart"
      class="btn-common btn-white"
      @click="startCustomMade"
    >
      {{ lang.startDJ }}
    </div>
    <!-- <div
      v-if="goodInfo.goodsMod === 1"
      :class="['btn-common', inSale && canAddCart ? 'btn-pink' : 'btn-gray']"
      @click="addCart"
    >
      {{
        inSale
          ? canAddCart
            ? lang.addCart
            : lang.noTotalStock
          : lang.notInSale
      }}
    </div> -->
    <div v-else>
      <div
        :class="['btn-common', inSale && canAddCart ? 'btn-white' : 'btn-gray']"
        @click="orderNow"
      >
        {{
          inSale
            ? canAddCart
              ? lang.buyNow
              : lang.noTotalStock
            : lang.notInSale
        }}
      </div>
      <div
        :class="['btn-common', inSale && canAddCart ? 'btn-pink' : 'btn-gray']"
        @click="addCart"
      >
        {{
          inSale
            ? canAddCart
              ? lang.addCart
              : lang.noTotalStock
            : lang.notInSale
        }}
      </div>
    </div>
    <!-- <div class="wish-and-share">
      <i
        :class="[
          'iconfont',
          { 'iconicon-xinyuandan': !inWish },
          { 'iconxinyuandan-dianji': inWish },
          { active: inWish }
        ]"
        @click="setWish"
      />
      <div />
      <i class="iconfont iconfb" @click="$shareFacelook()" />
    </div> -->
    <div class="ring-details">
      <div class="details-title">
        {{ lang.goodsDetail }}
      </div>
      <div class="details-sku">
        {{ lang.goods }}ID：{{ goodInfo.goodsCode }}
      </div>
      <div class="sku-table">
        <div v-for="(b, index) in goodInfo.specs" :key="index">
          <span>{{ b.configName }}</span>
          <span>{{ b.configAttrVal }}</span>
        </div>
      </div>
      <div class="desc-content" v-html="goodInfo.goodsDesc"></div>
    </div>

    <!-- 最近浏览 -->
      <div class="ring-details">
        <div class="recently-viewed" v-if="noteList.length>0">
          <div class="details-title">
            {{ lang.RecentlyViewed }}
          </div>

          <div class="swiper-box">
            <div class="img-box-more" > 
              <swiper :options="swiperOptionHot">
            　　<swiper-slide v-for="(each, n) in noteList" :key="n" >
                  <nuxt-link :to="each.to">
                    <img 
                      :src="imageStrToArray(each.goodsImages)[0]" 
                      @error="imageError"
                    />
                  </nuxt-link>
            　　</swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
      </div>

    <comment :style_id="goodInfo.id" :type_id="goodInfo.categoryId"></comment>

    <footer-bar></footer-bar>
    <swiper-tap
      ref="caratsSuitability"
      :list="goodInfo.carats"
      @clear="getCarats"
    ></swiper-tap>

    <swiper-tap
      ref="suitability"
      :list="goodInfo.sizes"
      @clear="getSortBy"
    ></swiper-tap>
    <choose-eject
      ref="quality-eject-choose-pro"
      :title="lang.fineness"
      :type="'quality'"
      :required="true"
      :options="conditions[0].options"
      @clear="clearQuality"
    ></choose-eject>
    <size-board ref="size-board"></size-board>

    <!-- 商品属性 -->
    <goods-attr v-if="showAttr" :info="goodInfo" :attrIndex="attrIndex" @close="showAttr=false" @changeAttr="changeAttr"></goods-attr>
  </div>
</template>

<script>
import Mx from './engagement-mixin'
import comment from '../personal/comment.vue'
export default {
  mixins: [Mx],
  components: {
    comment
  },
  computed: {
    canAddCart() {
      const body = this.goodInfo.details
      if (this.goodInfo.totalStock > 0) {
        for (const i in body) {
          if (parseInt(this.sendDetailsId) === body[i].id) {
            return body[i].stock > 0
          }
        }
      } else {
        return false
      }
      return true
    },
    inSale() {
      return this.goodInfo.goodsStatus === 2
    },
    noteList(){
      console.log("notelist",this.notes)
      const _this = this
      _this.notes.forEach(item => {
        item.to = _this.toDetail(item)
      })
      return this.notes.slice(0,5)
    }
  },
  data(){
    return {
      language:this.$store.state.language,
      swiperOptionHot: {
        loop: false,
        slidesPerView: 'auto',
        spaceBetween: 2.5,
        navigation: {
          nextEl: '.swiper-button-next'
        },
        on: {
          slideChange() {
            // console.log('onSlideChangeEnd', this);
          },
          tap() {
            // console.log('onTap', this);
          }
        }
      },
      notes:[],
      isLogin: !!this.$store.state.token,
      showAttr: false,
      attrIndex: null
    }
  },
  watch: {
    // 监听相同路由下参数变化的时候，从而实现异步刷新
    '$route'(to,from) {
      window.location.reload();
    }
  },
  mounted(){
    this.$nextTick(() => {
      // 获取访问记录
      this.addBrowseRecords()
      if(this.isLogin){
        this.onlinerecordings()
      }
      // this.recordings()
    })
  },
  methods:{
    // 获取已登录浏览记录
    onlinerecordings(){
      const _this = this
      _this.$axios({
          method: 'get',
          url: '/web/goods/style/recent-browsing',
          params: {
              style_id: _this.goodInfo.id,
              type_id: _this.goodInfo.categoryId
          }
        })
        .then(res => {
          _this.notes = res
            console.log("线上", res)
        })
        .catch(err => {
            this.$errorMessage(err.message)
        })
    },
    // 获取游客浏览记录
    recordings(){
      const _this = this
      this.$store.dispatch('getLocalBrowseRecords').then(res => {
        res.map((item, index) => {
          this.notes.push(item.data)
          // console.log("游客浏览记录",this.notes)
        })
        this.notes.reverse()
      })
    },
    toDetail(info) {
      let routerName = ''
      let query = ''
      console.log("info",routerName)
      if(info.categoryId == 2){
        routerName = 'marriage-ring-single-ring-detail'
        query={
          goodId: info.goodsId || info.id,
          ringType : 'single'
        }
      }else if(info.categoryId == 19){
        routerName = 'marriage-ring-pair-ring-detail'
        query={
          goodId: info.goodsId || info.id,
          ringType : 'pair'
        }
        
      }else if(info.categoryId == 12){
        routerName = 'engagement-engagement-rings'
        query={
          goodId: info.goodsId || info.id,
        }
      }else if(info.categoryId == 15){
        routerName = 'diamond-diamonds'
        query={
          goodId: info.goodsId || info.id,
        }
      }else{
        routerName = 'accessories-accessories'
        query={
          goodId: info.goodsId || info.id,
        }
      }
      // console.log("info",routerName)
      return{
        name: routerName,
        query: query
      }
    },
    changeAttr(select) {
      this.attrIndex = select
      this.chooseMaterialId = this.goodInfo.materials[select.materialsIndex].id;
      this.chooseMaterials = this.goodInfo.materials[select.materialsIndex].name;

      if(this.goodInfo.hasOwnProperty('sizes') && Array.isArray(this.goodInfo.sizes) && this.goodInfo.sizes.length){
        this.chooseSize = this.goodInfo.sizes[select.sizesIndex].content
        this.chooseSizeId = this.goodInfo.sizes[select.sizesIndex].sortBy
      }

      if(this.goodInfo.hasOwnProperty('carats') && Array.isArray(this.goodInfo.carats) && this.goodInfo.carats.length){
        this.chooseCarats = this.goodInfo.carats[select.caratsIndex].content
        this.chooseCaratsId = this.goodInfo.carats[select.caratsIndex].sortBy
      }

      // if(this.goodInfo.hasOwnProperty('colors') && Array.isArray(this.goodInfo.colors) && this.goodInfo.colors.length){
      //   this.chooseColors = this.goodInfo.colors[select.colorsIndex].content
      //   this.chooseColorId = this.goodInfo.colors[select.colorsIndex].sortBy
      // }

      // this.colorAttrs[0].config_id = this.colorDetail
      // this.colorAttrs[0].config_attr_id = this.chooseColorId

      this.goodInfo.details.map(item => {
        if (
          item.carat == (this.chooseCaratsId ? this.chooseCaratsId : item.carat) &&
          item.material == (this.chooseMaterialId ? this.chooseMaterialId : item.material) &&
          item.size == (this.chooseSizeId ? this.chooseSizeId : item.size)
        ) {
          this.showPi = item.retailMallPrice
          this.sendGoodsId = item.goodsId
          this.sendDetailsId = item.id
          this.categoryId = item.categoryId

          if(this.couponType(item.coupon) == 'discount'){
            this.showP2 = item.coupon.discount.price
          }else{
            this.showP2 = item.retailMallPrice
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.engagementRings-component {
  .details-component(100%);
  .btn-white{
    border:none!important;
  }
}
.recently-viewed{
  // 轮播
  .swiper-box{
    position: relative;
    width: 100%!important;
    height: 100%!important;
    
    .host-item{
      .product-image{
        height: 100%;
        width: 100%
      }
  
      .price{
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 15px;
        color: #444;
        opacity: 0;
      }
    }
  
  } 
  .img-box-more {
    width: 100%;
    // height: 13.1rem;
    overflow-x: scroll;
    // margin: 20px 0px 20px 18px;
  }

  .img-box-more .swiper-slide {
    width: 144px;
    height: 137px;
    margin-right: 10px!important;
    position: relative;
    border: 1px solid #ddd; 
    .icon-cart{
      position: absolute;
      right:10px;
      bottom: 5px;
    }
    a{
      display: inline-block;
      width: 100%;
      height: 100%;
      position: relative; 
    }
  }

  .img-box-more .swiper-button-next {
    width: 2rem;
    height: 3rem;
    // background: url(../../static/index/icon/right.png) no-repeat center;
    background-size: 100% 100%;
    position: absolute;
    top: 6.1rem;
    right: 5%;
    transform: translateY(-50%);
    margin: 0;
  }
  .swiper-slide img{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 1px;
    left: 1px;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
  }
}
</style>
<style scoped>
.desc-content >>> p,
.desc-content >>> div,
.desc-content >>> img {
  width: 100%;
}
</style>
