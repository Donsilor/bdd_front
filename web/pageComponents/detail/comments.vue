<template>
  <section v-if="commentData.length" class="comments">
    <h2 class="section-name">
      {{ $t(`${lang}.customerReviews`) }}（{{ total_count || 0 }}）
    </h2>
    <h3 class="average-score">
      <span class="num">{{ avgLevel }}</span>
      <div class="stars">
        <i
          v-for="n in 5"
          :key="n"
          :class="['iconfont', n <= avgLevel ? 'iconxing' : 'iconxing1']"
        ></i>
      </div>
    </h3>
    <div class="tab">
      <label>
        <input type="radio" name="showType" checked="checked" @click="filter(0)"/>
        <span>{{ $t(`${lang}.allReviews`) }}</span>
      </label>
      <label>
        <input type="radio" name="showType" @click="filter(5)"/>
        <span >{{ $t(`${lang}.fiveStarReviews`) }}</span>
      </label>
      <label>
        <input type="radio" name="showType" @click="filter(9)"/>
        <span >{{ $t(`${lang}.hasImgReviews`) }}</span>
      </label>
    </div>
   <div class="list-data">
      <div v-show="item.ifShow && index<=showNum" v-for="(item, index) in commentData" :key="index" class="item">
        <div class="item-l">
          <div class="user-name">{{ item.username }}</div>
          <p class="comment-time">{{ item['created_at'] }}</p>
        </div>
        
        <div class="item-r">
          <div class="stars">
            <i
              v-for="n in 5"
              :key="n"
              :class="[
                'iconfont',
                n <= item.grade ? 'iconxing' : 'iconxing1'
              ]"
            ></i>
          </div>
          <p class="comment-desc">{{ item.content }}</p>
           <p v-if="item.remark" class="comment-reply">
            {{ $t(`${lang}.BDDReply`) }}：{{ item.remark }}
          </p>
          <div class="pic-box">
            <div v-for="(im, idx) in item.images" :key="idx" class="comment-pic">
              <div class="sm-box">
                <img :src="im.img" alt="" @click="showBigImg(im.img, im.type, index, idx)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="total_count > 5" :class="['comment-more',{'active': ifShowMore }]" @click="getMore()"></div>

    <div v-show="commentData.length == 0" class="no-more-data">
      <div class="no-goods-img">
        <img src="../../static/search/product.png" alt="">
      </div>
      <div class="no-more-row text-two">
        <span>{{ $t(`${lang}.noComment`) }}</span>
      </div>
    </div>

    <!-- <no-more-data v-show="commentData.length == 0" :dataVal = "2"></no-more-data> -->
    <!-- <bdd-empty v-show="noListData" :type="'comment'"></bdd-empty> -->
    
    <div v-if="ifShowPop" class="popup">
      <div class="big-wrap">
        <i class="iconfont el-icon-error" @click="closeBigImg()"></i>
        <div class="img-box-t">
          <img :class="[imgType == 1 ? 'img-type-a' : 'img-type-b']" :src="bigImgSrc" alt="">
        </div>
        <div class="btn-box clf">
          <span class="icon fl" :class="{'unable': imgIdx < 1}" @click="imgLeft()">
            <i class="iconfont el-icon-arrow-left"></i>
          </span>
          <span class="icon fr" :class="{'unable': imgIdx >= (groupLength-1)}" @click="imgRight()">
            <i class="iconfont el-icon-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Moment from 'moment'
