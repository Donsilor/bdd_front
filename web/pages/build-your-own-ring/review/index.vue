<template>
  <div>
    <step></step>
    <div class="page-content detail-page">
      <top-nav></top-nav>
      <section class="detail">
        <!--      左侧-->
        <div class="left-detail">
          <product-images :images="thumbnails" @getIdx="getIndex"></product-images>
          
          <div class="magn-box">
            <bdd-magnifying :msg="magnifying"></bdd-magnifying>
          </div>
        </div>
        <!--      右侧-->
        <div class="right-detail">
          <div class="double-box">
            <div class="info-block">
              <div class="left-info-block">
                <img :src="imageStrToArray(block1.pick)" />
                <div class="title-block">
                  <div class="title-block-name">
				            <span class="discount-icon fl" v-if="block1.couponType == 1">{{ language == 'en_US' ? discountUs(this.block1.couponNum)+'%' : discountConversion(this.block1.couponNum)}} {{ $t(`${lang}.discounts2`) }}</span>
				            <span class="favourable-icon fl" v-if="block1.couponType == 2">￥</span>

                    {{ block1.name }}
                  </div>
                  <div class="title-block-sku">
                    {{ block1.sku }}
                  </div>
                </div>
              </div>
              <div class="right-info-block product-price original-price" :class="{'old-price' : block1.oldPrice !== block1.newPrice}">
                <span class="coin">
                  {{ formatCoin (info.coinType) }}
                </span>
                <span class="price">
                  {{ formatNumber(block1.oldPrice) }}
                </span>
              </div>

			  <div class="right-info-block product-price">
			    <span class="coin">
				  {{ formatCoin (info.coinType) }}
			    </span>
			    <span class="price">
			      {{ formatNumber(block1.newPrice) }}
			    </span>
			  </div>
            </div>
            <div class="info-block">
              <div class="left-info-block">
                <img :src="imageStrToArray(block2.pick)" />
                <div class="title-block">
                  <div class="title-block-name">
					          <span class="discount-icon fl" v-if="block2.couponType == 1">{{ language == 'en_US' ? discountUs(this.block2.couponNum)+'%' : discountConversion(this.block2.couponNum)}} {{ $t(`${lang}.discounts2`) }}</span>
					          <span class="favourable-icon fl" v-if="block2.couponType == 2">￥</span>

                    {{ block2.name }}
                  </div>
                  <div class="title-block-sku">
                    {{ block2.sku }}
                  </div>
                </div>
              </div>
              <div class="right-info-block product-price original-price" :class="{'old-price' : block2.oldPrice !== block2.newPrice}">
                <span class="coin">
                  {{ formatCoin (info.coinType) }}
                </span>
                <span class="price">
                  {{ formatNumber(block2.oldPrice) }}
                </span>
              </div>

			  <div class="right-info-block product-price">
			    <span class="coin">
			      {{ formatCoin (info.coinType) }}
			    </span>
			    <span class="price">
			      {{ formatNumber(block2.newPrice) }}
			    </span>
			  </div>
            </div>
          </div>
          <div class="product-price">
			<div class="total-price" v-if="oldPrice !== newPrice" :class="{'old-price-2' : oldPrice !== newPrice}">
				<span class="coin">
				  {{ formatCoin (info.coinType) }}
				</span>
				<span class="price">
				  {{ formatNumber(oldPrice) }}
				</span>
			</div>

			<div class="total-price">
				<span class="coin">
				  {{ formatCoin (info.coinType) }}
				</span>
				<span class="price">
				  {{ formatNumber(newPrice) }}
				</span>
			</div>
          </div>
          <div class="button-group">
            <button
              v-loading="addingCart"
              :class="['add-to-cart', { actived: true }]"
              @click="orderNow"
            >
              {{ $t(`${lang}.buyNow`) }}
            </button>

            <button
              v-loading="addingCart"
              :class="['add-to-cart', { active: true }]"
              @click="addCart"
            >
              {{ $t(`${lang}.addCart`) }}
            </button>

          </div>
        </div>
      </section>

      <!--    推荐商品-->
      <!-- <section class="list-content recommend">
        <h2 class="section-name">
          {{ $t(`${lang}.youMightAlsoLike`) }}
        </h2>
        <recommend-data :recommends="recommends"></recommend-data>
      </section> -->
      
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
          <h3>{{ $t(`${lang}.goodsId`) }}：
            <span>{{ info.goodsCode }}</span>
          </h3>
        </div>
        <div class="attr-group">
          <!-- <h3 class="group-name">{{ $t(`${lang}.productParameters`) }}</h3> -->
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
      <section class="desc" v-html="info.goodsDesc"></section>
      <order-include></order-include>
      <!-- <comments ref="product-comments" :good-id="info.id"></comments> -->
      <login-pop v-if="ifShowLoginPop" @closeLogin="closeLogin"></login-pop>
    </div>
  </div>
