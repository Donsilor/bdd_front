<template>
  <div class="engagementRings-component">
    <div v-if="this.goodInfo.goodsStatus === 2">
      <div class="swiper-box">
        <swiper1 :auto="true" :duration="5000">
          <div v-for="(each, n) in ringBanners" :key="n">
            <nuxt-link
              :to="
                `/image-view?path=${$helpers.base64Encode(
                  JSON.stringify(ringBanners)
                )}`
              "
              ><img :src="each"
            /></nuxt-link>
          </div>
        </swiper1>

        <div class="activity-sign" v-if="goodInfo.coupon.discount || goodInfo.coupon.money">
          <div class="triangle" v-if="goodInfo.coupon.discount">{{ language == 'en_US' ? discountUs(this.goodInfo.coupon.discount.discount)+'%' : discountConversion(this.goodInfo.coupon.discount.discount)}}{{ lang.discounts2 }}</div>
          <div class="triangle" v-if="goodInfo.coupon.money">{{ lang.discounts1 }}</div>
        </div>
      </div>

      <div class="border-bottom">
        <div class="title">
          <span class="discount-icon" v-if="goodInfo.coupon.discount">{{ language == 'en_US' ? discountUs(this.goodInfo.coupon.discount.discount)+'%' : discountConversion(this.goodInfo.coupon.discount.discount)}}{{ lang.discounts2 }}</span>
          <span class="discount-icon padding" v-if="goodInfo.coupon.money">￥</span>
          {{ goodInfo.goodsName }}
        </div>
        <div class="price" v-if="!goodInfo.coupon.discount">
          {{ formatCoin(goodInfo.coinType) }}{{ formatNumber(showPrice) }}
        </div>

        <div class="discount-price" v-else>
          <div class="old-price">{{ formatCoin(goodInfo.coinType) }} {{ formatNumber(showPrice) }}</div>
          <div class="new-price">{{ formatCoin(goodInfo.coinType) }} {{ formatNumber(showPrice2) }}</div>
        </div>
        <div class="promise-box">
          <div
            v-for="(c, index) in goodsServicesJsons"
            :key="index"
            class="promise-info"
          >
            <div class="promise-img">
              <img :src="$IMG_URL + c.img" alt="" />
            </div>
            <span>{{ c.name }}</span>
          </div>
        </div>

        <!-- 优惠活动 -->
        <div class="discount-activity" v-if="goodInfo.coupon.discount || goodInfo.coupon.money">
          <div class="discount-l">
            <div class="discoupon-d" v-if="goodInfo.coupon.discount">
              <div class="discoupon-d-l">
                <span class="text">{{ lang.discountsActive }}：</span>
                <span class="discount-icon">{{ language == 'en_US' ? discountUs(this.goodInfo.coupon.discount.discount)+'%' : discountConversion(this.goodInfo.coupon.discount.discount)}}{{ lang.discounts2 }}</span>
              </div>

              <div class="time">{{ lang.activityTime}}：{{activeTime}}</div>
            </div>

            <div class="discoupon-d" v-if="goodInfo.coupon.money">
              <div class="discoupon-d-l">
                <span class="text">{{ lang.discountsActive }}：</span>
                <span class="discount-icon">￥</span>
              </div>

              <div class="get" @click="getCoupon">{{ lang.getCoupon }} &gt;</div>
            </div>
          </div>
        </div>

        <div class="include-box">
          <span>{{ lang.include }}</span>
          <div>
            <i class="iconfont icontaojie" />
          </div>
          <span>{{ lang.pairRing }}*1</span>
        </div>
    
        <!-- 第一个戒指 -->
        <div class="select-box">
          <div class="select-line">
            <span>
              <span
                :class="[
                  'sex-icon',
                  ['lady', 'gentlemen', 'neutral'][firstRing.userSex]
                ]"
              >
                <i
                  :class="[
                    'iconfont',
                    ['icon_nv', 'icon_nan', 'iconnannv'][firstRing.userSex]
                  ]"
                />
              </span>
              {{ lang.goodsMaterial }}：
            </span>
            <span>{{ firstRingMaterialText }}</span>
          </div>
          <!-- <div class="bd-b"></div> -->
          <div class="select-line first" v-if="firstRing.carats.length >0">
            <span>{{ lang.goodsCarat }}：</span>
            <span>{{ firstRingCaratText }}</span>
          </div>
          <!-- <div class="bd-b" v-if="firstRing.carats.length >0"></div> -->
          <div class="select-line">
            <span>
              <span>{{ lang.goodsSize }}（{{ lang['us-version'] }}）</span>
              <div @click="openSize()">!</div>：
            </span>
            <span>{{ firstRingSizeText }}</span>
          </div>
          <!-- <div class="bd-b"></div> -->
          <!-- 色彩 start -->
          <div class="select-line first" v-if="firstRing.colors.length >0">
            <span>{{ lang.goodsColor }}：</span>
            <span>{{ firstRingColorText }}</span>
          </div>
          <!-- <div class="bd-b" v-if="firstRing.colors.length >0"></div> -->
          <!-- 色彩 end -->
          
          <i class="iconfont iconyou" @click="showAttr=true, double='doubleA'" />
        </div>

        <!--      第二个戒指-->
        <div class="select-box">
          <div class="select-line">
            <span>
              <span
                :class="[
                  'sex-icon',
                  ['lady', 'gentlemen', 'neutral'][secondRing.userSex]
                ]"
              >
                <i
                    :class="[
                      'iconfont',
                      ['icon_nv', 'icon_nan', 'iconnannv'][firstRing.userSex]
                    ]"
                  />
                </span>
              {{ lang.goodsMaterial }}：
            </span>
            <span>{{ secondRingmaterialText }}</span>
          </div>
          <!-- <div class="bd-b"></div> -->
          <div class="select-line second" v-if="secondRing.carats.length >0">
            <span>{{ lang.goodsCarat }}：</span>
            <span>{{ secondRingCaratText }}</span>
          </div>
          <!-- <div class="bd-b" v-if="secondRing.carats.length >0"></div> -->
          <div class="select-line">
            <span>
              <span>{{ lang.goodsSize }}（{{ lang['us-version'] }}）</span>
              <div @click="openSize()">!</div>：
            </span>
            <span>{{ secondRingSizeText }}</span>
          </div>
          <!-- 色彩 start -->
          <!-- <div class="bd-b" v-if="secondRing.colors.length >0"></div> -->
          <div class="select-line second" v-if="secondRing.colors.length >0">
            <span>{{ lang.goodsColor }}：</span>
            <span>{{ secondRingColorText }}</span>
          </div>
          <!-- 色彩 end -->

          <i class="iconfont iconyou" @click="showAttr=true, double='doubleB'"/>
        </div>

        <div
          :class="['btn-common btn-gray', { btnActive: canAddCart }]"
          @click="orderNow"
        >
          {{ lang.buyNow }}
        </div>
        <div
          :class="['btn-common btn-gray', { btnActivePink: canAddCart }]"
          @click="addCart"
        >
          {{ lang.addCart }}
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
        <div class="details-sku">{{ lang.goods }}ID：{{ goodInfo.goodsCode }}</div>
        <div class="base-info">
          <div class="details-title">
            {{ firstRing.userSexText }}
          </div>
          <div class="sku-table">
            <div v-if="index < detailNum" v-for="(b, index) in firstRing.specs" :key="index">
              <span>{{ b.configName }}</span>
              <span>{{ b.configAttrVal }}</span>
            </div>

            <div v-if="specsLength" :class="['icon',{'reverse': ifShowMore}]" @click="showMore"></div>
          </div>
        </div>
        <div class="base-info">
          <div class="details-title">
            {{ secondRing.userSexText }}
          </div>
          <div class="sku-table">
            <div v-if="index < detailNumT" v-for="(b, index) in secondRing.specs" :key="index">
              <span>{{ b.configName }}</span>
              <span>{{ b.configAttrVal }}</span>
            </div>

            <div v-if="specsLengthT" :class="['icon',{'reverse': ifShowMoreT}]" @click="showMoreT"></div>
          </div>
        </div>
        <div class="desc-content" v-html="ringDetail"></div>
      </div>

      <!-- 最近浏览 -->
      <div class="ring-details">
        <div class="recently-viewed" v-if="noteList.length>0">
          <div class="details-title">
            {{ lang.RecentlyViewed }}
          </div>
          <!-- <div v-for="(each, n) in noteList" :key="n" @click="toDetail(each)">
            <div class="info-image">
              <img 
                :src="imageStrToArray(each.goodsImages)[0]" 
                @error="imageError"
              />
            </div>
          </div> -->
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
        ref="first-ring-carat"
        :title="`${lang.carat}`"
        :list="firstRing.carats"
        @clear="firstRingClearCarat"
      ></swiper-tap>
      <swiper-tap
        ref="first-ring-suitability"
        :list="firstRing.sizes"
        @clear="firstRingClearSize"
      ></swiper-tap>
      <swiper-tap
        ref="first-ring-color"
        :title="`${lang.shade}`"
        :list="firstRing.colors"
        @clear="firstRingClearColor"
      ></swiper-tap>
      <choose-eject
        ref="first-ring-quality-choose"
        :title="`${lang.fineness}`"
        :type="'quality'"
        :required="true"
        :options="firstRingQuality.options"
        @clear="firstRingClearQuality"
      ></choose-eject>

      <swiper-tap
        ref="second-ring-carat"
        :title="`${lang.carat}`"
        :list="secondRing.carats"
        @clear="secondRingClearCarat"
      ></swiper-tap>
      <swiper-tap
        ref="second-ring-suitability"
        :list="secondRing.sizes"
        @clear="secondRingClearSize"
      ></swiper-tap>
      <swiper-tap
        ref="second-ring-color"
        :title="`${lang.shade}`"
        :list="secondRing.colors"
        @clear="secondRingClearColor"
      ></swiper-tap>
      <choose-eject
        ref="second-ring-quality-choose"
        :title="`${lang.fineness}`"
        :type="'quality'"
        :required="true"
        :options="secondRingQuality.options"
        @clear="secondRingClearQuality"
      ></choose-eject>
      <size-board ref="size-board"></size-board>
      <!-- 获取优惠券 -->
      <get-coupon v-if="ifShowCoupon" @closeCoupon="closeCo()" :moneyInfo="this.goodInfo.coupon.money"></get-coupon>
      <login-pop v-if="ifShowPop" @closePop="closePop"></login-pop>

      <!-- 商品属性 -->
      <goods-attr
        v-if="showAttr"
        :info="goodInfo"
        :doubleType="double"
        :attrIndex="attrIndex"
        :attrIndexB="attrIndexB"
        @close="showAttr=false"
        @changeAttr="changeAttr"
        :firstRing="firstRing"
        :secondRing="secondRing"
        :goodsAttrA="goodsAttrA"
        :goodsAttrB="goodsAttrB"
        :firstRingId="firstRingId"
        :secondRingId="secondRingId"
        :attrRegroupA="attrRegroupA"
        :attrRegroupB="attrRegroupB"
      ></goods-attr>
    </div>

    <div v-else >
      <soleOut></soleOut>
    </div>
  </div>
