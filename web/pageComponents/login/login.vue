<template>
  <div>
    <!-- 手机登录 -->
    <div v-if="loginType == 1" class="login-item">
      <div class="relative margin-bottom-20">
        <div style="position: fixed;z-index: -999;">
          <input type="text" name="hidden1" id="text" value="123">
          <input type="password" name="hidden1" id="password" value="456">
        </div>

        <div class="login-input icon-input">
          <span class="icon">
            <img class="phone" src="/login/phone.png" />
          </span>
          <input id="ipt1" v-model.trim="mobile" @keypress="keypressEvent1" type="text" v-bind:class="{active:isActive1}" :placeholder="$t(`${lang}.phoneBox`)" maxlength="11" autocomplete="off"/>
        </div>
        <div v-show="phoneErr" class="error-tip">
          {{ $t(`${lang}.phoneTips`) }}
        </div>
      </div>

      <div class="relative margin-bottom-20">
        <div class="login-input icon-input">
          <span class="icon">
            <img src="/login/lock.png" />
          </span>
          <input v-model.trim="password" @keypress="keypressEvent2" v-bind:class="{active:isActive2}" type="password" :placeholder="$t(`${lang}.password`)" maxlength="60" autocomplete="off"/>
        </div>
        <div v-show="passwordErr" class="error-tip">
          {{ $t(`${lang}.passwordTips`) }}
        </div>
      </div>
      <div class="forget margin-bottom-10">
        <nuxt-link :to="{ path: '/reset-password',query:{type:loginType} }">
          {{ $t(`${lang}.forget`) }}
        </nuxt-link>
      </div>

      <!-- 验证码 -->
      <div class="relative margin-bottom-30">
        <div class="row-flex align-item-stretch">
          <div class="login-input verification-code-input">
            <input v-model="code" @keypress="codeErr = false" type="text" :class="{border:codeErr}" :placeholder="$t(`${lang}.code`)" maxlength="4" />
          </div>
          <div class="code-picture" @click="refreshCode">
            <picture-verification-code ref="picture-verification-code" :identify-code="pictureCode"></picture-verification-code>
          </div>
        </div>
        <div v-show="codeErr" class="error-tip">
          {{ $t(`${lang}.code`) }}
        </div>
      </div>
      <div class="margin-bottom-29">
        <button v-loading="requesting" class="submit bg" @click="login">
          {{ $t(`${lang}.login`) }}
        </button>
      </div>

      <div class="margin-bottom-29" v-if="ifShowBtn">
        <button v-loading="requesting" class="submit" @click="loginT('b')">
          {{ $t(`${lang}.mailLogin`) }}
        </button>
      </div>

      <!-- <div class="gap-line margin-bottom-28">
        <span>{{ $t(`${lang}.logins`) }}</span>
      </div>
      <div class="row-flex justify-center">
        <img src="/login/facebook.png" class="oauth-type" />
        <img src="/login/google.png" class="oauth-type" />
      </div> -->
    </div>
    
    <!-- 邮箱登录 -->
    <div v-if="loginType == 2" class="login-item">
      <div class="relative margin-bottom-20">
        <div style="position: fixed;z-index: -999;">
          <input type="text" name="hidden1" id="text" value="123">
          <input type="password" name="hidden1" id="password" value="456">
        </div>
        <div class="login-input icon-input">
          <span class="icon">
            <img src="/login/mail.png" />
          </span>
          <input id="ipt2" v-model.trim="account" @keypress="keypressEvent3" v-bind:class="{active:isActive3}" type="text" :placeholder="$t(`${lang}.mailBox`)" maxlength="60" />
        </div>
        <div v-show="mailErr" class="error-tip">
          {{ $t(`${lang}.mailTips`) }}
        </div>
      </div>
      
      <div class="relative margin-bottom-20">
        <div class="login-input icon-input">
          <span class="icon">
            <img src="/login/lock.png" />
          </span>
          <input v-model.trim="password" @keypress="keypressEvent2" v-bind:class="{active:isActive2}" type="password" :placeholder="$t(`${lang}.password`)" maxlength="60" />
        </div>
        <div v-show="passwordErr" class="error-tip">
          {{ $t(`${lang}.passwordTips`) }}
        </div>
      </div>
      <div class="forget margin-bottom-10">
        <nuxt-link :to="{ path: '/reset-password',query:{type:loginType}}">
          {{ $t(`${lang}.forget`) }}
        </nuxt-link>
      </div>

      <!-- 验证码 -->
      <div class="relative margin-bottom-30">
        <div class="row-flex align-item-stretch">
          <div class="login-input verification-code-input">
            <input v-model="code" @keypress="codeErr = false" v-bind:class="{active:codeErr}" type="text" :placeholder="$t(`${lang}.code`)" :maxlength="4" />
          </div>
          <div class="code-picture" @click="refreshCode">
            <picture-verification-code ref="picture-verification-code" :identify-code="pictureCode"></picture-verification-code>
          </div>
        </div>
        <div v-show="codeErr" class="error-tip">
          {{ $t(`${lang}.code`) }}
        </div>
      </div>
      <div class="margin-bottom-29">
        <button v-loading="requesting" class="submit bg" @click="login">
          {{ $t(`${lang}.login`) }}
        </button>
      </div>

      <div class="margin-bottom-29" v-if="ifShowBtn">
        <button v-loading="requesting" class="submit" @click="loginT('a')">
          {{ $t(`${lang}.phoneLogin`) }}
        </button>
      </div>

      <!-- <div class="gap-line margin-bottom-28">
        <span>{{ $t(`${lang}.logins`) }}</span>
      </div> -->
      <!-- <div class="row-flex justify-center"> -->
      <!-- <img src="/login/facebook.png" class="oauth-type" /> -->
      <!-- <img src="/login/google.png" class="oauth-type" /> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import Input from '@/mixins/input.js'
