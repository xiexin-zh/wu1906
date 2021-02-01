<template>
  <div class="logo" style="font-size: 22px;">
    <span v-if="!slideTag" style="padding-left: 6px">平安智慧校园云平台</span>
    <img
      v-if="slideTag"
      style="width: 28px; height: 28px; display: inline-block; margin-left: 5px; margin-top: -5px"
      :src="loginInfo.logoUrl || logo"
      alt
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import logo from '@a/img/logo.png'
export default {
  name: 'Logo',
  props: {
    slideTag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('home', ['loginInfo'])
  },
  mounted() {},
  data() {
    return {
      logo
    }
  },
  components: {}
}
</script>
