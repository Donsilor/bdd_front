<template>
  <div class="engagementRings-component">
    <div v-if="this.goodInfo.totalStock > 0">
      <div class="swiper-box">
        <swiper1 :auto="false" :duration="5000">
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

        <div v-if="goodInfo.goodsMod === 1" class="include-box">
          <span>{{ lang.include }}</span>
          <div>
            <i class="iconfont iconstar-jt" />
          </div>
          <span>+</span>
          <div>
            <i class="iconfont iconicon-zuanshi" />
          </div>
        </div>
        
        <div class="select-box" @click="showAttr = true">
          <div class="select-line" v-if="goodInfo.carats">
            <span>{{ lang.goodsCarat }}：</span>
            <span>{{ chooseCarats }}</span>
          </div>
          <!-- <div class="bd-b" v-if="goodInfo.carats"></div> -->
          <div class="select-line">
            <span>{{ lang.goodsMaterial }}：</span>
            <span>{{ chooseMaterials }}</span>
          </div>
          <!-- <div class="bd-b"></div> -->
          <div class="select-line">
            <span>
              <span>{{ lang.goodsSize }}（{{ lang['us-version'] }}）</span>
              <div @click="openSize()">!</div>：
            </span>
            <span>{{ chooseSize ? chooseSize : lang.stArrContent }}</span>
          </div>

          <!-- 色彩 start -->
          <!-- <div class="bd-b" v-if="goodInfo.colors.length > 0"></div> -->
          <div class="select-line" v-if="goodInfo.colors.length > 0">
            <span>{{ lang.goodsColor }}：</span>
            <span>{{ chooseColors }}</span>
          </div>
          <!-- 色彩 end -->

          <i class="iconfont iconyou"></i>
        </div>

        <!-- 刻字效果 start -->
        <div class="seal">
          <div class="bd-b"></div>
          <div  class="buycort_Lettering">
            <span  class="txt">{{lang.Seal}}</span>
            <input id="input" v-model="text"  type="text" :placeholder="lang.placeHold" >
          </div>
          <!-- <div class="prompt" v-show="prompt">
            <span>{{ lang.prompt }}</span>
          </div> -->
          <div class="preview-btn">
            <em  class="em1" v-for="(a,index) in content" :key="index" @click="choose('input',a)">{{a}}</em>
            <i class="looktokz" @click="Preview">{{lang.Preview}}</i>
            <!-- <i class="looktokz" @click="ConfirmLetter">{{lang.confirm}}</i> -->
          </div>
          <div v-show="showPop" class="pop">
            <div class="ms-overlay" @click="cancelPop($event)" style="z-index: 2003;"></div>
            <div class="ms-popup ms-popup--center" style="width: 100%; z-index: 2004;">
              <div class="close" @click="CloseSealBox">
                <i class="el-icon-close"></i>
              </div>
              <div  class="buy_kzyl">
                <img  src="../../static/icon/seal.png">
                <span >{{msg}}</span>
                <p class="tips">{{ lang.tip}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 刻字效果 end -->

        <div
          v-if="goodInfo.goodsMod === 1 && inSale && canAddCart"
          class="custom-made-word"
        >
          {{ lang['cmw'] }}
          <div class="triangle" />
        </div>
        <div
          v-if="goodInfo.goodsMod === 1 && inSale && canAddCart"
          class="btn-common btn-pink"
          @click="startCustomMade"
        >
          {{ lang.startDJ }}
        </div>
        <div
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
        </div>
        <div v-else>
          <div v-if="img">
          <div class="box">
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

          <div
            v-show="img"
            :class="['btn-common', inSale && canAddCart ? 'btn-pink' : 'btn-gray']"
            @click="VRTryOn"
          >
            {{
              inSale
                ? canAddCart
                  ? lang.vr
                  : lang.noTotalStock
                : lang.notInSale
            }}
          </div>
        </div>
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

          <div
            v-show="img"
            :class="['btn-common', inSale && canAddCart ? 'btn-pink' : 'btn-gray']"
            @click="VRTryOn"
          >
            {{
              inSale
                ? canAddCart
                  ? lang.vr
                  : lang.noTotalStock
                : lang.notInSale
            }}
          </div>
        </div>
          
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
          <div v-if="index < detailNum" v-for="(b, index) in goodInfo.specs" :key="index">
            <span>{{ b.configName }}</span>
            <span>{{ b.configAttrVal }}</span>
          </div>

          <div v-if="specsLength" :class="['icon',{'reverse': ifShowMore}]" @click="showMore"></div>
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
        :title="lang.carat"
        :list="goodInfo.carats"
        @clear="getCarats"
      ></swiper-tap>

      <swiper-tap
        ref="suitability"
        :title="lang.size"
        :list="goodInfo.sizes"
        @clear="getSortBy"
      ></swiper-tap>

      <swiper-tap
        ref="colorsSuitability"
        :title="lang.shade"
        :list="goodInfo.colors"
        @clear="getColors"
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
      
      <!-- 获取优惠券 -->
      <get-coupon v-if="ifShowCoupon" @closeCoupon="closeCo()" :moneyInfo="this.goodInfo.coupon.money"></get-coupon>

      <!-- VR试戴 -->
      <vr-tryOn v-show="ifShowVR" @closeVR="closeV()"  :goodName="this.goodInfo.goodsName" :showImg="img"></vr-tryOn>
      <login-pop v-if="ifShowPop" @closePop="closePop"></login-pop>

      <!-- 商品属性 -->
      <goods-attr v-if="showAttr" :info="goodInfo" :attrIndex="attrIndex" @close="showAttr=false" @changeAttr="changeAttr"></goods-attr>
    </div>
    <div v-else>
      <soleOut></soleOut>
    </div>
  </div>
</template>

<script>
import Mx from './single-mixin'
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
    return {
      ifShowCoupon: false,
      language: this.$store.state.language,
      activeTime:'',
      ifShowVR: false,
      // baseUrl:''
      // baseUrl:this.$store.getters.baseUrl
      ifShowMore: false,
      detailNum: 4,
      ifShowPop: false,
      content:['♥','&',this.LANGUAGE.detailCommons.Whitespace],
      text:'',
      Mark:'',
      showSealBox:false,
      centerDialogVisible: false,
      msg:'',
      border:false,
      maxlength:0,
      showPop:false,
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
  computed: {
    canAddCart() {
      // console.log("canAddCart",this.goodInfo.colors)
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
    img(){
      return this.goodInfo.arImage
    },
    specsLength() {
      if(this.goodInfo && this.goodInfo.specs && this.goodInfo.specs.length > 4){
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
      // console.log("notelist",this.notes)
      return this.notes.slice(0,5)
    },
    engravingContent(){
      this.msg = this.text.replace(/\(\A space\)|\(\空一格\)/g, '\xa0');
      return this.msg
    }
    // baseUrl(){
    //   return this.$store.getters.baseUrl
    // }
  },
  watch: {
    // 监听相同路由下参数变化的时候，从而实现异步刷新
    '$route'(to,from) {
      window.location.reload();
    }
  },
  mounted() {
    // 禁止页面手指触屏放大
    document.documentElement.addEventListener('touchmove', function(event) {
    if (event.touches.length > 1) {
    event.preventDefault();
    }
    }, false);

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
      // console.log("info",info.categoryId)
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
      // console.log("info",routerName,query)
      return{
        name: routerName,
        query: query
      }
    },
    // 点击弹窗以外页面关闭弹窗
    cancelPop(event) {
      let tp = document.querySelector(".ms-popup");
      if (tp) {
        if (!tp.contains(event.target)) {
          this.showPop = false
        }
      }
    },
    // 点击关闭按钮关闭弹窗
    CloseSealBox(){
      this.showPop = false
    },
    // 选择字母
    choose(id,val){
      if(val == '空格'||val == 'Space'){
        val =this.LANGUAGE.detailCommons.EmptySpace
      }
      var elInput =document.getElementById(id);
      var startPos = elInput.selectionStart;
      var endPos = elInput.selectionEnd;
      if(startPos ===undefined|| endPos ===undefined)return 
      var txt = elInput.value;
      var result = txt.substring(0, startPos) + val + txt.substring(endPos)    
      elInput.value = result;    
      elInput.focus();  
      this.$nextTick(() => {
        elInput.selectionStart = startPos + val.length;    
        elInput.selectionEnd = startPos + val.length;
      })
      this.text = result
    },
    // 点击预览刻字效果
    Preview(){
      this.msg = this.text.replace(/\(\A space\)|\(\空一格\)/g, '\xa0'); 
      this.showPop =true
      // this.centerDialogVisible = true
    },
    ConfirmLetter(){
      var str = this.text.replace(/\(\A space\)|\(\空一格\)/g, '\xa0');
      let regEn = /.*[\u4e00-\u9fa5]+.*$/;
      this.prompt  = false
      if(regEn.test(str)){
        if(str.length>5){
          this.prompt = true
          return
          // this.maxlength = 5 
        }
      }else {
        if(str.length>10){
          this.prompt = true
          return
          // this.maxlength = 10 
        }
        
      }
      // console.log("this.maxlength",this.prompt)
      if(this.prompt  == true){
        return
      }
      this.showSealBox = false 
      this.substance = this.text
      this.ShowContent = true
    },
    closeCo() {
      this.ifShowCoupon = false
    },
    // 关闭VR弹窗
    closeV() {
      this.ifShowVR = false
    },
    // 获取优惠券
    getCoupon() {
      if(!this.$store.getters.hadLogin) {
        this.ifShowPop = true
      }else{
        this.ifShowCoupon = true
      }
    },
    VRTryOn(){
      this.ifShowVR = true
    },
    showMore(){
      this.ifShowMore = !this.ifShowMore
      this.detailNum = this.detailNum == 4 ? 100 : 4
    },
    closePop() {
      this.ifShowPop = false
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

      if(this.goodInfo.hasOwnProperty('colors') && Array.isArray(this.goodInfo.colors) && this.goodInfo.colors.length){
        this.chooseColors = this.goodInfo.colors[select.colorsIndex].content
        this.chooseColorId = this.goodInfo.colors[select.colorsIndex].sortBy
      }

      this.colorAttrs[0].config_id = this.colorDetail
      this.colorAttrs[0].config_attr_id = this.chooseColorId

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
.seal{
  margin-bottom: 10px;
  .buycort_Lettering {
    // display: flex;
    // justify-content: space-between;
    // margin: 0 10px;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    width: 346px;
    padding: 10px 0;
    position: relative;
    background: #fff;
    .txt {
      // width: 70px;
      display: inline-block;
      margin-right: 5px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #947465;
      font-size: 14px;
      border-radius: 5px;
      vertical-align: middle;
    }
    input {
        width: 150px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-size: 12px;
        border: 0;
    }
  }
  .prompt{
    position: absolute;
    left: 10px;
    top:5px;
    text-align: left;
    font-size: 12px;
    padding: 5px 0;
    color:red;
  }
  .preview-btn{
    margin-left: auto;
    margin-right: auto;
    width: 346px;
    text-align: right;
    .em1:nth-of-type(2) {
      margin: 0 3px;
    }
    em {
      width:40px;
      padding:0px 2px;
      height: 30px;
      line-height: 30px; 
      text-align: center;
      color: #000;
      font-size: 12px;
      background-color: #ebecee;
      font-style: normal;
      display: inline-block;
      vertical-align: middle;
    }
    i{
      // width: 30px;
      // height: 20px;
      // line-height: 20px; 
      height: 16px;
      padding: 5px 8px;
      text-align: center;
      color: #333;
      font-size: 12px;
      font-style: normal;
      border:1px solid #000;
      border-radius: 3px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .ms_sametc{
    position: static;
    margin: 0 auto;
    img{
      width: 100%;
    }
  }
  .ms-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
  }
  .ms-popup--center {
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(-50%,-50%,0);
    transform: translate3d(-50%,-50%,0);
    position: relative;
    .close{
      position: absolute;
      right:10px;
      top:10px;
      text-align: right ;
      margin-bottom: 5px;
      cursor: pointer;
      font-size: 16px;
      z-index: 20;
    }
  }
  .ms-popup {
    position: fixed;
    max-height: 100%;
    overflow-y: auto;
    background-color: #fff;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s,-webkit-transform .3s;
    -webkit-overflow-scrolling: touch;
  }
  .buy_kzyl {
    position: relative;
    z-index: 11;
    text-align: center;
    overflow: hidden;
    img {
      width: 100%;
    }
    span {
      color: #b1b2b5;
      font-size: 12px;
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 59.5%;
      display: inline-block;
      height: 31px;
      line-height: 30px;
    }
    .tips{
      color: #606266;
      font-size: 12px;
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 12.5%;
    }
  }
 
}
.box{
  display: flex;
  margin: 0 15px;
  .btn-common{
    width: 49%!important;
  }
}
.engagementRings-component {
  .details-component(100%);
  .btn-white{
    border:none!important;
  }
  .btn-black{
    background: #303030;
  }
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
