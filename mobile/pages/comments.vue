<template>
  <div class="list-page all-comments">
    <div class="comments-title title-with-back">
      {{ lang.allComments }}({{ total_count }})
      <div class="go-back-btn" @click="goBack($router)">
        <span> {{ lang.back }}</span>
      </div>
    </div>
    <div class="comments-stars">
      <div class="about-stars">
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
      </div>
      <span>{{ avgLevel }}</span>
    </div>
    <div class="comments-btn">
      <div :class="{ active: commentType==0 }" @click="switchType(0)">
        {{ lang.allComments }}
      </div>
      <div :class="{ active: commentType==5 }" @click="switchType(5)">
        {{ lang.fiveStarComments }}
      </div>
      <div :class="{ active: commentType==9 }" @click="switchType(9)">
        {{ lang.hasImgComments }}
      </div>
    </div>
    <div class="comments-box">
      <div v-for="(item, index) in commentData" v-if="item.ifShow" :key="index" class="single-comment">
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

        <div v-if="1" class="pic-box">
          <div v-for="(im, idx) in item.images" :key="idx" class="comment-pic" @click="showBigImg(im.img, im.type, index, idx)">
            <img :src="im.img"  alt="">
          </div>
        </div>

        <div v-if="item.remark" class="customer-service-reply">
          [{{ lang.commentsReply }}] {{ item.remark }}
          <div class="triangle"></div>
        </div>

      </div>
      <bdd-empty
        v-if="noListData"
        :type="'comment'"
        @toShopping="toShopping"
      ></bdd-empty>
    </div>

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
  </div>
</template>

<script>
import Moment from 'moment'
import List from '@/mixins/list.js'
export default {
  layout: 'no-bar',
  mixins: [List],
  data() {
    return {
      lang: this.LANGUAGE.comments,
      listMethod: 'get',
      // listUrl: `/wap/goodsComments/getGoodsComments`,
      activeIds: [],
      total_count: 0,
      commentData: [],
      // commentType: 0-全部，5-五星，9-有图
      commentType: 0,
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
    this.getComment();
  },
  methods: {
    toShopping() {
      this.$router.push({
        name: 'index'
      })
    },
    switchType(a) {
      var _this = this, total = 0;
      _this.commentType = a;

      if(a == 0){
        _this.commentData.forEach((o,i) => {
          o.ifShow = true
        })
        total = _this.commentData.length
      }else if(a == 5){
        _this.commentData.forEach((o,i) => {
          if(o.grade == 5){
            o.ifShow = true;
            total+=1;
          }else{
            o.ifShow = false
          }
        })
      }else if(a == 9){
        _this.commentData.forEach((o,i) => {
          if(o.images){
            o.ifShow = true;
            total+=1;
          }else{
            o.ifShow = false
          }
        })
      }

      _this.total_count = total;
    },
    isActive(id) {
      return this.activeIds.indexOf(id) > -1
    },
    showComment(id) {
      const activeIds = JSON.parse(JSON.stringify(this.activeIds))
      const start = activeIds.indexOf(id)
      // console.log('start========>', start)
      if (start > -1) {
        activeIds.splice(start, 1)
      } else {
        activeIds.push(id)
      }
      this.activeIds = activeIds
    },
    getComment() {
      var _this = this;

      this.$axios({
        method: 'get',
        url: 'web/goods/style/comment',
        params: {
          'style_id': _this.$route.query['style_id'],
          'type_id': _this.$route.query['type_id']
        }
      })
      .then(res => {
        _this.total_count = res.data.length;
        _this.commentData = res.data;

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

<style scoped lang="less">
.all-comments {
  position: relative;
  width: 100%;
  height: 100%;
  background: #eeeeee;

  .comments-stars {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 22px 0;
    background: #ffffff;
    box-sizing: border-box;
    .about-stars {
      display: flex;
      height: 14px;
      align-items: center;
      i {
        display: block;
        font-size: 15px;
        line-height: 14px;
        margin-right: 9px;
      }
      .light {
        color: @mcPink;
      }
      .dark {
        color: #ccc;
      }
    }
    span {
      font-size: 16px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
  .comments-btn {
    width: 100%;
    height: 50px;
    background: rgba(246, 246, 246, 1);
    display: flex;
    align-items: center;
    padding-left: 22px;
    box-sizing: border-box;
    div {
      /*width: 65px;*/
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(221, 221, 221, 1); /*no*/
      border-radius: 5px;
      margin-right: 18px;
      padding: 0 10px;
    }
    .active {
      background: rgba(251, 248, 246, 1);
      border: 1px solid rgba(148, 116, 101, 1); /*no*/
      color: #947465;
    }
  }
  .comments-box {
    min-height: 300px;

    .single-comment {
      text-align: left;
      padding: 16px 22px 16px;
      border-bottom: 6px solid #eeeeee;
      background-color: #ffffff;
      box-sizing: border-box;

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
  }
}

.pic-box{
  width: 100%;
  margin: 14px 0;
  box-sizing: border-box;

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
  content: ' ';
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
  margin-top: 12px;
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