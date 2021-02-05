<template>
  <!-- 查看评论 -->
  <div class="do-comment" v-if="total_count">
    <div class="dm-title">{{ $t(`${lang}.title`) }}</div>
    <div class="m-title">
      <span>{{ $t(`${lang}.productDetails`) }}</span>
      <span>{{ $t(`${lang}.commentContent`) }}</span>
    </div>
    <div class="dm-top-line" />
    <div class="dm-blocks">
      <div v-for="(d, index) in info.allDetails" :key="index" class="dm-block">
        <div v-for="(dd, idx) in d.data" :key="idx" class="right-dm">
          <div class="rdm-box">
            <div class="rdm-img">
              <img :src="imageStrToArray(dd.goodsImages)[index]" alt="" />
            </div>
            <div class="rdm-desc">
              <div class="rdm-name">{{ dd.goodsName }}</div>
              <div class="rdm-sku">{{ dd.goodsCode }}</div>
              <div class="rdm-details">
                <span v-for="(v, k) in dd.detailSpecs" :key="k">
                  {{ v.name }}：{{ v.value }}
                </span>
              </div>
            </div>
          </div>

          <div class="left-dm">
            <div class="left-dm-star">
              <div class="label">{{ $t(`${lang}.rateGoods`) }}</div>
              <div class="content">
                <i
                  v-for="stars in 5"
                  :key="stars"
                  :class="[
                    { iconxing1: dd.commentsLevel < stars },
                    { iconxing: stars <= dd.commentsLevel }
                  ]"
                  class="iconfont"
                />
              </div>
            </div>

            <div class="left-dm-desc">
              <div class="label">{{ $t(`${lang}.feeling`) }}</div>
              <div class="content">
                <textarea v-model="dd.commentsDesc" disabled />
              </div>
            </div>

            <div class="uploading-box" v-if="dd.imgData && dd.imgData.length">
              <div class="text">{{ $t(`${lang}.uploadPictures`) }}</div>
              <div class="uploading-img">
                <div v-for="(ite, idxb) in dd.imgData" :key="idxb" class="img-box" ref='imgBox'>
                  <img :src="ite.url" alt="">
                </div>
              </div>
            </div>

          </div>          

        </div>   
      </div>
    </div>

    <div class="dm-btn bg-color">
      {{ $t(`${lang}.SubmitComment`) }}
    </div>

    <message-box
      v-show="alertBox"
      :title="alertBoxInfo.title"
      :message="alertBoxInfo.message"
      type="one"
      @done="alertBox = false"
    />
  </div>

  <!-- 编辑评论 -->
  <div class="do-comment" v-else>
    <div class="dm-title">{{ $t(`${lang}.title`) }}</div>
    <div class="m-title">
      <span>{{ $t(`${lang}.productDetails`) }}</span>
      <span>{{ $t(`${lang}.commentContent`) }}</span>
    </div>
    <div class="dm-top-line" />
    <div class="dm-blocks">
      <div v-for="(d, index) in info.allDetails" :key="index" class="dm-block">
        <div v-for="(dd, idx) in d.data" :key="idx" class="right-dm">
          <div class="rdm-box">
            <div class="rdm-img">
              <img :src="imageStrToArray(dd.goodsImages)[index]" alt="" />
            </div>
            <div class="rdm-desc">
              <div class="rdm-name">{{ dd.goodsName }}</div>
              <div class="rdm-sku">{{ dd.goodsCode }}</div>
              <div class="rdm-details">
                <span v-for="(v, k) in dd.detailSpecs" :key="k">
                  {{ v.name }}：{{ v.value }}
                </span>
              </div>
            </div>
          </div>

          <div class="left-dm">
            <div class="left-dm-star">
              <div class="label">{{ $t(`${lang}.rateGoods`) }}</div>
              <div class="content">
                <i
                  v-for="stars in 5"
                  :key="stars"
                  :class="[
                    { iconxing1: dd.commentsLevel < stars },
                    { iconxing: stars <= dd.commentsLevel }
                  ]"
                  class="iconfont"
                  @click="dd.commentsLevel = stars"
                />
              </div>
            </div>

            <div class="left-dm-desc">
              <div class="label">{{ $t(`${lang}.feeling`) }}</div>
              <div class="content">
                <textarea :placeholder="$t(`${lang}.commentTips`)" v-model="dd.commentsDesc" />
              </div>
            </div>

            <div class="uploading-box">
              <div class="text">{{ $t(`${lang}.uploadPictures`) }}</div>
              <div class="uploading-img">
                <div v-for="(ite, idxb) in dd.imgData" :key="idxb" class="img-box" ref='imgBox' @mouseover="showMaskLayer(idxb)" @mouseout="hideMaskLayer()">
                  <img :src="ite.url" alt="">
                  <div class="mask-layer">
                    <i class="icon" @click="removeImg(index, idx, idxb)"></i>
                  </div>
                </div>

                <div :class="['add-box',{'margin-top': dd.imgData.length > 4}]">
                  <input class="file" type="file" multiple  accept="image/*" @change="changeFile($event,index,idx)">
                  <div class="add" v-if="dd.imgData.length < 3">
                    <i class="icon"></i>
                    <i class="icon"></i>
                  </div>
                </div>
              </div>
            </div>

          </div>          

        </div>   
      </div>
    </div>

    <!--    <div class="no-name-tick">-->
    <!--      <input type="checkbox" v-model="isNoName"><span>匿名評價</span>-->
    <!--    </div>-->

    <div v-if="!ifSubmit" class="dm-btn" @click="postComment()">
      {{ $t(`${lang}.SubmitComment`) }}
    </div>

    <div v-else class="dm-btn bg-color">
      {{ $t(`${lang}.audit`) }}
    </div>

    <message-box
      v-show="alertBox"
      :title="alertBoxInfo.title"
      :message="alertBoxInfo.message"
      type="one"
      @done="alertBox = false"
    />
  </div>

  