const lang = 'login'
export default {
  mixins: [Input],
  data () {
    return {
      url:this.$route.query.url,
      lang,
      account: '',
      mobile: '',
      password: '',
      code: '',
      pictureCode: '',
      requesting: false,
      language: '',
      phoneErr: false,
      passwordErr: false,
      codeErr: false,
      mailErr: false,
      isActive1: false,
      isActive2: false,
      isActive3: false,
      oldUrl:'',
      // 手机注册1,邮箱注册2
      loginType: 0,
      ifShowBtn: false
    }
  },
  beforeRouteEnter (to, from, next){
    next(vm => {
      // 通过 `vm` 访问组件实例,将值传入oldUrl
      // console.log("ssssss",vm)
      vm.oldUrl = from.path
    })
  },
  mounted () { 
	  this.loginType = sessionStorage.getItem("loginType")

    if(this.$store.state.platform == 20){
      this.ifShowBtn = true
    }else{
      this.ifShowBtn = false
    }

    const _this = this
    _this.$nextTick(() => {
       _this.refreshCode()
    })
  },
  methods: {
    keypressEvent1 () {
      this.isActive1 = false
      this.phoneErr = false
    },
    keypressEvent2 () {
      this.isActive2 = false
      this.passwordErr = false
    },
    keypressEvent3 () {
      this.isActive3 = false
      this.mailErr=false
    },
    // 生成驗證碼
    refreshCode () {
      // const info = JSON.parse(JSON.stringify(this.info))
      const result = []
      const library = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      this.identifyCode = ''
      for (let i = 0; i < 4; i++) {
        result.push(library[Math.floor(Math.random() * 9)])
      }
      this.pictureCode = result.join('')
      // this.info = info
    },
    // 登录
    login () {
      const _this = this;
      // 手机登录
      if(this.loginType == 1){
        if (_this.mobile === '') {
          _this.isActive1 = true
          _this.phoneErr = true
          return
        }

        if (_this.password === '') {
          _this.isActive2 = true
          _this.passwordErr = true
          return
        }

        if (_this.code === '') {
          _this.codeErr = true
          return
        }

        if (_this.code != _this.pictureCode) {
          _this.$errorMessage(_this.$t(`${lang}.codeTips`))
          _this.requesting = false
          return
        }

        this.$axios({
          method: 'post',
          url: '/web/site/login',
          params: {
          },
          data: {
            'username': _this.mobile,
            'password': _this.password
          }
        })
          .then(res => {
            const data = res.data
            localStorage.setItem("refreshToken", data.refresh_token);
            localStorage.setItem("accessToken", data.access_token);
            let nowDate = parseInt((new Date()).getTime() / 1000)
            localStorage.setItem("refreshTime", nowDate);

            _this.$successMessage(_this.$t(`${lang}.logintips`))
            _this.$store.commit('setToken', data.access_token)
            _this.$store.commit('setUserInfo', data.member)
            _this.$store.dispatch('synchronizeCart')

            const lastUrl=localStorage.getItem("url")
            setTimeout(() => {
              if (lastUrl) {
                _this.$router.replace({
                  path: lastUrl
                })
              }
              else {
                _this.$router.replace({
                  path: '/'
                })
              }
            }, 0)
          })
          .catch(err => {
            //console.error(err)
            _this.requesting = false
            _this.refreshCode()
            _this.$errorMessage(err.message)
          })
      // 邮箱登录
      }else{
        if (_this.account === '') {
          _this.isActive3 = true
          _this.mailErr = true
          return
        }

        if (_this.password === '') {
          _this.isActive2 = true
          _this.passwordErr = true
          return
        }

        if (_this.code === '') {
          _this.codeErr = true
          return
        }

        if (_this.code != _this.pictureCode) {
          _this.$errorMessage(_this.$t(`${lang}.codeTips`))
          _this.requesting = false
          return
        }

        this.$axios({
          method: 'post',
          url: '/web/site/login',
          params: {
          },
          data: {
            'username': _this.account,
            'password': _this.password
          }
        })
          .then(res => {
            const data = res.data
            localStorage.setItem("refreshToken", data.refresh_token);
            localStorage.setItem("accessToken", data.access_token);
            let nowDate = parseInt((new Date()).getTime() / 1000)
            localStorage.setItem("refreshTime", nowDate);
            _this.$successMessage(_this.$t(`${lang}.logintips`))
            _this.$store.commit('setToken', data.access_token)
            _this.$store.commit('setUserInfo', data.member);
            _this.$store.dispatch('synchronizeCart')

            const lastUrl=localStorage.getItem("url")
            setTimeout(() => {
              if (lastUrl) {
                _this.$router.replace({
                  path: lastUrl
                })
              }
              else {
                _this.$router.replace({
                  path:'/'
                })
              }
            }, 0)
          })
          .catch(err => {
            _this.requesting = false
            _this.refreshCode()
            _this.$errorMessage(err.message)
          })
      }
    },
    loginT(i) {
      this.account = '';
      this.mobile = '';
      this.password = '';

      if(i == 'a'){
        this.loginType = 1
      }else if(i == 'b'){
        this.loginType = 2
      }

      sessionStorage.setItem("loginType", this.loginType)
    },
    blurEvent() {
      if(!this.code){
        this.codeErr = true
      }else{
        this.codeErr = false
      }
    }
  }
}
</script>