</template>

<script>
import Mx from './pair-mixin'
import soleOut from '@/components/goods-sole-out/index.vue'
import comment from '../personal/comment.vue'
export default {
  head() {
    return {
      title: this.goodInfo.goodsName,
      meta: [
        {
          name: 'title',
          content: this.goodInfo.goodsName,
        },
        {
          name: 'description',
          content: this.goodInfo.goodsName,
        },
        {
          name: 'keywords',
          content: this.goodInfo.goodsName,
        }
      ]
    }
  },
  mixins: [Mx],
  components: {
    soleOut,
    comment
  },
  data(){
    return{
      url:[
        require('../../static/marriage-ring/icon-01.png'),
        require('../../static/marriage-ring/icon-02.png'),
        require('../../static/marriage-ring/icon-03.png'),
        require('../../static/marriage-ring/icon-04.png')
      ],
      ifShowCoupon: false,
      language: this.$store.state.language,
      activeTime:'',
      ifShowMore: false,
      detailNum: 4,
      ifShowMoreT: false,
      detailNumT: 4,
      ifShowPop: false,
      swiperOptionHot: {
        loop: false,
        slidesPerView: 'auto',
        spaceBetween: 2.5,
        navigation: {
          nextEl: '.swiper-button-next'
        },
        on: {
          slideChange() {},
          tap() {}
        }
      },
      notes:[],
      isLogin: !!this.$store.state.token,
      showAttr: false,
      attrIndex: null,
      attrIndexB: null,
      double: '',
      attrRegroupA: '',
      attrRegroupB: ''
    }
  },
  computed: {
    canAddCart() {
      if (this.firstRing.totalStock > 0 && this.secondRing.totalStock > 0) {
        if (this.firstStock <= 0 || this.secondStock <= 0){
          return false
        }
      } else{
        return false
      }
      if(this.goodsId){
        return true
      }
      
      return false
    },
    inSale() {
      return (
        this.goodInfo.goodsStatus === 2
      )
    },
    specsLength() {
      if(this.firstRing && this.firstRing.specs && this.firstRing.specs.length > 4){
        return true
      }else{
        return false
      }
    },
    specsLengthT() {
      if(this.secondRing && this.secondRing.specs && this.secondRing.specs.length > 4){
        return true
      }else{
        return false
      }
    },
    noteList(){
      const _this = this
      _this.notes.forEach(item => {
        item.to = _this.toDetail(item)
      })
      return this.notes.slice(0,5)
    }
  },
  watch: {
    // 监听相同路由下参数变化的时候，从而实现异步刷新
    '$route'(to,from) {
      window.location.reload();
    }
  },
  mounted(){
    const _this = this
    if(this.goodInfo.coupon.hasOwnProperty('discount')){
      this.activeTime = this.changeTime(this.goodInfo.coupon.discount.end_time)
    }

    _this.$nextTick(() => {
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
        })
        this.notes.reverse()
      })
    },
    toDetail(info) {
      let routerName = ''
      let query = ''
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
      return{
        name: routerName,
        query: query
      }
    },
    closeCo() {
      this.ifShowCoupon = false
    },
    // 获取优惠券
    getCoupon() {
      if(!this.$store.getters.hadLogin) {
        this.ifShowPop = true
        // this.$toast.show(this.lang.needLogin)
      }else{
        this.ifShowCoupon = true
      }
    },
    showMore(){
      this.ifShowMore = !this.ifShowMore
      this.detailNum = this.detailNum == 4 ? 100 : 4
    },
    showMoreT(){
      this.ifShowMoreT = !this.ifShowMoreT
      this.detailNumT = this.detailNumT == 4 ? 100 : 4
    },
    closePop() {
      this.ifShowPop = false
    },
    changeAttr(select) {
      if(select.type == 'doubleA'){
        if(select.firstId){
          this.firstRingId = select.firstId
        }

        if(typeof(select.material) == 'object'){
          this.firstRingMaterial = {
            id: select.material.id,
            text: select.material.name
          }
        }

        if(typeof(select.carat) == 'object'){
          this.firstRingCarat = {
            id: select.carat.sortBy,
            text: select.carat.content
          }
        }

        if(typeof(select.size) == 'object'){
          this.firstRingSize = {
            id: select.size.sortType,
            text: select.size.content
          }
        }

        if(typeof(select.color) == 'object'){
          this.firstRingColor = {
            id: select.color.sortType,
            text: select.color.content
          }
          this.firstRingColorAttrs[0].config_id = this.firstRingColorDetail
          this.firstRingColorAttrs[0].config_attr_id = this.firstRingColor.id
        }

        this.attrIndex = select.select

        if(select.attrRegroup){
          this.attrRegroupA = select.attrRegroup
        }
      }else{
        if(select.secondId){
          this.secondRingId = select.secondId
        }

        if(typeof(select.material) == 'object'){
          this.secondRingMaterial = {
            id: select.material.id,
            text: select.material.name
          }
        }

        if(typeof(select.carat) == 'object'){
          this.secondRingCarat = {
            id: select.carat.sortBy,
            text: select.carat.content
          }
        }

        if(typeof(select.size) == 'object'){
          this.secondRingSize = {
            id: select.size.sortType,
            text: select.size.content
          }
        }

        if(typeof(select.color) == 'object'){
          this.secondRingColor = {
            id: select.color.sortType,
            text: select.color.content
          }
          this.secondRingColorAttrs[0].config_id = this.secondRingColorDetail
          this.secondRingColorAttrs[0].config_attr_id = this.secondRingColor.id
        }

        this.attrIndexB = select.select

        if(select.attrRegroup){
          this.attrRegroupB = select.attrRegroup
        }
      }

      this.showPi = select.price
      this.sendDetailsId = select.id

      let item;
      for(let i=0, len=this.goodInfo.details.length; i<len; i++){
        item = this.goodInfo.details[i]
        if(item.id == select.id){
          this.coupleLadyId = item.ladyRing
          this.coupleMenId = item.menRing
          this.goodsId = item.id
          this.styleId = item.goodsId
          this.categoryId = item.categoryId
          this.goodInfo.salePrice = item.retailMallPrice
          if(this.goodInfo.coupon.discount){
            this.goodInfo.coupon.discount.price = item.coupon.discount.price
          }
          this.stock = item.stock
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.engagementRings-component {
  .details-component(100%);
}
.time {
  color: #b49785;
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
