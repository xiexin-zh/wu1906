<template>
  <div class="border-notice page-layout bg-fff ">
    <a-row class="u-mar-t20 u-padd-r40 u-mar-b20" type="flex" justify="end">
      <a-col class="u-fx">
        <a-button type="primary" class="u-mar-r20" @click="exportClick(url)">下载通知书 </a-button>
      </a-col>
    </a-row>
    <div class="img-box">
      <pdf ref="pdf" :src="src"> </pdf>
    </div>
    <a-row class="u-mar-t20 u-padd-r40 u-mar-b20" type="flex" justify="center">
      <a-col class="u-fx">
        <a-button type="primary" class="u-mar-r20" @click="goBack(url)">返回</a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import hostEnv from '@config/host-env'
import { mapActions } from 'vuex'
import pdf from 'vue-pdf'
export default {
  name: 'RectificationNotice',
  components: {
    pdf
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      id: '',
      url: '',
      src: ''
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    this._getDangerInfo()
  },
  methods: {
    ...mapActions('home', ['getDangerInfo', 'showFile']),
    async _getDangerInfo() {
      const res = await this.getDangerInfo(this.id)
      this.url = res.data.notificationUrl || ''
      this.src = `${hostEnv.protal_api_10050}/file/preview/doc?url=${this.url}`
    },
    exportClick() {
      const url = `${hostEnv.protal_api_10050}/file/downLoad/doc?url=${this.url}`
      var a = document.createElement('a')
      a.id = 'expertFile'
      a.href = url
      document.body.append(a)
      a.click()
      document.getElementById('expertFile').remove()
      // window.open(url)
    },
    goBack() {
      this.$router.push({
        path: '/schoolDanger',
        props: true
      })
    }
  }
}
</script>
<style lang="less" scoped>
.border-notice {
  width: 100%;
  height: 100%;
  padding: 40px;
  .img-box {
    width: 1000px;
    height: 600px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
