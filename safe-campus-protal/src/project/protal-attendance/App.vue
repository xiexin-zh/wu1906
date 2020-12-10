<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import { mapState, mapActions } from 'vuex'

export default {
  mixins: [AppDeviceEnquire],
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {
    // this.initializeSchoolYear()
  },
  methods: {
    ...mapActions('home', [
      'getSchoolYear', 'addSchoolYear'
    ]),
    // 初始化学年
    async initializeSchoolYear () {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (!res.data) {
        return
      }
      if (res.data.list.length === 0) {
        let defaultYear = ''
        let term = ''
        const year = new Date().getFullYear()
        if (new Date().getMonth() + 1 < 9) {
          defaultYear = (Number(year) - 1) + '-' + year
          term = '上学期'
        } else {
          defaultYear = year + '-' + (Number(year) + 1)
          term = '下学期'
        }
        const req = {
          ...this.userInfo,
          schoolYear: defaultYear,
          semester: term
        }
        await this.addSchoolYear(req)
        // this.$message.success('初始化学年设置成功')
      }
    }
  }
}
</script>
<style>
#nprogress .bar {
  height: 3px;
}
#app {
  height: 100%;
}
[v-cloak] {
  display: none !important;
}
</style>
