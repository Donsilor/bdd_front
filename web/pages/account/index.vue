<template>
  <div class="personal">
    <div class="container">
      <div class="left-box">
        <div class="userTypeImg">
          <img :src="headerImage" />
        </div>
        <div class="bddVip">
          <span>{{ $t(`${lang}.index.bddco`) }}</span>
          <img
            src="../../static/personal/edit.png"
            class="editBtn"
            @click="toPersonalAccount"
          />
        </div>
        <!-- <div v-if="language === 'zh_CN'" class="email">{{showMobile}}</div> -->
        <div class="email">{{ showEmail }}</div>
        <div class="middle-line" />
        <div class="link-box">
          <nuxt-link
            v-for="(item, index) in leftList"
            :key="index"
            :to="{ path: item.url }"
          >
            <div class="link">
              <img :src="item.img" class="link-icon" />
              <span class="link-name">{{ item.name }}</span>
            </div>
          </nuxt-link>
        </div>
        <div class="middle-line" />
      </div>
      <div class="right-box">
        <div class="header-title">
          <img data-v-accc3fe4="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nhxg7wAAANhJREFUOI3N0T1KA1EUBtCTYRS00gVYWWcDrsEFuIIZprdxEUKaCPOwFrSwcwn2cQmBbCBKgmh+LJw04+jEPAx+7X3f4T4u/z2dsiyvcIr3CGcHD3meFykKnOExAjzBLYoUrxhgtImUZZkQwgBTSLDAQcR2qv4S0togQQ9HLcAM5xjWB3UQJnhpAec+f/YldXCBixbsxyQx5a2ATUe5w3HD2z6ufwsucY/DhrdPayzYCN6sU/wuf3KUDsaRzrhypNhDF8+bSCEEVX9/BZa4xFvEhrsIEf0t5gP+JCj0zwrpugAAAABJRU5ErkJggg==">
          <h3 data-v-accc3fe4="">{{ $t(`${langs}.title`) }}</h3>
        </div>
        <!--        <router-view v-if="token" />-->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
const lang = 'personal'
const langs = 'personal.account'
export default {
  name: 'Index',
  middleware: 'mustLogin',
  data() {
    return {
      lang,
      langs,
      token: '',
      leftList: [
        {
          img: require('../../static/personal/order.png'),
          url: '/account/orders',
          name: this.$t(`${lang}.index.order`)
        },
        {
          img: require('../../static/personal/account.png'),
          url: '/account/settings',
          name: this.$t(`${lang}.index.account`)
        },
        {
          img: require('../../static/personal/account.png'),
          url: '/account/coupon',
          name: this.$t(`${lang}.index.coupon`)
        },
        // {
        //   img: require('../../static/images/personal/comment.png'),
        //   url: '/account/comment',
        //   name: this.$t(`${lang}.index.comment`)
        // },
        // {
        //   img: require('../../static/personal/wish.png'),
        //   url: '/account/wish-list',
        //   name: this.$t(`${lang}.index.wish`)
        // },
        // {
        //   img: require('../../static/personal/diamondContrast.png'),
        //   url: '/account/diamond-compare',
        //   name: this.$t(`${lang}.index.compare`)
        // }
      ],
      language:''
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    showMobile() {
      const hidenLength = 4
      let result = this.userInfo.username
      if(result){
        result=result.replace(result.substr(3, 4),"****")
      }
      return result
    },
    showEmail() {
      const hidenLength = 4
      let result = this.userInfo.username
      if (result) {
        result = result.split('@')
        if (result[0].length < hidenLength + 1) {
          let newstr = ''
          for (let n = 0; n < result[0].length; n++) {
            newstr += '*'
          }
          result[0] = newstr
        } else {
          result[0] =
            result[0].slice(0, result[0].length - hidenLength) +
            new Array(hidenLength).fill('*').join('')
        }
      } else {
        result = []
      }
      if (!result.length) {
        result = ''
      } else {
        result = result.join('@')
      }
      return result
    },
    headerImage() {
      const header = {
        1: require('../../static/personal/account/men.png'),
        2: require('../../static/personal/account/women.png')
      }
      return (
        header[this.userInfo.gender] ||
        require('../../static/personal/account/unknown.png')
      )
    }
  },
  mounted() {
    this.language = this.$store.state.language
  },
  methods: {
    toPersonalAccount() {
      this.$router.replace(`/account/settings`)
    }
  }
}
</script>

<style scoped lang="less">
.header-title {
  text-align: left;
  margin-bottom: 40px;
}
.header-title img {
  float: left;
  width: 26px;
  height: 26px;
}
.header-title h3 {
  display: inline-block;
  margin-left: 20px;
  font-size: 24px;
  line-height: 26px;
  font-weight: 400;
  color: #f29b87;
}
.personal {
  max-width: 1360px;
  min-width: 1200px;
  width: 100%;
  min-height: 540px;
  margin: 0 auto;
  padding: 20px 40px;
  background: #f5f3f1;
  box-sizing: border-box;
  /*border-top: 1px solid #000000;*/
  .container {
    width: 100%;
    display: flex;
    .left-box {
      width: 264px;
      height: 540px;
      background: rgba(255, 255, 255, 1);
      padding: 40px 30px 0;
      box-sizing: border-box;
      .userTypeImg {
        width: 100px;
        height: 100px;
        margin-bottom: 30px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .bddVip {
        width: 100%;
        font-size: 14px;
        color: #333;
        line-height: 24px;
        display: flex;
        align-items: center;
        .editBtn {
          margin-left: 10px;
          cursor: pointer;
        }
      }
      .email {
        width: 100%;
        font-size: 14px;
        color: #333;
        line-height: 24px;
        margin-bottom: 29px;
      }
      .middle-line {
        width: 100%;
        height: 1px;
        background: #ccc;
        margin-bottom: 29px;
      }
      .link {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        .link-icon {
          width: 19px;
          height: 16px;
          display: block;
          margin-right: 25px;
        }
        .link-name {
          display: block;
          font-size: 16px;
          line-height: 16px;
          color: #333;
        }
      }
      .nuxt-link-active {
        .link {
          .link-name {
            color: #f29b87;
          }
        }
      }
    }
    .right-box {
      width: calc(100% - 264px);
      padding: 40px 30px 0;
      min-height: 500px;
      background: #ffffff;
      margin-left: 16px;
      box-sizing: border-box;
    }
  }
}
</style>