</template>

<script>
import Helpers from '@/assets/js/helpers.js'
import TopNav from '@/pageComponents/detail/top-nav.vue'
import ProductImages from '@/pageComponents/detail/product-images.vue'
import OrderInclude from '@/pageComponents/detail/order-include.vue'
import Comments from '@/pageComponents/detail/comments.vue'
import RecommendData from '@/pageComponents/detail/recommend.vue'
const lang = 'detail'
export default {
  components: {
    TopNav,
    ProductImages,
    OrderInclude,
    Comments,
    RecommendData
  },
  data() {
    const _this = this
    return {
      lang,
      addingCart: false,
      info: null,
      steps: {},
      block1: {
        pick: ``,
        name: ``,
        sku: ``,
        oldPrice: ``,
		    newPrice: ``,
        detail: ``,
        couponType: 0,
        couponNum: 0
      },
      block2: {
        pick: ``,
        name: ``,
        sku: ``,
        oldPrice: ``,
        newPrice: ``,
        detail: ``,
        couponType: 0,
        couponNum: 0
      },
      tabs: [
        {
          key: 'desc',
          name: this.$t(`${lang}.goodsDetails`),
          ref: '',
          onClick() {
            const targetEle = document.getElementsByClassName('layout-box')[0]
            const top = _this.$refs['product-desc'].offsetTop - 110
            _this.$scrollTopTo(targetEle, top)
          }
        },
        {
          key: 'reviews',
          name: this.$t(`${lang}.customerReviews`),
          ref: '',
          onClick() {
            const targetEle = document.getElementsByClassName('layout-box')[0]
            const top = _this.$refs['product-comments'].$el.offsetTop - 110
            _this.$scrollTopTo(targetEle, top)
          }
        }
      ],
      activeTab: 'desc',
      magnifying: '',
      language: this.$store.state.language,
      isLogin:this.$store.getters.hadLogin,
      ifShowLoginPop: false
    }
  },
  computed: {
    recommends() {
      const _this = this
      const allData = JSON.parse(JSON.stringify(_this.info.recommends || []))
      allData.forEach(item => {
        item.images = _this.imageStrToArray(item.goodsImages || '')
        item.name = item.goodsName
        item.price = item.salePrice
      })
      return allData
    },
    // // 是否在销售
    // inSale() {
    //   return this.info.goodsStatus === 2
    // },
    // // 是否有存货
    // hadStock() {
    //   try {
    //     if (this.simpleDetail.stock > 0) {
    //       return true
    //     }
    //     return false
    //   } catch (e) {
    //     return false
    //   }
    // },
    // // 是否可以加入购物车
    // canAddCart() {
    //   // console.log('canAddCart======>', this.inSale, this.hadStock)
    //   return this.inSale && this.hadStock
    // },
    thumbnails() {
      return this.imageStrToArray(this.info.goodsImages || '')
    },
    productInfo() {
      return this.getRingInfo()
    },
    oldPrice() {
      return this.block1.oldPrice + this.block2.oldPrice
    },
    newPrice() {
      return this.block1.newPrice + this.block2.newPrice
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
    getTimestampUuid () {
      return new Date().getTime().toString()
    }
  },
  watch: {
    info(val, oldVal) {
      console.log('info=======>')
    }
  },
  asyncData({ $axios, route, store }) {
    const getSingleRing = () => {
      const steps = JSON.parse(Helpers.base64Decode(route.query.steps))
      const goodsId =
        steps.steps[0].ct === 1
          ? steps.steps[1].goodsId
          : steps.steps[0].goodsId
      return $axios({
        method: 'post',
        url: '/web/goods/style/detail',
        data: {
           goodsId
        },
        // params: {
        //   goodsId
        // },
        transformRequest: [
          function(data) {
            let ret = ''
            for (const it in data) {
              // 过滤空元素
              if (data[it] === '' || data[it] === null) {
                continue
              }
              ret +=
                encodeURIComponent(it) +
                '=' +
                encodeURIComponent(data[it]) +
                '&'
            }
            return ret
          }
        ],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(res => {
          var data = res.data;
          return {
            info: data
          }
        })
        .catch(err => {
          console.error(err)
        })
    }

    return getSingleRing()
  },
  mounted() {
    console.log("block",this.block1,this.block2)
    const _this = this
    _this.$nextTick(() => {
      this.steps = JSON.parse(
        this.$helpers.base64Decode(this.$route.query.steps)
      )
      this.getPrice(this.steps.steps[0].goodsId, this.steps.steps[1].goodsId,this.steps.steps[0].ct)
    })
    
    this.magnifying = this.thumbnails[0]

	// this.language = this.getCookie('language')
  },
  methods: {
    getRingInfo() {
      const _this = this
      const product = _this.info ? JSON.parse(JSON.stringify(_this.info)) : {}

      return Object.assign({}, product, {
        targetUser: (() => {
          const specs = product.specs || []
          let result = '--'
          specs.forEach(item => {
            if (item.configId === 26) {
              result = item.configAttrVal
            }
          })
          return result
        })(),
        materials: product.materials || [],
        // sizes: product.sizes || [],
        sizes:(() =>{
            const sizes = product.sizes || []
            sizes.unshift({id:'',name: this.$t(`personal.index.select`)})
            return sizes;
        })(),
        specs: product.specs || [],
        details: product.details || [],
        goodsServicesJsons: (product.goodsServicesJsons || []).map(item => {
          item.img = _this.imageStrToArray(item.img)
          return item
        })
      })
    },
    async getPrice(id1, id2, ct) {
      const data1 = this.$helpers.transformRequest(
        JSON.parse(JSON.stringify({ goodsId: id1 })),
        false
      )
      const data2 = this.$helpers.transformRequest(
        JSON.parse(JSON.stringify({ goodsId: id2 })),
        false
      )
      // if(ct === 1){
        // var url1 = `/web/goods/diamond/detail`;
        // var url2 = `/web/goods/style/detail`;
      // }else{
        var url1 = `/web/goods/style/detail`;
        // var url2 = `/web/goods/diamond/detail`;
      // }
      await this.$axios
        .post(url1, data1)
        .then(data => {
          var res = data.data;
          // console.log(`11111111111111`,res,this.steps.steps )
          this.block1.name = res.goodsName
          this.block1.sku = res.goodsCode
          this.block1.pick = res.goodsImages.split(`,`)[0] || ``
          for (const i in res.details) {
            // console.log(`11111111111111`,res.details[i].coupon)
            if (
              parseInt(this.steps.steps[0].goodsDetailsId) ===
              parseInt(res.details[i].id)
            ) {
              this.block1.oldPrice = res.details[i].retailMallPrice

              if(res.details[i].coupon.hasOwnProperty('discount')){
                this.block1.newPrice = res.details[i].coupon.discount.price;
                this.block1.couponType = 1;
                this.block1.couponNum = res.details[i].coupon.discount.discount;
              }else if(res.details[i].coupon.hasOwnProperty('money')){
                this.block1.newPrice = res.details[i].retailMallPrice;
                this.block1.couponType = 2;
              }else{
                this.block1.newPrice = res.details[i].retailMallPrice;
                this.block1.couponType = 0;
              }
            }
          }
        })
        .catch(err => {
          if (!err.response) {
            this.$message.error(err.message)
          } else {
            // console.log(err)
          }
        })
      await this.$axios
        .post(url1, data2)
        .then(data => {
          var res = data.data;
          // console.log( `2222222222222222222`,res.details[i].coupon)
          this.block2.name = res.goodsName
          this.block2.sku = res.goodsCode
          this.block2.pick = res.goodsImages.split(`,`)[0] || ``
          for (const i in res.details) {
            if (
              parseInt(this.steps.steps[1].goodsDetailsId) ===
              parseInt(res.details[i].id)
            ) {
              this.block2.oldPrice = res.details[i].retailMallPrice

              if(res.details[i].coupon.hasOwnProperty('discount')){
                this.block2.newPrice = res.details[i].coupon.discount.price
                this.block2.couponType = 1;
                this.block2.couponNum =  res.details[i].coupon.discount.discount
              }else if(res.details[i].coupon.hasOwnProperty('money')){
                this.block2.newPrice = res.details[i].retailMallPrice
                this.block2.couponType = 2;
              }else{
                this.block2.newPrice = res.details[i].retailMallPrice;
                this.block2.couponType = 0;
              }
            }
          }
        })
        .catch(err => {
          if (!err.response) {
            this.$message.error(err.message)
          } else {
            // console.log(err)
          }
        })
    },
    async addCart() {
      const timeSock = new Date().getTime()
      const goodInfo = [
        {
          goods_num: 1,
          goodsDetailsId:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[0].goodsDetailsId
              : this.steps.steps[1].goodsDetailsId,
          goods_id:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[0].goodsId
              : this.steps.steps[1].goodsId,
          goods_type:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[0].categoryId
              : this.steps.steps[1].categoryId,
          group_id: timeSock,
          group_type: 2,
          serviceId: 0,
          serviceVal: 'string',

        },
        {
          goods_num: 1,
          goodsDetailsId:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[1].goodsDetailsId
              : this.steps.steps[0].goodsDetailsId,
          goods_id:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[1].goodsId
              : this.steps.steps[0].goodsId,
          goods_type:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[1].categoryId
              : this.steps.steps[0].categoryId,
          group_id: timeSock,
          group_type: 2,
          serviceId: 0,
          serviceVal: 'string'
        }
      ]
      let smoothly = true
      if (this.steps.steps[0].cartId || this.steps.steps[1].cartId) {
        await this.$store
          .dispatch('removeCart', [
            this.steps.steps[0].cartId,
            this.steps.steps[1].cartId
          ])
          .then(data => {
            smoothly = true
          })
          .catch(err => {
            smoothly = false
            if (!err.response) {
              this.$message.error(err.message)
            } else {
              // console.log(err)
            }
          })
      }
      if (!smoothly) return
      await this.$store
        .dispatch('addCart', goodInfo)
        .then(data => {
          this.$message.success(this.$t(`${lang}.addCartSuccess`))
          setTimeout(() => {
            this.$router.push(`/shopping-cart`)
          }, 500)
        })
        .catch(err => {
          if (!err.response) {
            this.$message.error(err.message)
          } else {
            // console.log(err)
          }
        })
    },
    async orderNow() {
      // if(!this.isLogin && this.$store.state.platform == 20){
      //   this.ifShowLoginPop = true
      //   return
      // }
      const timeSock = new Date().getTime()
      const time = this.getTimestampUuid
      let goodInfo = [
        {
          goods_num: 1,
          goodsDetailsId:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[0].goodsDetailsId
              : this.steps.steps[1].goodsDetailsId,
          goods_id:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[0].goodsDetailsId
              : this.steps.steps[1].goodsDetailsId,
          goods_type:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[0].categoryId
              : this.steps.steps[1].categoryId,
          group_id: timeSock,
          group_type: 2,
          serviceId: 0,
          serviceVal: 'string',

        },
        {
          goods_num: 1,
          goodsDetailsId:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[1].goodsDetailsId
              : this.steps.steps[0].goodsDetailsId,
          goods_id:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[1].goodsDetailsId
              : this.steps.steps[0].goodsDetailsId,
          goods_type:
            this.steps.steps[0].ct === 1
              ? this.steps.steps[1].categoryId
              : this.steps.steps[0].categoryId,
          group_id: timeSock,
          group_type: 2,
          serviceId: 0,
          serviceVal: 'string'
        }
      ]

      goodInfo = goodInfo.map(item => {
        item.createTime = time
        item.updateTime = time
        return item
      })

      console.log("goodInfo",goodInfo)
      let smoothly = true
      if (this.steps.steps[0].cartId || this.steps.steps[1].cartId) {
        await this.$store
          .dispatch('removeCart', [
            this.steps.steps[0].cartId,
            this.steps.steps[1].cartId
          ])
          .then(data => {
            smoothly = true
          })
          .catch(err => {
            smoothly = false
            if (!err.response) {
              this.$message.error(err.message)
            } else {
              // console.log(err)
            }
          })
      }
      if (!smoothly) return
      if(this.isLogin){
        await this.$axios({
          method: 'post',
          url: 'web/member/cart/add',
          data: {
              goodsCartList: goodInfo
          }
        })
        .then(data => {
          const dataId = []
          dataId.push(data.data[0].group_id)
          console.log("dddd",data)
          const cartIds = dataId.join(',')
            setTimeout(() => {
            this.$router.push({
              path: `/billing-address`,
              query: { cartIds }
            })
          }, 500)
        })
        .catch(err => {
            // return Promise.reject(err)
        })
      } else {
        const CART = 'cart'
        let goodInfo = [
          {
            goods_num: 1,
            goodsDetailsId:
              this.steps.steps[0].ct === 1
                ? this.steps.steps[0].goodsDetailsId
                : this.steps.steps[1].goodsDetailsId,
            goods_id:
              this.steps.steps[0].ct === 1
                ? this.steps.steps[0].goodsId
                : this.steps.steps[1].goodsId,
            goods_type:
              this.steps.steps[0].ct === 1
                ? this.steps.steps[0].categoryId
                : this.steps.steps[1].categoryId,
            group_id: timeSock,
            group_type: 2,
            serviceId: 0,
            serviceVal: 'string',

          },
          {
            goods_num: 1,
            goodsDetailsId:
              this.steps.steps[0].ct === 1
                ? this.steps.steps[1].goodsDetailsId
                : this.steps.steps[0].goodsDetailsId,
            goods_id:
              this.steps.steps[0].ct === 1
                ? this.steps.steps[1].goodsId
                : this.steps.steps[0].goodsId,
            goods_type:
              this.steps.steps[0].ct === 1
                ? this.steps.steps[1].categoryId
                : this.steps.steps[0].categoryId,
            group_id: timeSock,
            group_type: 2,
            serviceId: 0,
            serviceVal: 'string'
          }
        ]
        const addInfo = {
          id: time,
          createTime: time,
          updateTime: time,
          data: goodInfo
        }
        return new Promise(async (resolve, reject) => {
            try {
                let cart = JSON.parse(localStorage.getItem(CART) || '[]')
                cart = cart.concat(addInfo)
                if (cart.length > 30) {
                    return reject(new Error(lang.cartIsFull))
                }
                const dataId = []
                dataId.push(addInfo.id)
                console.log("dddd",addInfo)
                const cartIds = dataId.join(',')
                this.$router.push({
                  path: `/billing-address`,
                  query: { cartIds }
                })
                // 本地加入购物车数据
                localStorage.setItem(CART, JSON.stringify(cart))
                return resolve()
            } catch (e) {
                return reject(e)
            }
        })
      }
    },
    getIndex(i) {
    	this.magnifying = this.thumbnails[i]
    },
    closeLogin() {
      this.ifShowLoginPop = false
    }
  }
}
</script>

<style lang="less" scoped>
.recommend{
  // margin: 20px 0; 
}
.detail-page {
  margin: 0 auto 100px;
}
.double-box {
  width: 100%;
  height: 400px;
  /*background: pink;*/
  .info-block {
    width: 100%;
    border-bottom: 1px solid #ccc;
    padding-bottom: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left-info-block {
      display: flex;
      align-items: center;
	  width: 320px;
	  overflow: hidden;
      .title-block-name {
        font-size: 18px;
        color: #333;
        margin-bottom: 3px;
      }
      .title-block-sku {
        font-size: 14px;
        color: #999;
        margin-left: 40px;
      }
    }
    img {
      display: block;
      width: 62px;
      height: 62px;
      border: 1px solid #ddd;
      margin-right: 74-62px;
    }
    .product-price {
      font-size: 20px;
      .coin {
        font-size: 20px;
      }
      .price {
        font-size: 20px;
      }
    }

	.product-price.old-price{
		color: #c3c3c3;
		font-size: 14px;
		line-height: 58px;

		.coin {
		  font-size: 14px;
		}
		.price {
		  font-size: 14px;
		}
	}
  }
}

.total-price{
	display: inline-block;
	margin-right: 30px;
}
.old-price-2{
	font-size: 18px;
	color: #c3c3c3;
	text-decoration: line-through;
}
 .original-price{
      color: #999999!important;
    }
</style>
