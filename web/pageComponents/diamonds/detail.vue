<template>
  <div class="page-content detail-page">
    <top-nav></top-nav>
    <section class="detail">
      <!--      左侧-->
      <div class="left-detail">
        <product-images
          :images="thumbnails"
          :gia-number="productInfo.giaNumber"
          @getIdx="getIndex"
          :coupon="coupons"
        ></product-images>

        <div class="magn-box">
          <bdd-magnifying :msg="magnifying"></bdd-magnifying>
        </div>
      </div>
      <!--      右侧-->
      <div class="right-detail">
       <div class="right-title">
       	<span class="discount-icon fl" v-if="info.coupon.discount">{{ language == 'en_US' ? discountUs(info.coupon.discount.discount)+'%' : discountConversion(info.coupon.discount.discount)}} {{ $t(`${lang}.discounts2`) }}</span>
       	<span class="favourable-icon fl" v-if="info.coupon.money">￥</span>

       	<h2 class="product-name">
       	  {{ info.goodsName }}
       	</h2>
       </div>
        <div class="product-code">{{ $t(`${lang}.goodsId`) }}:{{ info.goodsCode }}</div>
        <div v-if="showSkuBox" class="sku">
          <div class="left-properties"  v-if="productInfo.materials.length > 0">
            <div class="property-item">
              <span class="item-name">
                {{ $t(`${lang}.color`) }}
              </span>
              <div class="property">
                <div class="had-checked">
                  <i
                    :class="[
                      'iconfont',
                      'iconmaterial-big-pt',
                      'color-icon',
                      materialColors[
                        productInfo.materials[ringChecked.materialIndex].id
                      ]
                    ]"
                  ></i>
                  <span class="name ow-h1">
                    {{ productInfo.materials[ringChecked.materialIndex].name }}
                  </span>
                  <i class="iconfont iconxiala drop-down-icon"></i>
                </div>
                <ul class="options">
                  <li
                    v-for="(item, index) in productInfo.materials"
                    :key="index"
                    :class="[
                      'item',
                      { active: ringChecked.materialIndex === index }
                    ]"
                    @click="changeRingChecked('materialIndex', index)"
                  >
                    <i
                      :class="[
                        'iconfont',
                        'iconmaterial-big-pt',
                        'color-icon',
                        materialColors[item.id]
                      ]"
                    ></i>
                    <span class="name ow-h1">{{ item.name }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="right-properties"  v-if="productInfo.sizes.length > 0">
            <div class="property-item">
              <span class="item-name">
                {{ $t(`${lang}.size`) }}
              </span>
              <div class="property">
                <div class="had-checked">
                  <span class="name ow-h1">
                    {{ productInfo.sizes[ringChecked.sizeIndex].name }}
                  </span>
                  <i class="iconfont iconxiala drop-down-icon"></i>
                </div>
                <ul class="options">
                  <li
                    v-for="(item, index) in productInfo.sizes"
                    :key="index"
                    :class="[
                      'item',
                      { active: ringChecked.sizeIndex === index }
                    ]"
                    @click="changeRingChecked('sizeIndex', index)"
                  >
                    <span class="name ow-h1">{{ item.name }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <ul class="services-list">
          <li
            v-for="(item, index) in productInfo.goodsServicesJsons || []"
            :key="index"
            class="item"
          >
            <div class="item-image">
              <img :src="item.img" />
            </div>
            <div class="item-content">
              <span>{{ item.name }}</span>
            </div>
          </li>
        </ul>

        <!-- 折扣活动 -->
        <div class="discount-box" v-if="info.coupon.discount">
        	<div class="discount-active">
        		<div>
        			<span>{{ $t(`${lang}.discountsActive`) }}：</span>
        			<span class="discount-icon">{{ language == 'en_US' ? discountUs(this.info.coupon.discount.discount)+'%' : discountConversion(this.info.coupon.discount.discount)}} {{ $t(`${lang}.discounts2`) }}</span>
        		</div>
        		<div class="time">{{ $t(`${lang}.activityTime`) }}：{{activeTime}}</div>
        	</div>

        	<div class="discount-price">
        		<span class="old-price">{{ formatCoin(info.coinType) }} {{ formatNumber(this.info.salePrice) }}</span>
        		<span class="new-price">{{ formatCoin(info.coinType) }} {{ formatNumber(this.info.coupon.discount.price) }}</span>
        	</div>
        </div>

        <!-- 优惠活动 -->
        <div class="favourable-box" v-if="info.coupon.money">
        	<div class="discount-active">
        		<div>
        			<span>{{ $t(`${lang}.discounts1`) }}：</span>
        			<span class="favourable-icon">￥</span>
        			<span class="get" @click="getCoupon">{{ $t(`${lang}.getCoupon`) }}></span>
        		</div>
        		<!-- <div class="time">{{ $t(`${lang}.activityTime`) }}：{{activeTime}}</div> -->
        	</div>

        	<!-- <div class="discount-price">
        		<span class="old-price">HKD  2,222,22</span>
        		<span class="new-price">HKD  2,222,22</span>
        	</div> -->
        </div>

        <div class="product-price" v-if="!info.coupon.discount">
          <span class="coin">
            {{ formatCoin(info.coinType) }}
          </span>
          <span class="price">
            {{ formatNumber(price) }}
          </span>
        </div>
        <div
          v-if="
            (parseInt($route.query.step) === 1 && !$route.query.isBack) ||
              !$route.query.step
          "
          class="button-group"
        >
          <nuxt-link v-if="canAddCart" :to="startDj">
            <button class="start-dj">
				{{ $t(`${lang}.addToRing`) }}
            </button>
          </nuxt-link>
          <!-- <button
            class="buy-now"
            v-loading="addingCart"
            :class="['add-to-cart', { actived: canAddCart }]"
            @click="orderNow"
          >
            {{ $t(`${lang}.buyNow`) }}
          </button> -->

          <!-- <button
            class="add-cart"
            v-loading="addingCart"
            :class="['add-to-cart', { active: canAddCart }]"
            @click="addCart"
          >

            {{ $t(`${lang}.addCart`) }}
          </button> -->
        </div>
        <div
          v-if="
            ($route.query.step && parseInt($route.query.step) !== 1) ||
              $route.query.isBack
          "
          class="button-group"
        >
          <nuxt-link v-if="canAddCart" :to="finishDj">
            <button class="sure-choose">
              {{ $t(`${lang}.ConfirmTheChoice`) }}
            </button>
          </nuxt-link>
          <button v-else :class="['sure-choose', { active: canAddCart }]">
            {{ $t(`${lang}.ConfirmTheChoice`) }}
          </button>
        </div>
        <!--
        <div class="other-info">
          <ul class="operates">
             <li class="item wish-state">
              <i
                v-if="inWish(info.id)"
                class="iconfont iconxin active"
                @click.stop.prevent="setWish(info.id)"
              ></i>
              <i
                v-else
                class="iconfont iconkongxin"
                @click.stop.prevent="setWish(info.id)"
              ></i>
              <span>
                {{ $t(`${lang}.wish`) }}
              </span>
            </li>
            <li class="item compared-state">
              <i
                v-if="inCompared(info.id)"
                class="iconfont iconliebiao-duibi active"
                @click="setCompared(info.id)"
              ></i>
              <i
                v-else
                class="iconfont iconliebiao-duibi"
                @click="setCompared(info.id)"
              ></i>
              <span>
                {{ $t(`${lang}.wish`) }}
              </span>
            </li>
          </ul>
        </div> -->
      </div>
    </section>
    <!--    &lt;!&ndash;    推荐商品&ndash;&gt;-->
    <!--    <section class="list-content recommend">-->
    <!--      <h2 class="section-name">-->
    <!--        {{ $t(`${lang}.youMightAlsoLike`) }}-->
    <!--      </h2>-->
    <!--      <recommend-data :recommends="recommends"></recommend-data>-->
    <!--    </section>-->
    <!--    tab切换-->
    <!-- <ul class="tab">
      <li
        v-for="(item, index) in tabs"
        :key="index"
        :class="['item', { active: activeTab === item.key }]"
        @click="item.onClick"
      >
        <span>{{ item.name }}</span>
      </li>
    </ul> -->

    <!--    商品详情-->
    <h2 class="detail-name">{{ $t(`${lang}.goodsDetails`) }}</h2>
    <section ref="product-desc" class="desc-top">
      <div class="section-name">
        <h3>{{ $t(`${lang}.goodsId`) }}:
			<span>{{ info.goodsCode }}</span>
		</h3>
      </div>
      <div class="attr-group">
        <!-- <h3 class="group-name">{{ $t(`${lang}.productParameters`) }}:</h3> -->
        <ul class="attr-list">
          <li
            v-for="(item, index) in productInfo.specs"
            :key="index"
            class="attr-item"
          >
            <span>{{ item.configName }}:</span>
            <span>{{ item.configAttrVal || '--' }}</span>
          </li>
        </ul>
        <div class="line"></div>
      </div>
    </section>

    <!-- 最近浏览 -->
    <section class="recently-viewed" v-if="noteList.length>0">
      <h2 class="recently-name">
        {{ $t(`${lang}.RecentlyViewed`) }}
      </h2>
      <RecentlyViewed :noteList="noteList" :coupon="coupons"></RecentlyViewed>
    </section>

    <section class="desc" v-html="info.goodsDesc"></section>
    <order-include></order-include>
    <comments ref="product-comments" :good-id="info.id"></comments>
    <diamond-specs-info
      ref="diamonds-four-c"
      :specs="productInfo.specs"
    ></diamond-specs-info>

    <!-- 获取优惠券 -->
    <get-coupon v-if="showCoupon" @closeCoupon="showCoupon = false" :moneyInfo="info.coupon.money"></get-coupon>
    <login-pop v-if="ifShowLoginPop" @closeLogin="closeLogin"></login-pop>
  </div>
</template>

<script>
import Detail from '@/mixins/detail.js'
import Operate from '@/mixins/operate.js'
import TopNav from '@/pageComponents/detail/top-nav.vue'
import ProductImages from '@/pageComponents/detail/product-images.vue'
import OrderInclude from '@/pageComponents/detail/order-include.vue'
// import RecommendData from '@/pageComponents/detail/recommend.vue'
import DiamondSpecsInfo from '@/pageComponents/detail/diamond-specs-info.vue'
import Comments from '@/pageComponents/detail/comments.vue'
import RecentlyViewed from '@/pageComponents/detail/recentlyViewed.vue'
const lang = 'detail'
export default {
  head() {
    return {
      title: this.info.goodsName,
      meta: [
        {
          name: 'title',
          content: this.info.goodsName,
        },
        {
          name: 'description',
          content: this.info.goodsName,
        },
        {
          name: 'keywords',
          content: this.info.goodsName,
        }
      ]
    }
  },
  components: {
    TopNav,
    ProductImages,
    OrderInclude,
    // RecommendData,
    DiamondSpecsInfo,
    Comments,
    RecentlyViewed
  },
  mixins: [Detail, Operate],
  data() {
    const _this = this
    return {
      lang,
      tabs: [
        {
          key: 'desc',
          name: this.$t(`${lang}.goodsDetails`),
          targetRef: '',
          onClick() {
            const targetEle = document.getElementsByClassName('layout-box')[0]
            const top = _this.$refs['product-desc'].offsetTop - 110
            _this.$scrollTopTo(targetEle, top)
          }
        },
        {
          key: 'reviews',
          name: this.$t(`${lang}.diamond4C`),
          targetRef: '',
          onClick() {
            const targetEle = document.getElementsByClassName('layout-box')[0]
            const top = _this.$refs['diamonds-four-c'].$el.offsetTop - 110
            _this.$scrollTopTo(targetEle, top)
          }
        }
      ],
      activeTab: 'desc',
      materialColors: {
        // rings
        31: 'color-14k-white',
        28: 'color-18k-white',
        32: 'color-14k-yellow',
        29: 'color-18k-yellow',
        34: 'color-platinum',
        30: 'color-18k-rose-gold'
      },
      ringChecked: {
        materialIndex: 0,
        sizeIndex: 0
      },
	    magnifying: '',
      showCoupon: false,
      activeTime: '',
      language: this.$store.state.language,
      notes:[],
      isLogin: this.$store.getters.hadLogin,
    }
  },
  computed: {
    coupons() {
      var co;
      if(this.couponType(this.info.coupon) == 'discount'){
        co = this.info.coupon.discount.discount;
      }else if(this.couponType(this.info.coupon) == 'money'){
        co = 'money'
      }else{
        co = 0
      }

      return co
    },
    showSkuBox() {
      return (
        this.productInfo.materials.length > 0 &&
        this.productInfo.sizes.length > 0
      )
    },
    thumbnails() {
      return this.imageStrToArray(this.info.goodsImages || '')
    },
    productInfo() {
      return this.getProductInfo()
    },
    price() {
      const _this = this
      const info = _this.info || {}
      let result = info.salePrice
      if (_this.simpleDetail) {
        // console.log('相加')
        result = _this.simpleDetail.retailMallPrice
      } else {
        // console.log('不相加')
      }
      return result
    },
    simpleDetail() {
      const _this = this
      const productInfo = _this.productInfo
      const details = productInfo.details
      const ringChecked = _this.ringChecked

      const material =
        productInfo.materials.length > 0 &&
        productInfo.materials[ringChecked.materialIndex]
          ? productInfo.materials[ringChecked.materialIndex].id
          : null
      const size =
        productInfo.sizes.length > 0 && productInfo.sizes[ringChecked.sizeIndex]
          ? productInfo.sizes[ringChecked.sizeIndex].id
          : null

      let result = null
      for (let n = 0, length = details.length; n < length; n++) {
        const item = details[n]
        if (item.material === material && item.size === size) {
          result = item
          break
        }
      }
      return result
    },
    startDj() {
      const step = {
        steps: [
          {
            goodsId: this.simpleDetail.goodsId,
            goodsDetailsId: this.simpleDetail.id,
            categoryId: this.simpleDetail.categoryId,
            ct: 1,
            cartId: ``,
            page: `detail`
          },
          {
            goodsId: null,
            goodsDetailsId: null,
            categoryId: null,
            ct: null,
            cartId: ``,
            page: `list`
          }
        ],
        step: 2
      }
      const strStep = JSON.stringify(step)
      const urlStep = this.$helpers.base64Encode(strStep)
      return `/build-your-own-ring/settings?steps=${urlStep}&selectGoodsId=${this.simpleDetail.goodsId}&step=2`
    },
    finishDj() {
      if (this.$route.query.steps) {
        const queryStep = JSON.parse(
          this.$helpers.base64Decode(this.$route.query.steps)
        )
        queryStep.steps[1].goodsId = this.simpleDetail.goodsId
        queryStep.steps[1].goodsDetailsId = this.simpleDetail.id
        queryStep.steps[1].categoryId = this.simpleDetail.categoryId
        queryStep.steps[1].ct = 1
        queryStep.step = 3
        const strStep = JSON.stringify(queryStep)
        const urlStep = this.$helpers.base64Encode(strStep)
        return `/build-your-own-ring/review?steps=${urlStep}&selectGoodsId=${this.simpleDetail.goodsId}&step=3`
      } else {
        return ``
      }
    },
    noteList(){
      console.log("notelist",this.notes)
      const _this = this
      _this.notes.forEach(item => {
        item.images = _this.imageStrToArray(item.goodsImages || '')
        item.name = item.goodsName
        item.price = item.salePrice
        item.to = _this.getRoute(item)
      })
      return this.notes.slice(0,5)
    }
  },
  watch: {
    info(val, oldVal) {
      // console.log('info=======>')
    }
  },
  mounted() {
    const _this = this
    if(this.info.coupon.hasOwnProperty('discount')){
      this.activeTime = this.changeTime(this.info.coupon.discount.end_time)
    }

    _this.$nextTick(() => {
      // 获取访问记录
      this.addBrowseRecords()
      if(this.isLogin){
        this.onlinerecordings()
      }
      // this.recordings()
    })
    console.log(this.simpleDetail, `<=======`)

	this.magnifying = this.thumbnails[0]
  },
  methods: {
    // 获取已登录浏览记录
    onlinerecordings(){
      const _this = this
      _this.$axios({
          method: 'get',
          url: '/web/goods/style/recent-browsing',
          params: {
              style_id: _this.info.id,
              type_id: _this.info.categoryId
          }
        })
        .then(res => {
          _this.notes = res.data
            console.log("线上", res.data)
        })
        .catch(err => {
            this.$errorMessage(err.message)
        })
    },
    // 获取游客浏览记录
    recordings(){
      const _this = this
      this.$store.dispatch('getLocalBrowseRecords').then(res => {
        // console.log("戒指游客浏览记录",res)
        res.map((item, index) => {
          this.notes.push(item.data)
          // console.log("戒指游客浏览记录",item.data.goodsName)
        })
        this.notes.reverse()
      })
    },
    getProductInfo() {
      const _this = this
      const product = _this.info ? JSON.parse(JSON.stringify(_this.info)) : {}

      const specs = product.specs || []

      return Object.assign({}, product, {
        targetUser: (() => {
          let result = '--'
          specs.forEach(item => {
            if (item.configId === 26) {
              result = item.configAttrVal
            }
          })
          return result
        })(),
        materials: product.materials || [],
        sizes: product.sizes || [],
        specs,
        details: product.details || [],
        goodsServicesJsons: (product.goodsServicesJsons || []).map(item => {
          item.img = _this.imageStrToArray(item.img)
          return item
        }),
        giaNumber: (() => {
          let gay = false
          let gayNum = ``
          specs.forEach(item => {
            if (item.configId === 31) {
              gayNum = item.configAttrVal
            } else if (item.configId === 48 && item.configAttrId === 138) {
              gay = true
            }
          })
          return gay && gayNum ? gayNum : ''
        })()
      })
    },
    changeRingChecked(key, value) {
      const _this = this
      const ringChecked = JSON.parse(JSON.stringify(_this.ringChecked))
      ringChecked[key] = value
      _this.ringChecked = ringChecked
    },
    getIndex(i) {
      this.magnifying = this.thumbnails[i]
    },
    getRoute(product = {}){
      // console.log('product',product.categoryId)
      let path = ''
      let query = {}
      if(parseInt(product.categoryId) === 2){
          path=`/ring/wedding-rings/${product.id}`,
          query={
            goodId: product.id,
            ringType: 'single'
          }
      }else if(parseInt(product.categoryId) === 12){
          path= `/ring/engagement-rings/${product.id}`,
          query= {
            goodId: product.id,
            ringType: 'engagement'
          }
      }else if(parseInt(product.categoryId) === 19){  //对戒
          path=`/ring/wedding-rings/${product.id}`,
          query={
            goodId: product.id,
            ringType: 'pair'
          }
      }else if(parseInt(product.categoryId) === 15){
          path= `/diamond-details/${product.id}`,
          query= {
            goodId: product.id
          }

      }else{
          path= `/jewellery/necklace/${product.id}`,
          query={
            goodId: product.id
          }
      }
      return {
        path: path,
        query: query
      }
    },
    getRecommendProductRouteInfo(product = {}) {
      return {
        path: `/diamond-details/${product.id}`,
        query: {
          goodId: product.id
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.recently-viewed{
  margin-top: 60px;
    /deep/.list-data {
    min-width: 1200px;
    max-width: 1366px;
    margin: 0 auto;
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;

    .data-item {
      flex-grow: 0;
      flex-shrink: 0;
      width: 20% !important;  
      margin-bottom: 3px;
      box-sizing: border-box;
      transition: all 0.2s linear;

      &.product {
        border: 10px solid transparent;
      }
      &.ad-short,
      &.ad-long {
        border: 0;
        .ad-image {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;

          img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            // max-height: 100%;
          }
        }
      }
      &.ad-long {
        /*width: 680px;*/
        width: 50%;
      }
      .product-content {
        position: relative;
        .product-image {
          position: relative;
          overflow: hidden;
          .main-image,
          .sub-image {
            /*width: 320px;*/
            width: 100%;
            height: 250px;
            /*transform: scale(1, 1);*/
            /*transition: all 0.2s linear;*/
            display: inline-block;
          }
          .sub-image {
            display: none;
          }
          .wish-state {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.1s linear;

            .iconfont {
              font-size: 24px;
              color: #aaa;
            }
            .iconxin {
              color: #EFA19F;
            }
          }
        }

        .product-info {
          padding: 6px 20px 20px 20px;
          box-sizing: border-box;

          .product-price {
            margin-bottom: 6px;
            text-align: center;
            // font-size: 24px;
            font-size: 22px;
            font-family: twCenMT;
            font-weight: 400;
            color: rgba(242, 155, 135, 1);
            display: flex;
            justify-content: center;
            .coin {
              // margin-right: 6px;
              line-height: 31px;
              font-size: 18px;
            }

            .price {
            }
          }

          .product-title {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 22px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }
      .ad-content {
        width: 100%;
        height: 100%;
      }

      &:hover {
        &.product {
          border: 10px solid rgba(244, 242, 243, 1);
        }
        .product-content {
          .product-image {
            .main-image {
              display: none;
            }
            .sub-image {
              display: inline-block;
            }
            .wish-state {
              opacity: 1;
              visibility: visible;
            }
          }
        }
      }
    }
  }
  .recently-name{
    padding: 20px 27px;
    border-bottom: 1px solid #e6e6e6;
    font-size: 26px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    box-sizing: border-box;
  }
}
.detail-page {
  margin: auto;
  .add-cart{
    // margin-top: 10px;
    width: 320px!important;
  }
  .start-dj{
    width: 320px!important;
    background: #aa8a7b!important;
    color:#fff!important;
  }
  // .buy-now{
  //   margin-top: 10px;
  //   width: 659px!important;
  // }
  .four-c {
    padding: 40px;
    .p-title {
      margin-bottom: 40px;
      font-size: 24px;
      color: #1b1b1b;
      text-align: left;
    }
    .c-content {
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 40px;
      margin-bottom: 40px;
      h6 {
        font-size: 24px;
        color: #333333;
        margin-bottom: 20px;
        span {
          font-weight: normal;
          font-size: 20px;
        }
      }
      .tips {
        width: 54px;
        height: 1px;
        background: #aa8a7b;
        margin: 0 auto;
      }
      .c-body {
        .img {
          width: 1056px;
          height: 146px;
        }
        .test {
          width: 910px;
          height: 70px;
          margin: 20px 0 0 110px;
          background: #e9c7bf;
          font-size: 12px;
          line-height: 24px;
          text-align: left;
          padding-left: 12px;
          color: #ffffff;
        }
      }
    }
    .color {
      margin-top: 40px;
      border-top: 1px solid #eeeeee;
      padding-top: 40px;
      .c-body {
        ul {
          display: inline-block;
          margin: 40px auto 0;
          li {
            float: left;
            width: 100px;
            height: 105px;
            margin: 0 10px;
            span {
              display: block;
              text-align: center;
              font-size: 18px;
              color: #333333;
              margin: 12px 0;
            }
            img {
              width: 71px;
              height: 58px;
            }
          }
          .active {
            border: 1px solid #ba7f8c;
            box-shadow: 0px 1px 3px #e2c09f;
          }
        }
        .color-explain {
          display: inline-block;
          width: 1080px;
          height: 100px;
          margin: 20px auto 0;
          .explain-1 {
            float: left;
            width: 340px;
            height: 100px;
            margin-left: 10px;
            div {
              width: 340px;
              height: 20px;
              border: 1px solid #aa8a7b;
              border-top: none;
              margin-bottom: 30px;
            }
            p {
              font-size: 18px;
              color: #333333;
            }
          }
          .explain-2 {
            float: left;
            width: 476px;
            height: 100px;
            margin-left: 10px;
            div {
              width: 476px;
              height: 20px;
              border: 1px solid #aa8a7b;
              border-top: none;
              margin-bottom: 30px;
            }
            p {
              font-size: 18px;
              color: #333333;
            }
          }
          .explain-3 {
            float: left;
            width: 226px;
            height: 100px;
            margin-left: 10px;
            div {
              width: 224px;
              height: 20px;
              border: 1px solid #aa8a7b;
              border-top: none;
              margin-bottom: 30px;
            }
            p {
              font-size: 18px;
              color: #333333;
            }
          }
        }
      }
    }
    .cut {
      .c-body {
        .img {
          width: 1056px;
          height: 180px;
        }
        .test {
          position: relative;
          width: 1056px;
          img {
            position: absolute;
            top: -10px;
            left: 10px;
            height: 10px;
            width: 20px;
          }
        }
      }
    }
    .carat {
      padding-bottom: 0px;
      margin-bottom: 0px;
      border-bottom: none;
      .c-body {
        .test {
          position: relative;
          img {
            position: absolute;
            top: -10px;
            left: 10px;
            height: 10px;
            width: 20px;
          }
        }
        .left {
          float: left;
          width: 350px;
          ul {
            display: inline-block;
            height: 220px;
            width: 183px;
            border-bottom: 1px solid #aa8a7b;
            li {
              position: relative;
              width: 100%;
              height: 40px;
              font-size: 18px;
              line-height: 40px;
              border: 1px solid #aa8a7b;
              border-bottom: none;
              &:last-child {
                border-bottom: 1px solid #aa8a7b;
              }
              span {
              }
              div {
                display: none;
                position: absolute;
                top: 0;
                left: 210px;
                width: 420px;
                padding: 8px 10px;
                background: #e9c7bf;
                color: #ffffff;
                text-align: left;
                border-radius: 2px;
                b {
                  float: left;
                  font-size: 24px;
                  line-height: 26px;
                  margin-bottom: 10px;
                  font-weight: 300;
                }
                p {
                  float: left;
                  width: 100%;
                  font-size: 14px;
                  line-height: 18px;
                }
                img {
                  position: absolute;
                  top: 20px;
                  left: -9px;
                  width: 10px;
                  height: 20px;
                }
              }
            }
            .active {
              height: 60px;
              line-height: 60px;
              background: #eeeeee;
              div {
                display: block;
              }
            }
          }
        }
        .right {
          float: right;
          width: 360px;
          margin-right: 100px;
          p {
            font-size: 12px;
            color: #666666;
            margin-bottom: 24px;
          }
          img {
            width: 300px;
            height: 200px;
          }
        }
      }
    }
  }
}
</style>
