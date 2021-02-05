<template>
  <div class="madeUp">
    <div class="good-info">
      <div class="mid-box">
        <div class="good-info-line">
          <nuxt-link :to="getJumpLink(g)">
            <div class="good-img" style="border: 2px solie saddlebrowns;">
              <img
                :src="imageStrToArray(g.data[0].simpleGoodsEntity.goodsImages)[0]"
              />
              <div
                v-if="
                  g.data[0].simpleGoodsEntity.goodsStatus !== 2
                "
                class="img-bord"
              >
                <span>{{ $t(`cart.Invalid`) }}</span>
              </div>

              <!-- 折扣 -->
              <div class="list-discount-icon1" v-if="couponType(g.data[0].coupon) == 'discount'">
                <span>{{ language == 'en_US' ? discountUs(g.data[0].coupon.discount.discount)+'%' : discountConversion(g.data[0].coupon.discount.discount)}} {{ $t(`${lang}.discounts2`) }}</span>
              </div>

              <!-- 优惠券 -->
              <div class="list-discount-icon1" v-if="couponType(g.data[0].coupon) == 'money'">
                <span>{{ $t(`${lang}.discounts1`) }}</span>
              </div>
            </div>
          </nuxt-link>

          <nuxt-link :to="getJumpLink(g)" class="good-desc-wrap">
            <div class="good-desc">
              <div>
                {{ g.data[0].simpleGoodsEntity.goodsName }}
              </div>
              <div>
                SKU：{{
                  g.data[0].simpleGoodsEntity.simpleGoodsDetails.goodsDetailsCode
                }}
              </div>
            </div>
          </nuxt-link>

          <div class="good-information">
            <div
              v-for="(s, k) in g.data[0].simpleGoodsEntity.detailConfig"
              :key="k"
              class="infos"
            >
              <div>{{ s.configVal }}</div>
              <div>{{ s.configAttrIVal }}</div>
            </div>
          </div>
          <div class="good-num">{{ g.data[0].goodsCount }}</div>

          <!-- 原金额 -->
          <div class="good-price" :class="{'old-price': couponType(g.data[0].coupon) == 'discount'}">
            {{ formatCoin(g.coinType) }}
            {{
              formatNumber(
                g.data[0].simpleGoodsEntity.simpleGoodsDetails.retailMallPrice
              )
            }}
          </div>

		      <!-- 优惠后金额 -->
          <div class="now-price">
            <span v-if="couponType(g.data[0].coupon) == 'discount'">
              {{ formatCoin(g.coinType) }}
              {{
                formatNumber(
                  g.data[0].coupon.discount.price
                )
              }}
            </span>
            <span  v-if="couponType(g.data[0].coupon) !== 'discount'">
              {{ formatCoin(g.coinType) }}
              {{
                formatNumber(
                  g.data[0].simpleGoodsEntity.simpleGoodsDetails.retailMallPrice
                )
              }}
            </span>
          </div>
        </div>
        <div class="good-info-dotted" />
        <div class="good-info-line">
          <nuxt-link :to="getJumpLink(g)">
            <div class="good-img">
              <img
                :src="imageStrToArray(g.data[1].simpleGoodsEntity.goodsImages)[0]"
                alt=""
              />
              <div
                v-if="g.data[1].simpleGoodsEntity.goodsStatus !== 2
                "
                class="img-bord"
              >
                <span>{{ $t(`cart.Invalid`) }}</span>
              </div>

              <!-- 折扣 -->
              <div class="list-discount-icon1" v-if="couponType(g.data[1].coupon) == 'discount'">
                <span>{{ language == 'en_US' ? discountUs(g.data[1].coupon.discount.discount)+'%' : discountConversion(g.data[1].coupon.discount.discount)}} {{ $t(`${lang}.discounts2`) }}</span>
              </div>

              <!-- 优惠券 -->
              <div class="list-discount-icon1" v-if="couponType(g.data[1].coupon) == 'money'">
                <span>{{ $t(`${lang}.discounts1`) }}</span>
              </div>
            </div>
          </nuxt-link>

          <nuxt-link :to="getJumpLink(g)" class="good-desc-wrap">
            <div class="good-desc">
              <div>
                {{ g.data[1].simpleGoodsEntity.goodsName }}
              </div>
              <div>
                SKU：{{
                  g.data[1].simpleGoodsEntity.simpleGoodsDetails.goodsDetailsCode
                }}
              </div>
            </div>
          </nuxt-link>

          <div class="good-information">
            <div>
              <div
                v-for="(s, k) in g.data[1].simpleGoodsEntity.detailConfig"
                :key="k"
                class="infos"
              >
                <div>{{ s.configVal }}</div>
                <div>{{ s.configAttrIVal }}</div>
              </div>
              <!-- 色彩 -->
              <div class="infos" v-for="(i, k) in g.data[0].goodsAttr" :key="'color='+k">
                <div>{{ i.configVal }}</div>
                <div>{{ i.configAttrIVal }}</div>
              </div>

              <div class="goods-attr" v-if="type=='madeUpB' && selectIndex==index && showAttr">
                <div class="triangle">
                  <span></span>
                  <span></span>
                </div>

                <div class="attrs">
                  <div class="attrs-content">
                    <!-- 主石大小 -->
                    <div v-if="caratsB.length" class="attr-list clf">
                      <div class="attr texture fl">{{ caratsText }}</div>
                      <div class="val fl clf">
                        <div class="val-child fl" :class="{'active': index == madeUpSelectedB.caratIndex}" v-for="(item, index) in caratsB" :key="index" @click="chooseAttr('carats', index)">{{ item.name }}</div>
                      </div>
                    </div>
                    <!-- 成色 -->
                    <div v-if="materialsB.length" class="attr-list clf">
                      <div class="attr texture fl">{{ materialsText }}</div>
                      <div class="val fl clf">
                        <div class="val-child fl" :class="{'active': index == madeUpSelectedB.materialIndex}" v-for="(item, index) in materialsB" :key="index" @click="chooseAttr('materials', index)">{{ item.name }}</div>
                      </div>
                    </div>
                    <!-- 尺寸 -->
                    <div v-if="sizesB.length" class="attr-list site clf">
                      <div class="attr fl">{{ sizesText }}</div>
                      <div class="val fl clf">
                        <div class="val-child fl" :class="{'active': index == madeUpSelectedB.sizeIndex}" v-for="(item, index) in sizesB" :key="index" @click="chooseAttr('size', index)">{{ item.name }}</div>
                      </div>
                    </div>
                    <!-- 主石色彩 -->
                    <div v-if="colorDetailB.length" class="attr-list color clf">
                      <div class="attr fl">{{ colorText }}</div>
                      <div class="val fl clf">
                        <div class="val-child fl" :class="{'active': index == madeUpSelectedB.colorIndex}" v-for="(item, index) in colorDetailB" :key="index" @click="chooseAttr('color', index)">{{ item.name }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="attrs-btn clf">
                    <div class="price fl">
                      <span class="currency">{{ formatCoin(coin) }}</span>
                      <span class="num">{{ formatNumber(price) }}</span>
                    </div>
                    <div class="btns fr clf">
                      <div class="btn fl" @click="cancelAdjustAttr($event)">{{ $t(`${lang}.cancle`) }}</div>
                      <div class="btn fl" @click="confirmAttr()">{{ $t(`${lang}.confirm`) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <span v-if="ifShowEditBtn" class="edit" @click="editAttr('madeUpB')"></span>
          </div>

          <div class="good-num">{{ g.data[1].goodsCount }}</div>

          <!-- 原金额 -->
          <div class="good-price" :class="{'old-price': couponType(g.data[1].coupon) == 'discount'}">
            {{formatCoin(g.coinType) }}
            {{
              formatNumber(
                g.data[1].simpleGoodsEntity.simpleGoodsDetails.retailMallPrice
              )
            }}
          </div>

          <!-- 优惠后金额 -->
         <div class="now-price">
            <span v-if="couponType(g.data[1].coupon) == 'discount'">
              {{ formatCoin(g.coinType) }}
              {{
                formatNumber(
                  g.data[1].coupon.discount.price
                )
              }}
            </span>
            <span  v-if="couponType(g.data[1].coupon) !== 'discount'">
              {{formatCoin(g.coinType) }}
              {{
                formatNumber(
                  g.data[1].simpleGoodsEntity.simpleGoodsDetails.retailMallPrice
                )
              }}
            </span>
          </div>
        </div>
      </div>

      <div class="btn-box">
        <div
          v-if="
            g.data[0].simpleGoodsEntity.goodsStatus === 2 &&
              g.data[1].simpleGoodsEntity.goodsStatus === 2
          "
          class="good-btn"
        >
          <i class="iconfont iconlajitong" @click="deleteGood()" />
        </div>
        <div v-else class="lose-btn">
          <div @click="searchSimilar()">
            {{ $t(`cart.searchSimilar`) }}
          </div>
        </div>
      </div>
      <div class="good-dingzhi-logo">
        <i class="iconfont iconstar-jt" />
        <!-- <span>{{ word }}</span> -->
      </div>
    </div>
  </div>
</template>

<script>
const lang = 'cart'
import GoodCart from '@/mixins/good-cart.js'
export default {
  data() {
    return{
      lang,
      productDataA: {},
      productDataB: {},
      madeUpSelectedA: {
        materialIndex: -1,
        caratIndex: -1,
        sizeIndex: -1,
        colorIndex: -1,
      },
      madeUpSelectedB: {
        materialIndex: -1,
        caratIndex: -1,
        sizeIndex: -1,
        colorIndex: -1,
      },
      madeUpColorAttrs: [
        {
          config_id:'',
          config_attr_id:''
        }
      ],
      diamondPrice: 0,
      diamondGoodInfo: {
        goodsDetailsId: '',
        goods_id: '',
        goods_type: '',
      }
    }
  },
  name: 'MadeUp',
  mixins: [GoodCart],
  computed: {
    // 成色
    materialsB() {
      if(this.productDataB.materials){
        return this.productDataB.materials
      }else{
        return []
      }
    },
    // 主石大小
    caratsB() {
      if(this.productDataB.carats){
        return this.productDataB.carats
      }else{
        return []
      }
    },
    // 尺寸
    sizesB() {
      if(this.productDataB.sizes){
        return this.productDataB.sizes
      }else{
        return []
      }
    },
    //色彩  start
    colorDetailB(){
      const Spec = this.productDataB.specs

      let colors = []
      let colorSpec = ''
      let colorId = ''
      // let configId = ''
      if(Spec){
        Spec.forEach(item => {
          if (item.configId === '63') {
            colorSpec = item.configAttrVal
            colorId = item.configAttrId
            this.configId = item.configId
          }
          if((colorId && colorSpec)!== ""){
            let ids = colorId.split("|")
            let specs = colorSpec.split("|")
            if((ids && specs) !== ''){
              colors = ids.map((id,i) => ({
                id, 
                name: specs[i]
              }));
            }
          }
        })
        return colors
      }else{
        return []
      }
    },
    madeUpDetailB() {
      const _this = this
      const productDataB = _this.productDataB
      const details = productDataB.details

      const material =
        productDataB.materials.length > 0 &&
        productDataB.materials[this.madeUpSelectedB.materialIndex]
          ? productDataB.materials[this.madeUpSelectedB.materialIndex].id
          : null
      const size =
        productDataB.sizes.length > 0 &&
        productDataB.sizes[this.madeUpSelectedB.sizeIndex]
          ? productDataB.sizes[this.madeUpSelectedB.sizeIndex].id
          : null
      const carat =
        productDataB.carats.length > 0 &&
        productDataB.carats[this.madeUpSelectedB.caratIndex]
          ? productDataB.carats[this.madeUpSelectedB.caratIndex].id
          : null

      let result = null

      for (let n = 0, length = details.length; n < length; n++) {
        const item = details[n]
        if (item.material === material && item.size === size && item.carat === carat) {
          result = item
          break
        }
      }

      return result
    }
  },
  methods: {
    deleteGood() {
      let _this = this;
      const data = [this.g.id]
      this.$store
        .dispatch(`removeCart`, data)
        .then(data => {
          _this.$successMessage(this.$t(`cart.deleteSuccess`))
          _this.$emit(`bottomData`)
          _this.$emit(`reloadList`)
        })
        .catch(err => {
          if (!err.response) {
            this.$message.error(err.message)
          } else {
            // console.log(err)
          }
        })
    }
  }
}
</script>

<style scoped lang="less">
.madeUp {
  width: calc(100% - 49px);
  .good-info {
    position: relative;
    display: flex;
    height: 360px;
    border-bottom: 1px solid rgba(239, 239, 239, 1);
    .good-info-dotted {
      position: absolute;
      left: 142px;
      top: 180px;
      width: 956px;
      height: 1px;
      padding-left: 20px;
      border-bottom: 1px dotted rgba(221, 221, 221, 1);
    }
    .good-info-line {
      height: 180px;
      display: flex;
      align-items: center;
      .good-img {
        position: relative;
        width: 120px;
        height: 120px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(221, 221, 221, 1);
        border-radius: 2px;
        display: flex;
        align-items: center;
        margin-right: 20px;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .good-desc-wrap{
        width: calc((100% - 140px) * 0.32);
        padding-right: 20px;
        box-sizing: border-box;

        .good-desc {
          line-height: 18px;
          div:nth-child(1) {
            max-height: 18 * 3px;
            margin-bottom: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            /*word-break: break-all;*/
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          div:nth-child(2) {
            color: #999;
          }
        }
      }
      .good-information {
        position: relative;
        width: calc((100% - 140px) * 0.3);
        padding-right: 20px;
        box-sizing: border-box;
        display: flex;
        height: 100%;
        align-items: center;
        
        &>div{
          position: relative;
          width: 100%;

          .infos {
            width: 100%;
            display: flex;
            margin-bottom: 10px;
            div:nth-child(1) {
              width: 50%;
              color: #666;
            }
            div:nth-child(2) {
              width: 50%;
              color: #111;
            }
          }
        }
      }
      .good-description {
        width: calc((100% - 140px) * 0.35);
        padding-right: 20px;
        box-sizing: border-box;
        line-height: 20px;
        height: 60px;
        color: #666;
       
        position:relative;

        .overflow-box{
          height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          word-break: break-all;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
      .good-num {
        width: calc((100% - 140px) * 0.1);
        text-align: center;
        font-size: 18px;
        color: #333;
        padding: 0 10px;
        box-sizing: border-box;
      }
      .good-price {
        width: calc((100% - 140px) * 0.14);
        font-family: twCenMt;
        font-size: 18px;
        color: #99999991;
        text-align: center;
        padding: 0 10px;
        box-sizing: border-box;
      }
      .now-price{
        width: calc((100% - 140px) * 0.14);
        font-family: twCenMt;
        font-size: 18px;
        color: #f29b87;
        text-align: center;
        padding: 0 10px;
        box-sizing: border-box;
      }
    }
    .good-btn {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      i {
        display: block;
        height: 21px;
        line-height: 21px;
        color: #999999;
        font-size: 20px;
        cursor: pointer;
        margin: 0 auto;
      }
    }
  }
  .good-dingzhi-logo {
    position: absolute;
    width: 200px;
    height: 24px;
    left: 24px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    span {
      color: #999;
      font-size: 14px;
      line-height: 14px;
    }
    i {
      display: block;
      color: #aaa;
    }
  }

  .cart-radio {
    position: relative;
    .free-check {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 16px;
      height: 16px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(187, 187, 187, 1);
      border-radius: 4px;
      cursor: pointer;
    }
    .icongou {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      display: block;
      width: 16px;
      height: 16px;
      background: rgba(170, 138, 123, 1);
      border-radius: 2px;
      color: #fff;
      font-size: 16px;
      line-height: 16px;
      cursor: pointer;
    }
  }
  .img-bord {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #fff;
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    background-color: rgba(102, 102, 102, 0.4);
  }
  .lose-btn {
    width: 100px;
    height: 21px;
    line-height: 21px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;

    div:nth-child(1) {
      /*width: 43px;*/
      height: 15px;
      line-height: 15px;
      font-size: 14px;
      color: #aa8a7b;
      cursor: pointer;
    }
    div:nth-child(2) {
      width: 1px;
      height: 21px;
      background-color: rgba(166, 166, 166, 1);
    }
    i {
      display: block;
      width: 18px;
      height: 21px;
      line-height: 21px;
      color: #999999;
      font-size: 20px;
      cursor: pointer;
    }
  }
}

.mid-box{
  width: 100%;
}

.btn-box{
  width: calc((100% - 140px) * 0.14);
  display: flex;
  align-items: center;
}

.action .goods-attr{
  display: block !important;
}
</style>
