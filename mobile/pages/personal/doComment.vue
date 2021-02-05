<template>
  <div class="do-comment">
    <!-- 查看留言 -->
    <div class="content" v-if="total_count">
      <div class="operate-bar">
        <i class="icon iconfont iconguanbi close" @click="goBack($router)"></i>
      </div>
      <div class="page-title">
        {{ lang.orderComment }}
      </div>
      <ul>
        <li
          v-for="(detail, ind) in info"
          :key="ind"
          class="product"
        >
          <div class="product-info">
            <div class="left-item">
              <div class="product-image">
                <img :src="detail.goodsImages" />
              </div>
              <div v-if="detail.groupType !== 0" class="product-type">
                <!-- <span class="item">{{ detail.groupTypeText }}</span> -->
              </div>
            </div>

            <div class="right-item">
              <!--              单品-->
              <template v-if="1">
                <div class="good-item">
                  <h2 class="name ow-h1">
                    {{ detail.goodsName }}
                  </h2>
                  <p class="parameter margin-bottom-15">
                    <span v-for="(v, k) in detail.detailSpecs" :key="k">
                      {{ v.name }}：{{ v.value }}
                    </span>
                  </p>
                </div>
              </template>

              <!--              对戒-->
              <!-- <template v-if="detail.groupType === 1">
                <div class="good-item">
                  <h2 class="name ow-h1">
                    {{ detail.goodsName }}
                  </h2>
                  <p class="parameter margin-bottom-15">
                    {{ detail.data[0].detailSpecs }}
                  </p>
                  <p class="parameter margin-bottom-15">
                    {{ detail.data[1].detailSpecs }}
                  </p>
                </div>
              </template> -->

              <!--              定制-->
              <!-- <template v-if="detail.groupType === 2">
                <div class="good-item">
                  <h2 class="name ow-h1">
                    {{ detail.data[0].goodsName }}
                  </h2>
                  <p class="parameter margin-bottom-15">
                    {{ detail.data[0].detailSpecs }}
                  </p>
                </div>
                <div class="good-item">
                  <h2 class="name ow-h1">
                    {{ detail.data[1].goodsName }}
                  </h2>
                  <p class="parameter margin-bottom-15">
                    {{ detail.data[1].detailSpecs }}
                  </p>
                </div>
              </template> -->

              <!-- <template>
                <div class="good-item">
                  <h2 class="name ow-h1">
                    {{ detail.data[0].goodsName }}
                  </h2>
                </div>
              </template> -->

              <div class="score">
                <span class="title">{{ lang.comment }}：</span>
                <div class="stars">
                  <i
                    v-for="m in 5"
                    :key="m"
                    :class="[
                      'iconfont',
                      'iconxing',
                      { active: m <= detail.commentsLevel }
                    ]"
                  ></i>
                </div>
              </div>

              <div class="score" v-if="detail.imgDada.length">
                <span class="title">{{ lang.hasImgComments }}：</span>
                <div class="pic-box">
                  <div class="pics" v-for="(item, idx) in detail.imgDada" :key = "idx">
                    <div class="pics-list">
                      <img :src="item.url" alt="">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-area">
            <textarea
              v-model="detail.commentsDesc"
              cols="40"
              rows="4"
              disabled
              maxlength="500"
              :placeholder="lang.commentTips"
            ></textarea>
            <div class="word-count">
              {{
                detail.commentsDesc &&
                detail.commentsDesc.length &&
                detail.commentsDesc.length > 0
                  ? detail.commentsDesc.length + '/'
                  : ''
              }}500
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 编辑留言 -->
    <div class="content" v-else>
      <div class="operate-bar">
        <i class="icon iconfont iconguanbi close" @click="goBack($router)"></i>
      </div>
      <div class="page-title">
        {{ lang.orderComment }}
      </div>
      <ul>
        <li
          v-for="(detail, ind) in info"
          :key="ind"
          class="product"
        >
          <div class="product-info">
            <div class="left-item">
              <div class="product-image">
                <img :src="detail.goodsImages" />
              </div>
              <div v-if="detail.groupType !== 0" class="product-type">
                <!-- <span class="item">{{ detail.groupTypeText }}</span> -->
              </div>
            </div>

            <div class="right-item">
              <!--              单品-->
              <template v-if="1">
                <div class="good-item">
                  <h2 class="name ow-h1">
                    {{ detail.goodsName }}
                  </h2>
                  <p class="parameter margin-bottom-15">
                    <span v-for="(v, k) in detail.detailSpecs" :key="k">
                      {{ v.name }}：{{ v.value }}
                    </span>
                  </p>
                </div>
              </template>

              <!--              对戒-->
              <!-- <template v-if="detail.groupType === 1">
                <div class="good-item">
                  <h2 class="name ow-h1">
                    {{ detail.goodsName }}
                  </h2>
                  <p class="parameter margin-bottom-15">
                    {{ detail.data[0].detailSpecs }}
                  </p>
                  <p class="parameter margin-bottom-15">
                    {{ detail.data[1].detailSpecs }}
                  </p>
                </div>
              </template> -->

              <!--              定制-->
              <!-- <template v-if="detail.groupType === 2">
                <div class="good-item">
                  <h2 class="name ow-h1">
                    {{ detail.data[0].goodsName }}
                  </h2>
                  <p class="parameter margin-bottom-15">
                    {{ detail.data[0].detailSpecs }}
                  </p>
                </div>
                <div class="good-item">
                  <h2 class="name ow-h1">
                    {{ detail.data[1].goodsName }}
                  </h2>
                  <p class="parameter margin-bottom-15">
                    {{ detail.data[1].detailSpecs }}
                  </p>
                </div>
              </template> -->

              <!-- <template>
                <div class="good-item">
                  <h2 class="name ow-h1">
                    {{ detail.data[0].goodsName }}
                  </h2>
                </div>
              </template> -->

              <div class="score">
                <span class="title">{{ lang.comment }}：</span>
                <div class="stars">
                  <i
                    v-for="m in 5"
                    :key="m"
                    :class="[
                      'iconfont',
                      'iconxing',
                      { active: m <= detail.commentsLevel }
                    ]"
                    @click="detail.commentsLevel = m"
                  ></i>
                </div>
              </div>

              <div class="score">
                <span class="title">{{ lang.uploadPictures }}：</span>
                <div class="pic-box">
                  <div class="pics" v-for="(item, idx) in detail.imgDada" :key = "idx">
                    <div class="pics-list">
                      <img :src="item.url" alt="">
                    </div>
                    <span class="del" @click="delImg(ind, idx)"></span>
                  </div>

                  <div class="add" v-if="detail.imgDada.length < 3">
                    <input class="file" type="file" multiple  accept="image/*" @change="changeFile($event,ind)">
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-area">
            <textarea
              v-model="detail.commentsDesc"
              cols="40"
              rows="4"
              maxlength="500"
              @click="focus($event)"
              :placeholder="lang.commentTips"
            ></textarea>
            <div class="word-count">
              {{
                detail.commentsDesc &&
                detail.commentsDesc.length &&
                detail.commentsDesc.length > 0
                  ? detail.commentsDesc.length + '/'
                  : ''
              }}500
            </div>
          </div>
        </li>
      </ul>
      
      <div v-if="!ifSubmit" class="btn-group">
        <button class="full-btn submit" @click="submitComment">
          {{ lang.clear }}
        </button>
      </div>

      <div v-else class="btn-group bg-color">
        <button class="full-btn submit">
          {{ lang.audit}}
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import Moment from 'moment'
export default {
  layout: 'no-bar',
  data() {
    return {
      lang: this.LANGUAGE.personal.doComment,
      info: {},
      commentsDesc: '',
      imgData: [],
      total_count: 0,
      orderComments: {},
      ifSubmit: false,
      clentHeight: 0
    }
  },
  computed: {
    details() {
      let result = []
      const data = JSON.parse(
        JSON.stringify(this.info.outDetails ? this.info.outDetails : [])
      )
      data.forEach(item => {
        if (item.outOrderDetails && item.outOrderDetails instanceof Array) {
          result = result.concat(this.dealDetailsData(item.outOrderDetails))
        }
        // return item
      })
      // console.log('result=======>', result)
      return result
    }
  },
  watch: {
    test(newName, oldName) {
      this.num = newName.length
    }
  },
  mounted() {
    const _this = this
    _this.$nextTick(() => {
      _this.clentHeight = document.body.offsetHeight || document.documentElement.clientHeight;

      _this.$nuxt.$loading.start()
      _this.getOrderComment()
      _this.getInfo()
    })
  },
  methods: {
    clickStar(index, num) {
      const info = JSON.parse(JSON.stringify(this.info))
      info.allDetails[index].commentsLevel = num
      this.info = info
    },
    payChannelText(payChannel) {
      const map = {
        null: '',
        1: '電匯',
        2: 'paypal',
        3: '微信',
        4: '支付宝',
        5: 'visa/Mastercard',
        6: '銀聯',
        7: 'paydollar'
      }
      return map[payChannel]
    },
    dealDetailsData(details = []) {
      details = JSON.parse(JSON.stringify(details || []))

      // 以joinCartTime为下标，组合对戒和定制
      const groups = {}
      const result = []

      details.map(good => {
        // console.log('good=====>', good)
        if (groups.hasOwnProperty(good.joinCartTime)) {
          // 将数据处理为直接可用的数据
          good.detailSpecs = JSON.parse(good.detailSpecs || '[]')
            // .map(item => {
            //   return item.value
            // })
            // .join(' / ')
          groups[good.joinCartTime].data.push(good)
        } else {
          const newGroup = {
            id: `${good.orderId}-${good.joinCartTime}`,
            image: good.goodsImages,
            groupType: good.groupType,
            groupTypeText: this.lang.singleProduct,
            goodsName: good.goodsName
          }

          if ([null, 0, '0'].indexOf(good.groupType)) {
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
            // .map(item => {
            //   return item.value
            // })
            // .join(' / ')

          newGroup.data = [good]
          newGroup.image = this.imageStrToArray(newGroup.image)[0]

          groups[good.joinCartTime] = newGroup
        }
      })

      // 排序
      let keys = Object.keys(groups)
      keys = keys.sort((a, b) => {
        return b - a
      })
      keys.forEach(item => {
        result.push(groups[item])
      })

      // 删除钻石单品（钻石单品不能评论）
      for (let n = keys.length - 1; n >= 0; n--) {
        if (
          [null, 0, '0'].indexOf(result[n].groupType) > -1 &&
          result[n].data[0].categoryId === 1
        ) {
          // 单品钻石
          result.splice(n, 1)
        }
      }

      // 将定制的商品进行排序，钻石放在后面
      result.map(item => {
        // console.log('item====>', item)
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

      return result
    },
    getInfo() {
      const _this = this
      _this
        .$axios({
          method: `get`,
          url: `/web/member/order/detail`,
          params: {
            orderId: _this.$route.query.orderId
          }
        })
        .then(res => {
          // console.log('data====>', res)
          const data = res

          // if (data.orderStatus !== 5) {
          //   this.$toast(this.lang.cannotComment)
          //   setTimeout(() => {
          //     this.$router.replace({
          //       name: 'personal-order'
          //     })
          //   }, 2000)
          //   return
          // }

          data.orderTime = Moment(data.orderTime).format('YYYY/MM/DD HH:mm:ss')
          data.payChannelText = data.payChannel
            ? _this.payChannelText(data.payChannel)
            : data.orderStatus > 1
            ? this.lang.cableTransfer
            : ''
          data.payTime = data.payTime
            ? Moment(data.payTime).format('YYYY/MM/DD HH:mm:ss')
            : ''

          let allDetails = []

          data.item = _this.dealDetailsData(data.details)
          allDetails = allDetails.concat(data.item)

          // data.allDetails = allDetails
          data.allDetails = allDetails.map(item => {
            var itemData = item.data;
            itemData.map(o => {
              o.commentsLevel = 5
              o.commentsDesc = ''
              o.imgDada = []
              return o
            })

              return item
          })

          _this.info =JSON.parse(JSON.stringify(data.allDetails[0].data))
          _this.$nuxt.$loading.finish()
          // console.log('this.info',_this.info)

          if(_this.orderComments){
            var len = _this.info.length,
            len2 = _this.orderComments.length;

            for(var c=0; c<len; c++){
              for(var d=0; d<len2; d++){
                if(_this.info[c].goodsId == _this.orderComments[d]['style_id']){
                  _this.info[c].commentsLevel = _this.orderComments[d].grade
                  _this.info[c].commentsDesc = _this.orderComments[d].content
                  _this.info[c]['created_at'] = _this.orderComments[d]['created_at']
                  _this.info[c].username = _this.orderComments[d].username

                  if(_this.orderComments[d].images){
                    var images = [];
                    var imgD = (_this.orderComments[d].images).split(',');

                    for(let f=0; f<imgD.length; f++){
                      var item = {};
                      item.url = imgD[f];
                      images.push(item)
                    }

                    _this.info[c].imgDada = images;
                  }
                  
                  break
                }
              }
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getOrderComment() {
      var _this = this;

      this.$axios({
        method: 'get',
        url: '/web/member/order/comment-list',
        params: {
          'order_id': _this.$route.query.orderId
        }
      })
      .then(res => {
        _this.total_count = res.data.length;
        _this.orderComments = res.data;
      })
    },
    changeFile(obj,j) {
      var _this = this,file = obj.target.files;

      // const isJPG =
      // file.type == 'image/jpeg'||
      // file.type == 'image/png'||
      // file.type == 'image/jpg'||
      // file.type == 'image/gif'||
      // file.type == 'image/tiff'||
      // file.type == 'image/raw'||
      // file.type == 'image/pcx'||
      // file.type == 'image/tga'||
      // file.type == 'image/exif'||
      // file.type == 'image/fpx'||
      // file.type == 'image/svg'||
      // file.type == 'image/psd'||
      // file.type == 'image/cdr'||
      // file.type == 'image/pcd'||
      // file.type == 'image/dxf'||
      // file.type == 'image/ufo'||
      // file.type == 'image/eps'||
      // file.type == 'image/ai'||
      // file.type == 'image/WMF'||
      // file.type == 'image/webp'||
      // file.type == 'image/bmp';

      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
        // this.$message.error(this.$t(`${lang}.imgFomat`));
        // return isJPG
      // }
      // if (!isLt2M) {
        // this.$message.error(this.$t(`${lang}.imgSize`));
        // return isLt2M
      // }
      // return isJPG && isLt2M;

      var imgDatas = [],ii = 0;
      
      for(let i of file){
        this.$nuxt.$loading.start()

        var fq = new window.FormData();
        fq.set('file', i, i.name)

        this.$axios.post("/web/file/images",fq)
        .then(res => {
          imgDatas.push(res)
          resg()
        })
        .catch(err => {
          // imgData.push('')
          resg()
        })
      }

      function resg() {
        ii+=1;
        if(ii == file.length){
          finish()
        }
      }

      function finish() {
        _this.$nuxt.$loading.finish()

        if(imgDatas.length){
          if(imgDatas.length > 3){
            imgDatas.length = 3;
          }

          for(let m=0; m<imgDatas.length; m++){
            var len = _this.info[j].imgDada.length;
            // console.log(len)

            if(len < 3){
              _this.info[j].imgDada.push(imgDatas[m])
            }
          }
        }

        obj.target.value = null;
      }
    },
    delImg(m, n) {
      this.info[m].imgDada.splice(n,1);
    },
    focus(element) {
      var that = this;
      // var eleBottom = element.target.offsetTop+element.target.clientHeight;
      // element.target.scrollIntoViewIfNeeded(false);

      var t = navigator.userAgent;
  　　if (t.indexOf("Android") > -1 || t.indexOf("Adr") > -1) {
        setTimeout(function(){
          element.target.scrollIntoView();
          return

          // var eleHeight = document.body.offsetHeight || document.documentElement.clientHeight;
          // var keyboardHeight = that.clentHeight - eleHeight;//获取键盘的高度
          // var keyboardY = that.clentHeight - keyboardHeight;
          // var offset = eleBottom - eleHeight;//计算上滑的距离

          // var scrollT =  document.documentElement.scrollTop || document.body.scrollTop;
          // var scrollT =  document.body.scrollTop;
          // document.body.scrollTop = 200
        },200);
      }
    },
    submitComment() {
      const allDetails = JSON.parse(JSON.stringify(this.info));
      var paramsData = [], hasComment=false;

      allDetails.forEach(group => {
       var list = {
            'order_id': '',
            'type_id': '',
            'style_id': '',
            'grade': '',
            'content': '',
            'images': [],
          };

          // 商品里面的组成物品
          list['order_id'] = group.orderId;
          list['type_id'] = group.categoryId;
          list['style_id'] = group.goodsId;
          list['grade'] = group.commentsLevel;
          list['content'] = group.commentsDesc;

          // if(group.commentsDesc){
          //   hasComment = true
          // }
          
          group.imgDada.forEach(o => {
            list['images'].push(o.url)
          })

          paramsData.push(list);
      })

      // if(!hasComment){
      //   this.$toast(this.lang.cannotEmpty)
      //   return
      // }

      for(var t=0; t<paramsData.length; t++){
        if(!paramsData[t].content){
          paramsData[t].content = this.lang.defaultPraise
        }
      }
      
      this.$axios
      .post('/web/member/order/comment', {'params': paramsData})
      .then(res => {
        this.ifSubmit = true;
        this.$toast(this.lang.commentSuccess)
        // this.$router.replace('/personal/order')
      })
      .catch(err => {
        if (!err.response) {
          this.$message.error(err.message)
        } else {
          // console.log(err)
        }
      })
    },
    toOrder() {
      this.$router.replace('/personal/order')
    }
  }
}
</script>

<style scoped lang="less">
.do-comment{
  position: absolute;
  width: 100%;
}
.content {
  padding: 15px;
  box-sizing: border-box;
}
.operate-bar {
  height: 17px;
  text-align: right;
  margin-bottom: 30px;

  .close {
    font-size: 17px;
    color: #333333;
  }
}
.page-title {
  margin-bottom: 30px;
  font-size: 18px;
  text-align: center;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.product {
  margin-bottom: 30px;
  .product-info {
    margin-bottom: 17px;
    display: flex;
    .left-item {
      flex-grow: 0;
      flex-shrink: 0;

      .product-image {
        line-height: 0;
        img {
          width: 60px;
          height: 60px;
        }
      }
      .product-type {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        font-size: 0;
        .item {
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 400;
          color: rgba(148, 116, 101, 1);
          background: rgba(245, 240, 236, 1);
          border: 1px solid rgba(215, 202, 196, 1);
          border-radius: 2px;
          display: inline-block;
        }
      }
    }
    .right-item {
      flex-grow: 1;
      flex-shrink: 1;
      margin-left: 20px;

      .good-item {
        margin-bottom: 15px;
        /*&:nth-last-of-type(1) {*/
        /*  margin-bottom: 0;*/
        /*}*/
        .name {
          margin-bottom: 7px;
          font-size: 14px;
          font-weight: 400;
          text-align: left;
          color: rgba(51, 51, 51, 1);
          box-sizing: content-box;
        }
        .parameter {
          margin-bottom: 7px;
          font-size: 12px;
          font-weight: 400;
          text-align: left;
          color: rgba(153, 153, 153, 1);

          &:nth-last-of-type(1) {
            margin-bottom: 0;
          }

          span:nth-child(odd){
            margin-right: 20px;
          }
        }
      }
      .score {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .title {
          width: 76px;
          flex-shrink: 0;
          text-align: left;
          font-size: 14px;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        .stars {
          flex-grow: 4.6;
          flex-shrink: 0;
          text-align: left;

          .iconfont {
            font-size: 22px;
            color: #dddddd;
            margin-right: 5px;
            &.active {
              color: #f29b87;
            }
            &:nth-last-of-type(1) {
              margin-right: 0;
            }
          }
        }

        .pic-box{
          flex-grow: 4.6;
          height: 50px;
          width: 120px;

          .pics{
            width: 50px;
            height: 50px;
            float: left;
            margin-right: 10px;
            position: relative;

            .pics-list{
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;

              img{
                position: absolute;
                left: 0;
                top: 50%;
                width: 100%;
                transform: translateY(-50%);
              }
            }


            .del{
              position: absolute;
              top: -6px;
              right: -6px;
              width: 20px;
              height: 20px;
              background: #fff url(/icon/del.jpg) center;
              background-size: 100% 100%;
            }
          }

          .add{
            position: relative;
            width: 50px;
            height: 50px;
            border: 1px solid #ccc;
            border-radius: 4px;
            float: left;

            .file{
              position: absolute;
              top: 0;
              left: 0;
              z-index: 2;
              width: 100%;
              height: 100%;
              opacity: 0;
            }

            span{
              position: absolute;
              top: 50%;
              left: 50%;
              width: 20px;
              height: 1px;
              background-color: #ccc;
              transform: translate(-50%, -50%);
            }

            span:last-child{
              transform: translate(-50%, -50%) rotate(90deg);
            }
          }
        }
      }
    }
  }
  .text-area {
    min-height: 100px;
    background: rgba(244, 244, 244, 1);
    border-radius: 4px;

    textarea {
      width: 100%;
      padding: 16px 14px;
    }
    textarea::placeholder{
      font-size: 12px;
      color: #aaa;
    }

    .word-count {
      padding: 10px;
      text-align: right;
      font-size: 12px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }
}
.btn-group {
  margin: 10px 0;
  .submit {
    /*letter-spacing: 16px;*/
    color: #ffffff;
    background: rgba(51, 51, 51, 1);
    border-radius: 8px;
  }
}

.bg-color{
  .submit {
    background-color: #ccc;
  }
}

ul{
  min-height: 344px;
}
</style>