</template>

<script>
import Moment from 'moment'
import returnRefundPolicyVue from '../../policies/return-refund-policy.vue'
const lang = 'personal.doComment'
export default {
  name: 'OrderComment',
  data() {
    return {
      lang,
      info: {},
      data: [],
      oid: this.$route.query.orderId,
      loading: true,
      isNoName: false,
      alertBox: false,
      alertBoxInfo: {
        // title: this.$LANGUAGE.personal.doComment.tips,
        // message: this.$LANGUAGE.personal.doComment.msg
      },
      imgs: [],
      ifShow: [],
      total_count: 0,
      orderComments: {
        grade: 0
      },
      styleId: '',
      typeId: '',
      ifSubmit: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.getComment();
      this.getData()
    })
  },
  methods: {
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
        if (groups.hasOwnProperty(good.joinCartTime)) {
          // 将数据处理为直接可用的数据
          good.detailSpecs = JSON.parse(good.detailSpecs || '[]')
          // good.detailSpecs = JSON.parse(good.detailSpecs || '[]')
          //   .map(item => {
          //     return item.value;
          //   })
          //   .join(' / ');
          groups[good.joinCartTime].data.push(good)
        } else {
          const newGroup = {
            id: `${good.orderId}-${good.joinCartTime}`,
            image: good.goodsImages,
            groupType: good.groupType,
            // groupTypeText: this.$t(`${lang}.singleProduct`),
            goodsName: good.goodsName
          }

          if ([null, 0, '0'].includes(good.groupType)) {
            // 单品
            newGroup.groupType = 0
            // newGroup.groupTypeText = this.$t(`${lang}.singleProduct`)
          }
          if (good.groupType === 1) {
            // 對戒
            newGroup.groupType = 1
            newGroup.groupTypeText = this.$t(`${lang}.pairRing`)
            newGroup.goodsName =
              good.ringName || this.$t(`${lang}.defaultPairRing`)
            newGroup.image = good.ringImg || '/marriage-ring/default.png'
          }
          if (good.groupType === 2) {
            // 定制
            newGroup.groupType = 2
            newGroup.groupTypeText = this.$t(`${lang}.diy`)
          }

          // 将数据处理为直接可用的数据
          good.detailSpecs = JSON.parse(good.detailSpecs || '[]')
          // good.detailSpecs = JSON.parse(good.detailSpecs || '[]')
          //   .map(item => {
          //     return item.value;
          //   })
          //   .join(' / ');

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
          [null, 0, '0'].includes(result[n].groupType) &&
          result[n].data[0].categoryId === 1
        ) {
          // 单品钻石
          result.splice(n, 1)
        }
      }

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

      return result
    },
    getData() {
      const _this = this
      _this.$axios
        .get('/web/member/order/detail', {
          params: {
            orderId: _this.oid
          }
        })
        .then(res => {
          const data = res;
          this.$nuxt.$loading.finish()

          try {
            // if (data.orderStatus !== 5) {
            //   // _this.$toast(_this.lang.cannotComment)
            //   setTimeout(() => {
            //     _this.$router.replace({
            //       name: 'personal-order'
            //     })
            //   }, 2000)
            //   return
            // }

            data.orderTime = Moment(data.orderTime).format(
              'YYYY/MM/DD HH:mm:ss'
            )
            data.payChannelText = data.payChannel
              ? _this.payChannelText(data.payChannel)
              : data.orderStatus > 1
              ? _this.$t(`${lang}.cableTransfer`)
              : ''
            data.payTime = data.payTime
              ? Moment(data.payTime).format('YYYY/MM/DD HH:mm:ss')
              : ''

            let allDetails = []

            data.item = _this.dealDetailsData(data.data.details)
            allDetails = allDetails.concat(data.item)

            // data.allDetails = allDetails
            data.allDetails = allDetails.map(item => {
              var itemData = item.data;
              itemData.map(o => {
                o.commentsLevel = 5
                o.commentsDesc = ''
                o.imgData = []
                return o
              })

                return item
            })

            _this.info = data

            console.log('_this.info',_this.info)
            if(_this.orderComments){
              var datas = _this.info.allDetails[0].data,
              len = datas.length,
              len2 = _this.orderComments.length;

              for(var c=0; c<len; c++){
                for(var d=0; d<len2; d++){
                  if(datas[c].goodsId == _this.orderComments[d]['style_id']){
                    datas[c].commentsLevel = _this.orderComments[d].grade
                    datas[c].commentsDesc = _this.orderComments[d].content
                    datas[c]['created_at'] = _this.orderComments[d]['created_at']
                    datas[c].username = _this.orderComments[d].username

                    if(_this.orderComments[d].images){
                      var images = [];
                      var imgD = (_this.orderComments[d].images).split(',');

                      for(let f=0; f<imgD.length; f++){
                        var item = {};
                        item.url = imgD[f];
                        images.push(item)
                      }

                      datas[c].imgData = images;
                    }
                    
                    break
                  }
                }
              }
            }

          } catch (e) {
            console.error(e)
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
    postComment() {
      const allDetails = JSON.parse(JSON.stringify(this.info.allDetails));
      var paramsData = [], hasComment=false;

      allDetails.forEach(group => {
        group.data.forEach(good => {
          var list = {
            'order_id': '',
            'type_id': '',
            'style_id': '',
            'grade': '',
            'content': '',
            'images': [],
          };

          // 商品里面的组成物品
          list['order_id'] = good.orderId;
          list['type_id'] = good.categoryId;
          list['style_id'] = good.goodsId;
          list['grade'] = good.commentsLevel;
          list['content'] = good.commentsDesc;

          // if(good.commentsDesc){
          //   hasComment = true
          // }

          good.imgData.forEach(o => {
            list['images'].push(o.url)
          })

          paramsData.push(list);
        })
      })

      // if(!hasComment){
      //   this.$successMessage(this.$t(`${lang}.cannotEmpty`))
      //   return
      // }

      for(var t=0; t<paramsData.length; t++){
        if(!paramsData[t].content){
          paramsData[t].content = this.$t(`${lang}.defaultPraise`)
        }
      }

      this.$axios
      .post('/web/member/order/comment', {'params': paramsData})
      .then(res => {
        this.ifSubmit = true;
        this.$successMessage(this.$t(`${lang}.subTips`))
        // this.$router.replace('/account/orders')
      })
      .catch(err => {
        if (!err.response) {
          this.$message.error(err.message)
        } else {
          // console.log(err)
        }
      })
      
    },
    changeFile(obj,j,k) {
      var that = this,file = obj.target.files;

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

      var imgData = [],ii = 0;
  
      for(let i of file){
        this.$nuxt.$loading.start()

        var fq = new window.FormData();
        fq.set('file', i, i.name)

        this.$axios.post("/web/file/images",fq)
        .then(res => {
          res.data.ifShow = false;
          imgData.push(res.data)
          resg()
        })
        .catch(err => {
          // imgData.push('')
          resg()
        })
      }

      function resg() {
        ii+=1;
        if(ii === file.length){
          finish()
        }else{
          // 上传失败
        }
      }

      function finish() {
        that.$nuxt.$loading.finish()

        if(imgData.length){
          if(imgData.length > 3){
            imgData.length = 3;
          }

          for(let m=0; m<imgData.length; m++){
            var len = that.info.allDetails[j].data[k].imgData.length;
            if(len < 3){
              that.info.allDetails[j].data[k].imgData.push(imgData[m])
              that.ifShow.push(0)
              // console.log(997,that.info.allDetails[j].data[k].imgData)
            }
          }
        }

        obj.target.value = null;
      }
    },
    // 鼠标移入显示删除图标
    showMaskLayer(f) {
      this.$refs.imgBox.forEach(t => {
        var ch = t.getElementsByClassName('mask-layer')[0];
        ch.style.display = 'none';  
      })

      var div = this.$refs.imgBox[f];
      var child = div.getElementsByClassName('mask-layer')[0];
      child.style.display = 'block'; 
    },
    // 鼠标移出隐藏删除图标
    hideMaskLayer() {
      this.$refs.imgBox.forEach(t => {
        var ch = t.getElementsByClassName('mask-layer')[0];
        ch.style.display = 'none';  
      })
    },
    // 删除上传图片
    removeImg(j,k,i) {
      var that = this;
      that.info.allDetails[j].data[k].imgData.splice(i,1)
    },
    getComment() {
      var _this = this;

      this.$axios({
        method: 'get',
        url: '/web/member/order/comment-list',
        params: {
          'order_id': _this.$route.query.orderId
        }
      })
      .then(res => {
        _this.total_count = res.data.data.length;
        _this.orderComments = res.data.data;
      })
    }
  }
}
</script>

<style scoped lang="less">
.do-comment {
  width: 936px;
  text-align: left;
  .dm-title {
    height: 17px;
    line-height: 17px;
    font-size: 16px;
    color: rgba(242, 155, 135, 1);
    margin-bottom: 20px;
  }
  .m-title {
    width: 936px;
    height: 34px;
    line-height: 34px;
    padding-left: 20px;
    color: #333;
    font-size: 14px;
    background: rgba(254, 230, 226, 1);
    margin-bottom: 10px;
    span:nth-child(1) {
      margin-right: 503px;
    }
  }
  .dm-top-line {
    width: 936px;
    height: 1px;
    background: rgba(230, 230, 230, 1);
    margin-bottom: 20px;
  }
  .dm-blocks {
    width: 936px;
    min-height: 200px;
    .dm-block {
      width: 936px;
      
      .left-dm {
        width: 936px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 372+12+69px;
        color: #999;
        font-size: 14px;

        .left-dm-star {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          .label {
            width: 12+69px;
            line-height: 15px;
            height: 15px;
          }
          .content {
            width: 372px;
            i {
              display: inline-block;
              width: 19px;
              height: 19px;
              line-height: 19px;
              font-size: 19px;
              overflow: hidden;
              cursor: pointer;
              margin-right: 3px;
              color: #f29b87;
            }
          }
        }
        .left-dm-desc {
          display: flex;
          margin-bottom: 20px;
          .label {
            width: 12+69px;
          }
          .content {
            width: 372px;
            height: 100px;
            textarea {
              width: 372px;
              height: 100px;
              -webkit-appearance: none;
              border: 1px solid rgba(153, 153, 153, 1);
              outline: 0;
              resize: none;
              padding: 10px 15px;
            }
            textarea::placeholder {
              font-size: 12px;
              color: #bbb;
            }
          }
        }
      }
      .right-dm {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 0;
        border-bottom: 1px solid rgba(230, 230, 230, 1);

        .rdm-box {
          box-sizing: content-box;
          width: 400px;
          overflow: hidden;
          display: flex;
          // flex-wrap: wrap;
          .rdm-img {
            width: 120px;
            height: 120px;
            border: 1px solid rgba(230, 230, 230, 1);
            margin-right: 20px;
            box-sizing: border-box;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .rdm-desc {
            width: 261px;
            .rdm-name {
              width: 261px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              margin-bottom: 10px;
              color: #666;
              font-size: 14px;
              margin-top: 6px;
            }
            .rdm-sku {
              font-size: 12px;
              color: #999;
              height: 12px;
              line-height: 12px;
              margin-bottom: 22px;
            }
            .rdm-details {
              width: 261px;
              display: flex;
              flex-wrap: wrap;
              span {
                display: inline-block;
                width: 130px;
                font-size: 12px;
                color: #999;
                height: 12px;
                line-height: 12px;
                margin-top: 9px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              }
              span:nth-child(1),
              span:nth-child(2) {
                margin: 0;
              }
            }
          }
        }
        .rdm-box:nth-child(2) {
          border-top: 1px solid rgba(230, 230, 230, 1);
          margin: 0;
          padding: 20px 0 0;
        }
      }
    }
  }
  .no-name-tick {
    color: #999;
    font-size: 14px;
    margin-bottom: 38px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    input {
      margin-right: 15px;
    }
    span {
      line-height: 14px;
    }
  }
  .dm-btn {
    width: 140px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    text-align: center;
    color: #fff;
    background: rgba(221, 177, 170, 1);
    cursor: pointer;
    margin: 20px auto 50px;
  }

  .dm-btn.bg-color{
    background-color: #bbb;
    cursor: not-allowed;
  }
}

.uploading-box{
  display: flex;
  justify-content: space-between;
  width: 100%;

  .text{
    flex-shrink: 0;
    width: 81px;
  }

  .uploading-img{
    flex-grow: 1;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-left: 26px;

    .img-box{
      width: 60px !important;
      height: 60px;
      margin: 0 20px 0 0;
      flex-shrink: 0;

      img{
        width: 100%;
        height: 100%;
      }
    }
    .img-box:nth-of-type(n+5){
      margin-top: 20px;
    }

    .mask-layer{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      display: none;

      .icon{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 24px;
        background: url(../../../static/icon/del-r.png) no-repeat center;
        background-size: 100% 100%;
      }
    }

    .add-box{
      width: 60px;
      height: 60px;
      overflow: hidden;
      position: relative;

      .file{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 120px;
        height: 120px;
        opacity: 0;
      }

      .add{
        width: 100%;
        height: 100%;
        border: 1px solid #b2b2b2;
        box-sizing: border-box ;
        cursor: pointer;

        .icon{
          width: 20px;
          height: 1px;
          background-color: #b2b2b2;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .icon:last-child{
          transform: translate(-50%, -50%) rotate(90deg);
        }
      }
    }
  }
}

.margin-top{
  margin-top: 20px;
}

</style>
