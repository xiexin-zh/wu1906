<template>
  <div class="logo" style="font-size: 22px;">
    <span v-if="!slideTag" style="padding-left: 6px">平安智慧校园云平台</span>
    <img
      v-if="slideTag"
      style="width: 28px; height: 28px; display: inline-block; margin-left: 5px; margin-top: -5px"
      :src="logoUrl"
      alt
    />
  </div>
</template>

<script>
import eventBus from '@u/eventBus'
import logo from '@a/img/logo.png'
export default {
  name: 'Logo',
  props: {
    slideTag: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  mounted() {
    eventBus.$on('login', () => {
      this.logoUrl = JSON.parse(window.sessionStorage.getItem('loginInfo')).logoUrl || logo
    })
  },
  data() {
    return {
      protalName: process.env.VUE_APP_URL === 'prod' ? '全品' : '智慧',
      // logoUrl: process.env.VUE_APP_URL === 'prod' ? logo : logoCommon
      logoUrl: ''
    }
  },
  components: {}
}
</script>
