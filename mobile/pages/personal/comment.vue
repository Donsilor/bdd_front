<template>
  <div class="container" v-if="ifShowComment">
    <div class="comment-title">
      {{ lang.clientSay }} <span>({{ total_count }})</span>
    </div>
    <div class="comment-stars">
      <i
        v-for="index in 5"
        :key="index"
        :class="[
          `iconfont`,
          `iconxing`,
          { light: index <= avgLevel },
          { dark: index > avgLevel }
        ]"
      ></i>
      <span>{{ avgLevel }}</span>
    </div>

    <template v-if="total_count > 0">
      <div v-if="index<3" class="comment-box" v-for="(item, index) in commentData" :key="index">
        <div class="user-and-stars">
          <div class="client-user">{{ showEmail(item.username) }}</div>
            
          <div class="about-stars">
            <i
              v-for="index in 5"
              :key="index"
              :class="[
                `iconfont`,
                `iconxing`,
                { light: index <= item.grade },
                { dark: index > item.grade }
              ]"
            ></i>
          </div>
        </div>

        <div class="about-time">
          {{ item['created_at'] }}
        </div>

        <div class="comment-content ow-h2">
          {{ item.content }}
        </div>

        <div class="pic-box">
          <div v-for="(im, idx) in item.images" :key="idx" class="comment-pic" @click="showBigImg(im.img, im.type, index, idx)">
            <img :src="im.img" alt="">
          </div>
        </div>

        <div v-if="item.remark" class="customer-service-reply">
          [{{ lang.commentsReply }}] {{ item.remark }}
          <div class="triangle"></div>
        </div>

      </div>
      <div
        v-if="commentData.length > 3"
        class="comment-btn"
        @click="$router.push(`/comments?style_id=${styleId}&type_id=${typeId}`)"
      >
        {{ lang.allComments }} >
      </div>
    </template>
    <template v-else>
      <div class="no-comment">
        {{ lang.noComments }}
      </div>
    </template>

    <div v-if="ifShowPop" class="popup">
      <div class="big-wrap">
        <i class="iconfont el-icon-error" @click="closeBigImg()"></i>
        <div class="img-box-t">
          <img :class="[imgType == 1 ? 'img-type-a' : 'img-type-b']" :src="bigImgSrc" alt="">
        </div>
        <div class="btn-box clf">
          <span class="icon" :class="{'unable': imgIdx < 1}" @click="imgLeft()">
            <i class="iconfont el-icon-arrow-left"></i>
          </span>
          <span class="icon" :class="{'unable': imgIdx >= (groupLength-1)}" @click="imgRight()">
            <i class="iconfont el-icon-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Moment from 'moment'
export default {
  name: 'Comment',
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
      lang: this.LANGUAGE.detailCommons,
      listMethod: 'get',
      listUrl: '/web/goods/style/comment',
      page_size: 13,
      // 显示类型(1-所有，2-五星好评)
      shouType: 1,
      total_count: 0,
      commentData: [],
      styleId: '',
      typeId: '',
      showMore: false,
      ifLoading: false,
      ifShowPop: false,
      bigImgSrc: '',
      imgType: 0,
      imgIndex: -1,
      imgIdx: -1,
      groupLength: 0,
      ifShowComment: false
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
    // 筛选评价内容
    filter(a) {
      var _this = this;

      _this.commentData.forEach(o => {
        console.log(o.grade)
        if(o.grade < a){
          o.ifShow = false
        }else{
          o.ifShow = true
        }
      })

      _this['total_count'] = _this.commentData.length
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
        _this.total_count = res.data.length
        _this.commentData = res.data

        if(res.data.length){
          this.ifShowComment = true
        }

        _this.commentData.forEach((item, index) => {
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

          _this.commentData[d]['ifShow'] = true;
        }
      })
      .catch(err => {
        console.log(err)
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

<style lang="less">
.container {
    width: 100%;
    padding: 30px 15px 15px;
    text-align: left;
    border-top: 8px solid rgba(245, 245, 245, 1);
    border-bottom: 8px solid rgba(245, 245, 245, 1);
    .comment-title {
      border: 1px solid origin;
      font-size: 16px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 16px;
      margin-bottom: 16px;
      span {
        font-size: 14px;
        color: rgba(102, 102, 102, 1);
      }
    }
    .comment-stars {
      display: flex;
      height: 30px;
      border-bottom: 1px solid #ddd;
      span {
        font-size: 16px;
        line-height: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      i {
        display: block;
        font-size: 15px;
        line-height: 15px;
        margin-right: 9px;
      }
      .light {
        color: @mcPink;
      }
      .dark {
        color: #ccc;
      }
    }
    .comment-box {
      padding: 20px 0;
      border-bottom: 1px solid #ddd;
      .user-and-stars{
        margin-bottom: 10px;

        .client-user {
          float: left;
          width: 120px;
          height: 20px;
          font-size: 12px;
          line-height: 20px;
          font-weight: 400;
          color: #333;

          &::before {
            content: " ";
            float: left;
            width: 20px;
            height: 20px;
            background: url(/personal/diamondpink.png) no-repeat center;
            background-size: 100% 100%;
            margin: -2px 4px 0 0;
          }
        }

        .about-stars {
          float: right;
          display: flex;
          height: 12px;
          align-items: center;
          i {
            display: block;
            font-size: 11px;
            line-height: 12px;
            margin-left: 7px;
          }
          .light {
            color: @mcPink;
          }
          .dark {
            color: #ccc;
          }
        }
      }
      .user-and-stars::after{
        display: block;
        content: '';
        height: 0;
        opacity: 0;
        visibility: hidden;
        clear: both;
      }

      .comment-content {
        font-size: 13px;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 18px;
        margin-bottom: 20px;
      }

      .about-time{
        margin-bottom: 20px;
        text-align: right;
        color: #999;
      }
    }
    .comment-btn {
      font-size: 14px;
      color: rgba(102, 102, 102, 1);
      text-align: center;
      margin: 20px 0 6px;
    }
    .no-comment {
      padding: 20px 0 10px 0;
      font-size: 14px;
      line-height: 14px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      text-align: center;
    }
  }

.pic-box{
  width: 500px;
  margin-bottom: 20px;

  .comment-pic{
    width: 60px;
    height: 60px;
    margin-right: 20px;
    position: relative;
    float: left;
    overflow: hidden;
    
    img{
      width: 100%;
      height: 100%;
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

.customer-service-reply {
  position: relative;
  width: 100%;
  height: 34px;
  line-height: 34px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(148, 116, 101, 1);
  background: rgba(248, 244, 241, 0.8);
  border-radius: 6px;
  padding: 0 4%;
  margin-top: 14px;
  .triangle {
    position: absolute;
    top: 0;
    left: 19px;
    width: 0;
    height: 0;
    border-bottom: 8px solid rgba(248, 244, 241, 1);
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    transform: translateY(-100%);
  }
}

.popup{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 22;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  .big-wrap{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 280px;

    .el-icon-error{
      position: absolute;
      right: -18px;
      top: -18px;
      font-size: 32px;
      color: #fff;
    }

    .img-box-t{
      position: relative;
      width: 280px;
      height: 280px;
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
      width: 220px;
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
        float: left;

        .iconfont{
          font-size: 20px;
          line-height: 30px;
        }

        &:last-child{
          float: right;
        }

        &.unable{
          background-color: #ccc;
          cursor: inherit;
        }
      }
    }
  }
}
</style>