const lang = 'detail'
export default {
  props: {
    // 单品时使用
    'style_id': {
      type: [Number, String],
      required: false,
      default() {
        return ''
      }
    },
    'type_id': {
      type: [Number, String],
      required: false,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      lang,
      listMethod: 'get',
      listUrl: '/web/goods/style/comment',
      page_size: 13,
      showType: 0,
      total_count: 0,
      commentData: [],
      styleId: '',
      typeId: '',
      showMore: false,
      ifLoading: false,
      ifShowMore: false,
      showNum: 4,
      ifShowPop: false,
      bigImgSrc: '',
      imgType: 0,
      imgIndex: -1,
      imgIdx: -1,
      groupLength: 0
    }
  },
  computed:{
    avgLevel() {
      var total_star=0, avg=0;
      if(this.commentData.length){
        this.commentData.forEach(o => {
          total_star +=  o.grade-0
        })

        avg = Math.ceil(total_star/(this.commentData.length))
      }
      return avg
    }
  },
  mounted() {
    var _this = this;
    this.styleId = this['style_id']
    this.typeId = this['type_id']
    
    this.getComment();
  },
  methods: {
    // 处理用户账号
    showUser(user) {
      console.log(user)
    },
    // 展示更多
    getMore() {
      this.ifShowMore = !this.ifShowMore;

      if(this.ifShowMore){
        this.showNum = 9999
      }else{
        this.filter(this.showType)
      }
    },
    // 筛选评价内容
    filter(a) {
      // a = 0：全部, 5：五星, 9：带图  
      var _this = this, total = 0;
      _this.showType = a;
      _this.total_count = 0;
      _this.ifShowMore = false;

      if(a == 0){
        total = _this.commentData.length;
        _this.showNum = 4;

        _this.commentData.forEach(o => {
          o.ifShow = true
        })
      }else if(a == 5){
        _this.commentData.forEach((p, q) => {
          if(p.grade == 5){
            p.ifShow = true;
            total+=1;

            if(total <= 5){
              _this.showNum = q
            }
          }else{
            p.ifShow = false
          }
        })

      }else if(a == 9){
        _this.commentData.forEach((r, s) => {
          if(r.images){
            r.ifShow = true;
            total+=1;

            if(total <= 5){
              _this.showNum = s
            }
          }else{
            r.ifShow = false
          }
        })
      }

      _this.commentData = JSON.parse(JSON.stringify(_this.commentData))
      _this.total_count = total;
    },
    getComment() {
      var _this = this;

      this.$axios({
        method: 'get',
        url: 'web/goods/style/comment',
        params: {
          'style_id': _this.styleId,
          'type_id': _this.typeId
        }
      })
      .then(res => {
        _this.total_count = res.data.data.length;
        _this.commentData = res.data.data;

        // return
        _this.commentData.forEach((item, index) => {
          var idx = index;
          var time = Number(item['created_at']+'000');
          item['created_at'] = Moment(time).format('YYYY.MM.DD')

          if(item.images){
            var imgs = item.images.split(','), len = imgs.length, arr = [];
            
            for(let c=0; c<len; c++){
              var imgChild = {img: imgs[c],type: 1};
              arr.push(imgChild)
            }

            item.images = arr;
          }
        })

        for(var d=0; d<_this.commentData.length; d++){
          if(_this.commentData[d].images){
            for(var e=0; e<_this.commentData[d].images.length; e++){
              var img = _this.commentData[d].images[e];

              img.imgObj = new Image();
              img.imgObj.src = _this.commentData[d].images[e].img;

              (function(d,e) {
                img.imgObj.onload= function() {
                  if(this.width > this.height) {
                    _this.commentData[d].images[e].type = 2;
                  }
                }
              })(d,e)
            }
          }

          // console.log(_this.commentData)

          _this.commentData[d]['ifShow'] = true;
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
    showBigImg(src, type, i, j) {
      this.ifShowPop = true;
      this.bigImgSrc = src;
      this.imgType = type;
      this.imgIndex = i;
      this.imgIdx = j;
      this.groupLength = this.commentData[this.imgIndex].images.length;
    },
    closeBigImg() {
      this.ifShowPop = false;
      this.bigImgSrc = '';
      this.imgType = 0;
      this.imgIndex = -1;
      this.imgIdx = -1;
      this.groupLength = 0
    },
    imgLeft() {
      if(this.imgIdx > 0){
        this.imgIdx--;
        this.bigImgSrc = this.commentData[this.imgIndex].images[this.imgIdx].img;
        this.imgType = this.commentData[this.imgIndex].images[this.imgIdx].type;
      }
    },
    imgRight() {
      if(this.imgIdx < (this.groupLength - 1)){
        this.imgIdx++;
        this.bigImgSrc = this.commentData[this.imgIndex].images[this.imgIdx].img;
        this.imgType = this.commentData[this.imgIndex].images[this.imgIdx].type;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comments {
  position: relative;
  padding-bottom: 40px;

  .section-name {
    margin-bottom: 9px;
    padding: 0 30px;
    box-sizing: border-box;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .average-score {
    margin-bottom: 25px;
    padding: 0 30px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .num {
      margin-right: 10px;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .stars {
      display: flex;
      align-items: center;

      .iconfont {
        margin-right: 6px;
        font-size: 20px;
        color: #f29b87;
      }
    }
  }
  .tab {
    padding: 0 35px;
    height: 60px;
    box-sizing: border-box;
    background: rgba(248, 248, 248, 1);
    display: flex;
    align-items: center;
    justify-content: flex-start;

    label {
      margin-right: 34px;
      input[type='radio'] {
        -webkit-appearance: default;
        -moz-appearance: default;
        appearance: default;
        position: relative;
        display: inline-block;
        top: -2px;
        margin-right: 6px;
        vertical-align: middle;
        width: 14px;
        height: 14px;
        border: 1px solid #bbbbbb;
        outline: none;
        cursor: pointer;
        border-radius: 50%;
        box-sizing: border-box;
      }
      input[type='radio']:after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        display: block;
        left: 50%;
        top: 50%;
        margin: auto;
        background: #f29b87;
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: all 0.2s linear;
      }
      input[type='radio']:checked:after {
        transform: translate(-50%, -50%) scale(1);
      }

      span {
        font-size: 14px;
      }
    }
  }
  .list-data {
    .item {
      padding: 30px;
      border-bottom: 1px solid #e6e6e6;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      .item-l{
        width: 80px;

        .user-name{
          width: 80px;
          height: 80px;
          background-color: #f29b87;
          border-radius: 50%;
          text-align: center;
          line-height: 80px;
          color: #333;
        }

        .comment-time {
          margin-bottom: 20px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          text-align: center;
          margin-top: 20px;
        }
      }

      .item-r{
        margin-left: 50px;

        .stars {
          margin-bottom: 14px;
          display: flex;
          align-items: center;

          .iconfont {
            margin-right: 6px;
            font-size: 20px;
            color: #f29b87;
          }
        }

        .comment-desc {
          font-size: 16px;
          font-family: Microsoft YaHei;
          color: #666;
          line-height: 20px;
          margin-bottom: 10px;
        }

        .comment-reply {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(139, 118, 108, 1);
        }

        .pic-box{
          width: 500px;
          margin-top: 20px;

          .comment-pic{
            width: 60px;
            height: 60px;
            margin-right: 30px;
            position: relative;
            z-index: 1;
            float: left;

            .sm-box{
              position: absolute;
              top: 0;
              left: 0;
              z-index: 2;
              width: 100%;
              height: 100%;
              overflow: hidden;

              img{
                width: 100%;
                height: 100%;
              }
            }

            .big-box{
              position: absolute;
              top: 50%;
              left: 50%;
              z-index: 6;
              width: 300px;
              height: 300px;
              transform: translate(-50%, -50%);
              overflow: hidden;
              display: none;
              
              .img-type-a{
                position: absolute;
                width: 100%;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
              }

              .img-type-b{
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                height: 100%;
                width: auto;
              }
            }
          }
        }

        .pic-box::after{
          display: block;
          content: '.';
          opacity: 0;
          visibility: hidden;
          height: 0;
          clear: both;
        }
      }
    }
  }

  .comment-more{
    width: 32px;
    height: 32px;
    margin: 40px auto 0;
    background: url(../../static/icon/more.png) no-repeat center;
    background-size: 100% 100%;
    cursor: pointer;
  }
  .comment-more.active{
    transform: rotate(180deg);
  }

  .no-more-data {
    // height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 40px 0 20px;

    .iconfont {
      margin-right: 8px;
      font-size: 16px;
      color: rgba(153, 153, 153, 1);
    }
    span {
      height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }

  .no-more-row{
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 18px;
  }
  .no-more-row .under-line{
    color: #e4c1bb;
    margin-top: 8px;
    text-decoration: underline;
    cursor: pointer;
  }
  .no-more-img{
    text-align: center;
    width: 100%;
  }

  .no-goods-img{
    width: 246px;
    height: 246px;
  }

  .no-more-data .text-two{
    margin-top: 20px;
  }
  .type-a{
    margin-top: 60px;
  }

  .popup{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1202;

    .big-wrap{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 300px;

      .el-icon-error{
        position: absolute;
        right: -18px;
        top: -18px;
        font-size: 32px;
        color: #fff;
      }

      .img-box-t{
        position: relative;
        width: 300px;
        height: 300px;
        overflow: hidden;
        padding: 2px;
        box-sizing: border-box;
        
        .img-type-a{
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 100%;
          width: auto;
        }

        .img-type-b{
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          height: auto;
        }
      }

      .btn-box{
        width: 160px;
        height: 30px;
        margin: 20px auto 0;
        line-height: 30px;
        
        .icon{
          width: 30px;
          height: 30px;
          background-color: #fff;
          border-radius: 50%;
          cursor: pointer;
          text-align: center;
          font-size: 0;

          .iconfont{
            font-size: 20px;
            line-height: 30px;
          }

          &.unable{
            background-color: #ccc;
            cursor: inherit;
          }
        }
      }
    }
  }
}

</style>
