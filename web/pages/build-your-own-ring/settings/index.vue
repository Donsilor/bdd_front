<template>
  <div class="setting">
    <step></step>
    <list :seo="this.seoInfo"></list>
  </div>
</template>

<script>
import list from '@/pageComponents/engagement-rings/list'
export default {
  components: {
    list
  },
  async asyncData({ $axios, route, store, app }) {
    //  console.log("sssss",route)
    let seoInfo = await app.$getSeoInfo('Rings')
    if(route.query.step == 1){
      seoInfo = await app.$getSeoInfo('settingRings')
    }
    return $axios({
      method: 'get',
      url: '/web/goods/style/web-site',
      params: {
        // type: 2
      }
    })
      .then(res => {
        var data = res.data;
        return {
          seoInfo,
          ad: data.advert,
          webSite: data.webSite
        }
      })
      .catch(err => {
        console.error(err)
      })
  }
}
</script>

<style lang="less" scoped></style>
