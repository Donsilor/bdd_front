<template>
  <div class="orderlist">
    <ul v-if="!paytips" class="content">
      <li v-for="(order, index) in showOrderList" :key="index" class="item">
        <div class="top">
          <span>{{ lang.orderNumber }}：</span>
          <span v-if="order.orderStatus !== 0 && order.refundStatus == 0 && order.wireTransferStatus !== null" class="order-status">
            <span class="order-status" v-if="order.orderStatus == 40">{{ statusText(order.orderStatus) }}</span>
            <span class="order-status" v-else>{{ getTransferStatus(order.wireTransferStatus) }}</span>
          </span>
          <span v-else-if="order.refundStatus == 1" class="order-status">{{ refundStatusText(order.refundStatus) }}</span>
          <span v-else class="order-status">{{ statusText(order.orderStatus) }}</span>
          <!-- <span v-if="order.wireTransferStatus === null && order.refundStatus == 0" class="order-status">{{ statusText(order.orderStatus) }}</span>
          <span v-else-if="order.refundStatus == 1" class="order-status">{{ refundStatusText(order.refundStatus) }}</span>
          <span v-else-if="order.orderStatus !== 0" class="order-status">{{ getTransferStatus(order.wireTransferStatus) }}</span> -->
          <!-- <div v-else>
            <span v-if="order.wireTransferStatus == '0' && order.orderStatus == '10'" class="order-status">{{ lang.pending }}</span>
            <span v-else-if="order.wireTransferStatus == '1' && order.orderStatus == '20'" class="order-status">{{ lang.paid }}</span>
            <span v-else-if="order.wireTransferStatus == '1' && order.orderStatus == '30'" class="order-status">{{ lang.paid }}</span>
            <span v-else-if="order.wireTransferStatus == '10' && order.orderStatus == '0'" class="order-status">{{ lang.payfailed }}</span>
          </div> -->
        </div>
        <div class="top">
          <span>{{ order.orderNO }}</span>
        </div>
        <div v-for="(detail, n) in order.details" :key="n">
          <!-- 单品 -->
          <div v-if="detail.groupType == 0 && detail.data[0].categoryId !== 19" class="mod single" @click="toDetail(order.id)">
            <ul>
              <li >
                <div class="left-box">
                  <img :src="detail.image" />

                  <!-- <div class="activity-sign" v-if="detail.coupon.discount || detail.coupon.money"> -->
                    <!-- <div class="triangle" v-if="detail.coupon.discount">{{discountConversion(detail.coupon.discount.discount)}}折</div> -->
                    <!-- <div class="triangle" v-if="detail.coupon.money">优惠券</div> -->
                  <!-- </div> -->
                </div>

                <div v-if="detail.groupType !== 0" class="group-type">
                  {{ detail.groupTypeText }}
                </div>

                <!--              单品-->
                <div v-if="detail.groupType === 0" class="right">
                  <h4 class="ow-h2">
                    {{ detail.goodsName }}
                  </h4>
                  <span>x 1</span>
                  <p>SKU：{{ detail.data[0].goodsCode }}</p>
                  <p>{{ getconfig(detail.data[0].detailSpecs,detail.data[0].goodsAttr,detail.data[0].lettering) }}</p> 
                  <div v-if="detail.data[0].couponInfo.type === 2">
                    <div class="old-price" >{{ formatCoin(order.coinCode) }} {{ detail.data[0].goodsPrice}}</div>
                    <b>{{ formatCoin(order.coinCode) }} {{ detail.data[0].goodsPayPrice}}</b>
                  </div>
                  <b v-else>{{ formatCoin(order.coinCode) }} {{ detail.data[0].goodsPrice}}</b>
                </div>

                <!--              对戒-->
                <!-- <div v-if="detail.groupType === 1" class="right">
                  <h4 class="ow-h2">
                    {{ detail.goodsName }}
                  </h4>
                  <span>x 1</span>
                  <p>SKU：{{ detail.data[0].goodsCode }}</p>
                  <p>{{ detail.data[0].detailSpecs }}</p>
                  <div class="old-price" v-if="detail.data[0].couponInfo.type === 2">{{ order.coinCode }} {{ detail.data[0].goodsPrice}}</div>
                  <b class="display-block margin-bottom-20"
                    >{{ order.coinCode }} {{ detail.data[0].goodsPayPrice }}</b
                  >
                  <p>SKU：{{ detail.data[1] && detail.data[1].goodsCode }}</p>
                  <p>{{ detail.data[1] && detail.data[1].detailSpecs }}</p>
                  <div class="old-price" v-if="detail.data[0].couponInfo.type === 2">{{ order.coinCode }} {{ detail.data[0].goodsPrice}}</div>
                  <b
                    >{{ formatCoin(order.coinCode) }}
                    {{ detail.data[1] && detail.data[1].goodsPrice }}</b
                  >
                </div> -->

                <!--              定制-->
                <!-- <div v-if="detail.groupType === 2" class="right">
                  <h4 class="order-ellipsis ow-h2">
                    {{ detail.data[0] && detail.data[0].goodsName }}
                  </h4>
                  <span>x 1</span>
                  <p>SKU：{{ detail.data[0].goodsCode }}</p>
                  <p>{{ detail.data[0].detailSpecs }}</p>
                  <b class="display-block margin-bottom-20"
                    >{{ order.coinCode }} {{ detail.data[0].goodsPrice }}</b
                  >
                  <h4 class="order-ellipsis ow-h2">
                    {{ detail.data[1] && detail.data[1].goodsName }}
                  </h4>
                  <p>SKU：{{ detail.data[1] && detail.data[1].goodsCode }}</p>
                  <p>{{ detail.data[1] && detail.data[1].detailSpecs }}</p>
                  <b
                    >{{ order.coinCode }}
                    {{ detail.data[1] && detail.data[1].goodsPayPrice }}</b
                  >
                </div> -->
              </li>
            </ul>
          </div>
          <!-- 对戒 -->
          <div v-if="detail.data[0].categoryId == 19" class="mod double" @click="toDetail(order.id)">
            <ul>
              <li>
                <div class="left-box">
                  <img :src="detail.image" />

                  <!-- <div class="activity-sign" v-if="detail.coupon.discount || detail.coupon.money"> -->
                    <!-- <div class="triangle" v-if="detail.coupon.discount">{{discountConversion(detail.coupon.discount.discount)}}折</div> -->
                    <!-- <div class="triangle" v-if="detail.coupon.money">优惠券</div> -->
                  <!-- </div> -->
                </div>
                <div v-if="detail.groupType !== 0" class="group-type">
                  {{ detail.groupTypeText }}
                </div>

                <!--              单品-->
                <!-- <div v-if="detail.groupType === 0" class="right">
                  <h4 class="ow-h2">
                    {{ detail.goodsName }}
                  </h4>
                  <span>x 1</span>
                  <p>SKU：{{ detail.data[0].goodsCode }}</p>
                  <p>{{ detail.data[0].detailSpecs }}</p>
                  <b>{{ order.coinCode }} {{ detail.data[0].goodsPrice}}</b>
                </div> -->

                <!--              对戒-->
                <div v-if="detail.data[0].categoryId === 19" class="right">
                  <div v-for="(ring, _n) in detail.data[0].ring" :key="_n" class="dec">
                    <h4 class="ow-h2">
                      {{ detail.goodsName }}
                    </h4>
                    <!-- <span>x 1</span> -->
                    <p class="sku">SKU：{{ detail.data[0].goodsCode }}</p>
                    <p>{{ getDubleConfig(ring.lang.goods_spec,ring.lang.goods_attr[26].value,ring,detail.data[0].goodsAttr) }}</p>
                    <!-- <b class="display-block margin-bottom-20"
                      >{{ order.coinCode }} {{ detail.data[0].goodsPrice }}</b
                    > -->
                    <!-- <p>SKU：{{ detail.data[1] && detail.data[1].goodsCode }}</p>
                    <p>{{ detail.data[1] && detail.data[1].detailSpecs }}</p>
                    <b
                      >{{ order.coinCode }}
                      {{ detail.data[1] && detail.data[1].goodsPrice }}</b
                    > -->
                  </div>
                </div>
                <div class="price">
                  <!-- <b class="display-block">{{ formatCoin(order.coinCode) }} {{ detail.data[0].goodsPrice }}</b> -->
                  <div v-if="detail.data[0].couponInfo.type === 2">
                    <div class="old-price" >{{ formatCoin(order.coinCode) }} {{ detail.data[0].goodsPrice}}</div>
                    <b>{{ formatCoin(order.coinCode) }} {{ detail.data[0].goodsPayPrice}}</b>
                  </div>
                  <b v-else class="display-block">{{ formatCoin(order.coinCode) }} {{ detail.data[0].goodsPrice }}</b>
                </div>
                <div class="num">
                  <span>x 1</span>
                </div>
                <!--              定制-->
                <!-- <div v-if="detail.groupType === 2" class="right">
                  <h4 class="order-ellipsis ow-h2">
                    {{ detail.data[0] && detail.data[0].goodsName }}
                  </h4>
                  <span>x 1</span>
                  <p>SKU：{{ detail.data[0].goodsCode }}</p>
                  <p>{{ detail.data[0].detailSpecs }}</p>
                  <div class="old-price" v-if="detail.data[0].couponInfo.type === 2">{{ order.coinCode }} {{ detail.data[0].goodsPrice}}</div>
                  <b class="display-block margin-bottom-20"
                    >{{ order.coinCode }} {{ detail.data[0].goodsPayPrice }}</b
                  >
                  <h4 class="order-ellipsis ow-h2">
                    {{ detail.data[1] && detail.data[1].goodsName }}
                  </h4>
                  <p>SKU：{{ detail.data[1] && detail.data[1].goodsCode }}</p>
                  <p>{{ detail.data[1] && detail.data[1].detailSpecs }}</p>
                  <div class="old-price" v-if="detail.data[0].couponInfo.type === 2">{{ order.coinCode }} {{ detail.data[0].goodsPrice}}</div>
                  <b
                    >{{ order.coinCode }}
                    {{ detail.data[1] && detail.data[1].goodsPayPrice }}</b
                  >
                </div> -->
              </li>
            </ul>
          </div>
          <!-- 定制 -->
          <div v-if="detail.groupType == 2" class="mod customization" @click="toDetail(order.id)">
            <ul>
              <li >
                <div class="left-box">
                  <img :src="detail.image" />

                  <!-- <div class="activity-sign" v-if="detail.coupon.discount || detail.coupon.money"> -->
                    <!-- <div class="triangle" v-if="detail.coupon.discount">{{discountConversion(detail.coupon.discount.discount)}}折</div> -->
                    <!-- <div class="triangle" v-if="detail.coupon.money">优惠券</div> -->
                  <!-- </div> -->
                </div>
                <div v-if="detail.groupType !== 0" class="group-type">
                  {{ detail.groupTypeText }}
                </div>

                <!--              单品-->
                <!-- <div v-if="detail.groupType === 0" class="right">
                  <h4 class="ow-h2">
                    {{ detail.goodsName }}
                  </h4>
                  <span>x 1</span>
                  <p>SKU：{{ detail.data[0].goodsCode }}</p>
                  <p>{{ detail.data[0].detailSpecs }}</p>
                  <b>{{ order.coinCode }} {{ detail.data[0].goodsPrice}}</b>
                </div> -->

                <!--              对戒-->
                <!-- <div v-if="detail.groupType === 1" class="right">
                  <h4 class="ow-h2">
                    {{ detail.goodsName }}
                  </h4>
                  <span>x 1</span>
                  <p>SKU：{{ detail.data[0].goodsCode }}</p>
                  <p>{{ detail.data[0].detailSpecs }}</p>
                  <b class="display-block margin-bottom-20"
                    >{{ order.coinCode }} {{ detail.data[0].goodsPrice }}</b
                  >
                  <p>SKU：{{ detail.data[1] && detail.data[1].goodsCode }}</p>
                  <p>{{ detail.data[1] && detail.data[1].detailSpecs }}</p>
                  <b
                    >{{ order.coinCode }}
                    {{ detail.data[1] && detail.data[1].goodsPrice }}</b
                  >
                </div> -->

                <!--              定制-->
                <div v-if="detail.groupType === 2" class="right">
                  <h4 class="order-ellipsis ow-h2">
                    {{ detail.data[0] && detail.data[0].goodsName }}
                  </h4>
                  <span>x 1</span>
                  <p>SKU：{{ detail.data[0].goodsCode }}</p>
                  <p>{{ detail.data[0].detailSpecs }}</p>
                  <b class="display-block margin-bottom-20"
                    >{{ formatCoin(order.coinCode) }}{{ detail.data[0].goodsPrice }}</b
                  >
                  <div v-if="detail.data[0].couponInfo.type === 2">
                    <div class="old-price" >{{ formatCoin(order.coinCode) }} {{ detail.data[0].goodsPrice}}</div>
                    <b class="display-block margin-bottom-20"
                    >{{ formatCoin(order.coinCode) }}{{ detail.data[0].goodsPayPrice }}</b
                  >
                  </div>
                  <b v-else class="display-block margin-bottom-20"
                    >{{ formatCoin(order.coinCode) }}{{ detail.data[0].goodsPrice }}</b
                  >
                  <h4 class="order-ellipsis ow-h2">
                    {{ detail.data[1] && detail.data[1].goodsName }}
                  </h4>
                  <p>SKU：{{ detail.data[1] && detail.data[1].goodsCode }}</p>
                  <p>{{ detail.data[1] && detail.data[1].detailSpecs }}</p>
                  <div v-if="detail.data[1].couponInfo.type === 2">
                    <div class="old-price" >{{ formatCoin(order.coinCode) }} {{ detail.data[1].goodsPrice}}</div>
                    <b class="display-block margin-bottom-20"
                    >{{ formatCoin(order.coinCode) }}{{ detail.data[1].goodsPayPrice }}</b
                  >
                  </div>
                  <b v-else class="display-block margin-bottom-20"
                    >{{ formatCoin(order.coinCode) }}{{ detail.data[1].goodsPrice }}</b
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="bottom">
          <div class="order" :class="order.orderStatus != 10 || order.paymentType == 11? 'no-margin' : '0'">
            <div>
              <div class="btn-look" v-if="ifShow(order)"  @click="toDetail(order.id)">{{lang.lookOrder}}</div>
              <div class="btn-look btn-express" v-if="order.orderStatus == 40"  @click="toLogistic(order.id)">{{lang.logisticsDetails}}</div>
              <div class="btn-look btn-express" v-if="order.orderStatus == 40 && order.isComment"  @click="toComment(order.id)">{{lang.lookComment}}</div>
              <div class="btn-look btn-express" v-if="order.orderStatus == 40 && !order.isComment"  @click="toComment(order.id)">{{lang.toEvaluate}}</div>
            </div>
            <div>
              <div class="order-box-a">
                <span class="title">{{ lang.orderCount }}：</span>
                <div class="order-amount">
                  <div>
                    <span class="coin-type">{{ formatCoin(order.coinCode) }}</span>
                    <span class="order-price">{{ order.orderAmount }}</span>
                  </div>
                </div>
              </div>
              <div class="order-box-a">
                <span class="title">{{ order.orderStatus == 10 ? lang.NeedPay : lang.ultimatelyPay }}：</span>
                <div class="order-amount">
                  <div v-if="$store.state.platform == 41 && order.coinCode == 'TWD'">
                    <span class="coin-type">{{ formatCoin(order.coinCode) }}</span>
                    <span class="order-price">{{ formatAmount(order.payAmount) }}</span> 
                  </div>
                  <div v-else>
                    <span class="coin-type">{{ formatCoin(order.coinCode) }}</span>
                    <span class="order-price">{{ order.payAmount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn">
            <span
              v-if="(order.orderStatus) > 0 && (order.orderStatus)<20 && order.wireTransferStatus == null"
              class="btn2"
              @click="cancelOrder(order.id)"
              >{{ lang.cancelOrder }}</span
            >
            <span
              v-if="
                [1].indexOf(order.orderStatus) > -1
              "
              class="btn1"
              @click.stop="paytips = !paytips"
              >{{ lang.paytips }}</span
            >
            <span
              v-if="
                (order.orderStatus) > 0 && (order.orderStatus)<20 && order.wireTransferStatus == null
              "
              class="btn1"
              @click.stop="goPay(order)"
              >{{ lang.toPay }}</span
            >
            <!-- <span
              v-if="(order.orderStatus) > 30"
              class="btn1"
              @click="orderSigning(order.id)"
              >{{ lang.confirmReceipt }}</span
            > -->
            <!-- <span
              v-if="canComment(order)"
              class="btn2"
              @click="toComment(order.id)"
              >{{ lang.toEvaluate }}</span
            > -->
          </div>
        </div>
      </li>
    </ul>
    <bdd-empty
      v-if="noListData"
      :type="'order'"
      @toShopping="toShopping"
    ></bdd-empty>
    <requesting v-if="requestingListData"></requesting>
    <no-more-data v-if="noMoreListData"></no-more-data>
    <PayTips v-if="paytips" @close="paytips = !paytips" />
  </div>
</template>

<script>
import List from '@/mixins/list.js'
import PayTips from '@/components/cart/paytips.vue'
export default {
  components: {
    PayTips
  },
  mixins: [List],
  props: {
    orderStatus: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      lang: this.LANGUAGE.components.personal,
      // langs: this.LANGUAGE.order,
      listMethod: 'get',
      listUrl: '/web/member/order',
      paytips: false
    }
  },
  computed: {
    // 所有已请求的页码的数据集合
    showOrderList() {
      let showData = JSON.parse(JSON.stringify(this.showData))
      showData = showData.map(order => {
        const details = order.details

        // 以joinCartTime为下标，组合对戒和定制
        const groups = {}
        const result = []

        details.map(good => {
          if (groups.hasOwnProperty(good.joinCartTime)) {
            // 将数据处理为直接可用的数据
            good.detailSpecs = JSON.parse(good.detailSpecs || '[]')
              .map(item => {
                return item.value
              })
              .join(' / ')
            groups[good.joinCartTime].data.push(good)
          } else {
            const newGroup = {
              id: `${good.orderId}-${good.joinCartTime}`,
              image: good.goodsImages,
              groupType: good.groupType,
              groupTypeText: this.lang.singleProduct,
              goodsName: good.goodsName
            }

            if ([null, 0, '0'].indexOf(good.groupType) > -1) {
              // 单品
              newGroup.groupType = 0
              newGroup.groupTypeText = this.lang.singleProduct
            }
            if (good.groupType === 1) {
              // 對戒
              newGroup.groupType = 1
              newGroup.groupTypeText = this.lang.pairRing
              newGroup.goodsName = good.ringName || this.lang.defaultPairRing
              newGroup.image = good.ringImg || '/marriage-ring/default.png'
            }
            if (good.groupType === 2) {
              // 定制
              newGroup.groupType = 2
              newGroup.groupTypeText = this.lang.diy
            }

            // 将数据处理为直接可用的数据
            good.detailSpecs = JSON.parse(good.detailSpecs || '[]')
              .map(item => {
                return item.value
              })
              .join(' / ')

            newGroup.data = [good]
            newGroup.image = this.imageStrToArray(newGroup.image)[0]
            groups[good.id] = newGroup
          }
        })

        let keys = Object.keys(groups)
        keys = keys.sort((a, b) => {
          return b - a
        })
        keys.forEach(item => {
          result.push(groups[item])
        })

        // 将定制的商品进行排序，钻石放在后面
        result.map(item => {
          if (item.groupType === 2) {
            // 定制
            const diamond = []
            const pedestal = []
            item.data.forEach(detail => {
              if (detail.categoryId === 1) {
                diamond.push(detail)
              } else {
                pedestal.push(detail)
              }
            })
            item.data = pedestal.concat(diamond)
            item.goodsName = pedestal[0].goodsName
            item.image = this.imageStrToArray(pedestal[0].goodsImages)[0]
          }
          return item
        })

        order.details = result
        return order
      })
      // console.log("showOrderList",showData)
      return showData
    },
    // 列表特定参数
    specialParams() {
      return {
        orderStatus: this.orderStatus
      }
    },
    ifShow(order) {
      return function(order) {
        if(order.paymentType == 11){
          return true
        }else{
          if(order.orderStatus != 10){
            return true
          }else{
            return false
          }
        }
      }
    }
  },
  watch: {
    orderStatus(val, oldVal) {
      this.research()
    }
  },
  mounted() {
    const text = document.getElementsByClassName('order-ellipsis')
    for (let i = 0; i < text.length; i++) {
      this.$helpers.overflowHiddon(text[i])
    }
  },
  methods: {
    getconfig(detailSpecs,attr,lettering){
      // console.log("fffffff",attr)
      let text = ''
      if (attr.length > 0) {
        attr.map((item, index) => {
          if (index === attr.length - 1) {
            text = text + item.configAttrIVal
          } else {
            text = text + item.configAttrIVal + ' /  '
          }
        })
        text = detailSpecs + ' /  '+ text 
      }else {
        text = detailSpecs
      }
      // console.log("fffffff",text)
      // 刻字
      if(lettering){
        text = text+' /  '+ lettering 
      }
      return text
    },
    // 属性数值转化成字符串
    getDubleConfig(good_spec,goods_attr,ring,attr) {
      let attrs = []
      ring.lang.goods_spec.forEach((item,a) => {
        attrs.push(item)
      })
      attr.forEach((i,a) => {
        if (ring.id == i.goodsId) {
          i.attr_value = i.configAttrIVal
          attrs.push(i)
        }
      })
      let text = ''
      if (attrs.length > 0) {
        attrs.map((item, index) => {
          if (index === attrs.length - 1) {
            text = text + item.attr_value
          } else {
            text = text + item.attr_value + ' /  '
          }
        }) 
      }

      if (goods_attr) {
       for (let i in goods_attr) {
          text = text + ' /  '+goods_attr[i] 
        }
      }
      return text
    },
    canComment(order) {
      const details = order.details
      // console.log("order",details.length)
      let num = 0
      for (let n = 0, length = details.length; n < length; n++) {
        if (
          [null, 0, '0'].indexOf(details[n].groupType) > -1 &&
          details[n].data[0].categoryId === 1
        ) {
          num++
        }
        //  console.log('indexof',details[n].data[0].categoryId)
      }

      return [5].indexOf(order.orderStatus) > -1 && details.length !== num
      // return [4, 5].indexOf(order.orderStatus) > -1 && details.length !== num
    },
    toShopping() {
      this.$router.push({
        name: 'index'
      })
    },
    statusText(status) {
      const map = {
        0: this.lang.cancelled,
        10: this.lang.unpaid,
        20: this.lang.paid,
        30: this.lang.waitingSend,
        40: this.lang.shipped,
        50: this.lang.completed,
        // 6: this.lang.commented,
        // 7: this.lang.returnApplication,
        // 8: this.lang.returning,
        // 9: this.lang.returned,

      }
      // console.log("status",map[status])
      return map[status]
    },
    getTransferStatus(transferStatus){
      const transferStatus_value = {
        0 : this.lang.pending,
        1 : this.lang.paid,
        10 : this.lang.payfailed
      };
      return transferStatus_value[transferStatus];
    },
    refundStatusText(refundStatus){
      const refundStatus_value = {
        1 : this.lang.hadClosed
      };
      return refundStatus_value[refundStatus];
    },
    // 跳转到详情页
    toDetail(orderId) {
      this.$router.push({
        name: 'personal-orderDetail',
        query: {
          orderId: orderId
        }
      })
    },
    // 跳转到物流详情
    toLogistic(orderId){
      this.$router.push({
        name: 'personal-logistics-information',
        query: {
          orderId: orderId
        }
      })
    },
    // 去支付
    goPay(val) {
      const res = {
        coinType: val.coinCode, // 支付币种 ,
        payAmount: val.payAmount, // 支付金额 ,
        orderId: val.id, // 订单ID
        payAmountHKD: val.payAmountHKD
      }
      this.$router.push({
        name: 'cart-pay',
        query: {
          info: JSON.stringify(res)
        }
      })
      // console.log(val)
    },
    // 确认收货
    orderSigning(orderId) {
      const _this = this
      _this.$ConfirmBox({
        // title: _this.lang.caveat,
        message: `${_this.lang.confirmReceipt}？`,
        buttons: [
          {
            text: _this.lang.cancel,
            callback: () => {
              console.log('点击了取消')
            }
          },
          {
            text: _this.lang.clear,
            callback: () => {
              _this.$store
                .dispatch('orderSigning', orderId)
                .then(data => {
                  _this.$toast(_this.lang.received)
                  _this.research()
                })
                .catch(err => {
                  _this.$toast(`${err.message}`)
                })
            }
          }
        ]
      })
    },
    // 取消订单
    cancelOrder(orderId) {
      const _this = this
      _this.$ConfirmBox({
        // title: _this.lang.caveat,
        message: `${_this.lang.confirmCancellationOrder}？`,
        buttons: [
          {
            text: _this.lang.cancel,
            callback: () => {
              console.log('点击了取消')
            }
          },
          {
            text: _this.lang.clear,
            callback: () => {
              _this.$store
                .dispatch('cancelOrder', orderId)
                .then(data => {
                  _this.$toast(_this.lang.canceled)
                  _this.research()
                })
                .catch(err => {
                  _this.$toast(`${err.message}`)
                })
            }
          }
        ]
      })
    },
    // 去评论
    toComment(orderId) {
      this.$router.push({
        name: 'personal-doComment',
        query: {
          orderId: orderId
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.orderlist {
  .content {
    display: inline-block;
    width: 100%;
    background: #f2f2f2;
    .item {
      width: calc(100% - 24px);
      margin: 12px;
      padding: 20px 14px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid #ffffff; /*no*/
      border-radius: 5px;
      img {
        width: 75px;
        height: 75px;
      }
      .top {
        justify-content: flex-start;
        display: flex;
        span {
          display: inline-block;
          flex-grow: 1;
          flex-shrink: 1;
          height: 20px;
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          text-align: left;
          color: rgba(153, 153, 153, 1);
        }
        .order-status {
          color: #999999;
          text-align: right;
          color: rgba(234, 74, 74, 1);
          white-space: nowrap;
        }
      }
      .double{
        position: relative;
        .old-price{
          margin-left: 90px;
          text-align: left;
          color: #b2b2b2;
          text-decoration: line-through;
          margin-bottom: 0.053333rem;
          font-size: 0.32rem;
          margin-top: 0.266667rem;
        }
        .num{
          position: absolute;
          right:0px;
          top:30%;
          span {
            // float: right;
            font-size: 14px;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }
        }
        .price{
          // position: absolute;
          // right:145px;
          margin-top: 10px;
          b {
            display: inline-block; 
            width: 45%;
            font-size: 17px;
            font-weight: 400;
            color: rgba(243, 163, 145, 1);
            font-family: twCenMt;
            // margin-right: 50px;
            text-align: left;
            // margin-left: 88px;
          }
        }
        .dec{
          // margin-bottom: 20px;
        }
        .dec:nth-child(2){
          .ow-h2{
            display: none;
          }
          .sku{
            display: none;
          }
        }
      }
      .mod {
        margin-top: 20px;
        ul {
          li {
            position: relative;
            border-bottom: 1px solid #f5f5f5; /*no*/
            padding-bottom: 20px;
            margin-bottom: 20px;

            .left-box{
              float: left;
              width: 75px;
              height: 75px;
              position: relative;

              img {
                width: 100%;
                height: 100%;
              }
            }
            .group-type {
              position: absolute;
              top: 90px;
              left: 37px;
              /*width: 36px;*/
              height: 16px;
              padding: 0 4px;
              line-height: 16px;
              text-align: center;
              border-radius: 2px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(148, 116, 101, 1);
              background: rgba(245, 240, 236, 1);
              border: 1px solid rgba(215, 202, 196, 1); /*no*/
              transform: translate(-50%, 0);
            }
            .right {
              width: calc(100% - 90px);
              margin-left: 90px;
              text-align: left;
              .old-price{
                color: #b2b2b2;
                text-decoration: line-through;
                margin-bottom: 0.053333rem;
                font-size: 12px;
                margin-top: 10px;
              }
              h4 {
                position: relative;
                /*display: inline-block;*/
                width: 180px;
                max-height: 36px;
                font-size: 14px;
                line-height: 18px;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
              }
              span {
                float: right;
                font-size: 14px;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
              }
              p {
                font-size: 13px;
                line-height: 20px;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
              }
              b {
                font-size: 17px;
                line-height: 24px;
                font-weight: 400;
                color: rgba(243, 163, 145, 1);
                font-family: twCenMt;
              }
              .btn-type {
                width: 36px;
                height: 16px;
                margin-left: -74px;
                text-align: center;
                background: rgba(245, 240, 236, 1);
                border: 1px solid rgba(215, 202, 196, 1); /*no*/
                border-radius: 2px;
                font-size: 12px;
                font-weight: 400;
                color: rgba(148, 116, 101, 1);
              }
            }
            
          }
        }
      }
      .bottom {
        padding: 0;
        /*padding: 0px 0 24px;*/
        .order {
          margin-left: 90px;
          display: flex;
          align-items: center;
          .title {
            flex-shrink: 1;
            min-width: 0;
            font-size: 14px;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            text-align: left;
          }
          .order-amount {
            flex-grow: 0;
            flex-shrink: 0;
            font-size: 0;
            vertical-align: bottom;
            .coin-type {
              // margin-right: 7px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(242, 155, 135, 1);
            }
            .order-price {
              font-size: 18px;
              font-weight: 400;
              color: rgba(242, 155, 135, 1);
            }
          }
        }
        .btn {
          display: flex;
          // text-align: right;
          margin-left: 90px;
          font-size: 0;
          span {
            // display: inline-block;
            /*width: 100px;*/
            width: 110px;
            height: 32px;
            // padding: 0 15px;
            border-radius: 5px;
            font-size: 14px;
            line-height: 32px;
            font-weight: 400;
            text-align: center;
            margin-top: 20px;
          }
          span:last-child{
            margin-left: 30px;
          }
          .btn1 {
            background: #333333;
            color: #ffffff;
          }
          .btn2 {
            line-height: 34px;
            background: rgba(252, 252, 252, 1);
            border: 1px solid rgba(221, 221, 221, 1); /*no*/
            border-radius: 5px;
            color: #666666;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}

.order.no-margin{
  margin-left: 0 !important;
}
.btn-look{
    width: 100px;
    height: 0.853333rem;
    // padding: 0 0.56rem;
    border-radius: 0.133333rem;
    font-size: 0.373333rem;
    line-height: 0.853333rem;
    font-weight: 400;
    text-align: center;
    color: #F29C88;
    border: 1px solid #F29C88;
    margin-right: 0.6rem;
}
.btn-express{
  margin-top: 10px;
}
.order-box-a{
  display: flex;
  align-items: center;
}
.order-box-a:first-child{
  margin-bottom: 4px;
}

.activity-sign{
  width: 40px;
  height: 40px;
  right: -4px;
  bottom: -4px;
}
</style>