<style lang="less" scoped>
input::placeholder {
  color: #c0c4cc;
}
.margin-bottom-29 {
  margin-bottom: 29px;
}
.margin-bottom-28 {
  margin-bottom: 28px;
}
.error-tip {
  position: absolute;
  top: 100%;
  left: 0;
  padding-top: 4px;
  text-align: left;
  font-size: 12px;
  font-weight: 400;
  color: rgba(242, 155, 135, 1);
  // display: none;
}

.login-item {
  height: 425px;
  padding-top: 20px;
  padding-bottom: 23px;

  .login-input {
    position: relative;

    & {
      input {
        width: 100%;
        height: 48px;
        line-height: 48px;
        padding: 0 20px;
        border: 1px solid rgba(230, 230, 230, 1);
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 14px;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }

    &.icon-input {
      .icon {
        position: absolute;
        top: 50%;
        left: 23px;
        transform: translate(-50%, -50%);
        font-size: 0;
        line-height: 0;

        img {
          width: 16px;
        }
      }

      input {
        padding: 0 20px 0 45px;
      }
    }
  }

  .error {
    .login-input {
      input {
        border: 1px solid #f29b87;
      }
    }
    .error-tip {
      display: initial;
    }
  }

  .verification-code-input {
    flex-grow: 1;
    flex-shrink: 1;
    width: 140px;
    margin-right: 10px;
  }

  .code-picture {
    width: 109px;
    height: 48px;
  }

  .forget {
    margin-top: -6px;
    text-align: right;

    a {
      font-size: 12px;
      font-weight: 400;
      text-decoration: underline;
      color: rgba(153, 153, 153, 1);
    }
  }

  .submit {
    width: 100%;
    height: 48px;
    background: #ffffff;
    border: 1px solid #8b766c;
    font-size: 14px;
    font-weight: 400;
    color: #8b766c;
  }

  .submit.bg{
	background-color: #A88F82;
	color: #fff;
  }

  .gap-line {
    height: 8px;
    text-align: center;
    border-bottom: 1px solid #ececec;

    span {
      display: inline-block;
      margin: auto;
      padding: 0 10px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(168, 143, 130, 1);
      background-color: #ffffff;
    }
  }

  .oauth-type {
    width: 35px;
    margin: 0 15px;
  }
  .active {
    border: 1px solid #f4a997 !important;
    border-radius: 6px;
  }
}
.icon .phone{
  width: 20px !important;
  height: 22px !important;
}

.border{
  border: 1px solid #F3A18E!important;
}
</style>
