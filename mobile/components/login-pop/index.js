import Component from './index.vue'

// 定义并注册组件
const Info = {
  install: function(Vue) {
    Vue.component('login-pop', Component)
  }
}

// 导出组件
export default Info
