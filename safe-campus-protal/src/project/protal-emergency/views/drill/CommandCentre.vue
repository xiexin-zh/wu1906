<template>
  <div class="data-view page-layout qui-fx-f1 qui-bg-fff">
    <div
      class="view-list"
      @click="goView"
    >
      <div class="tip">{{ name }}</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'CommandCentre',
  components: {},
  data() {
    return {
      name: '默认',
      schoolList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getCenterPlan']),
    async showList() {
      const res = await this.getCenterPlan(this.userInfo.schoolCode)
      this.schoolList = res.data
    },
    goView() {
      if (process.env.NODE_ENV === 'production') {
        window.open(
          `/pc-protal/emergency-view#/?schoolCode=${this.userInfo.schoolCode}&userCode=${this.userInfo.userCode}&userName=${this.userInfo.userName}&id=${this.schoolList[0].id}`
        )
      } else {
        window.open(
          `http://192.168.1.47:8080/emergency-view.html#/?schoolCode=${this.userInfo.schoolCode}&userCode=${this.userInfo.userCode}&userName=${this.userInfo.userName}&id=${this.schoolList[0].id}`
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>
.view-list {
  background: url(../../assets/img/sskb_default.png) no-repeat;
  background-size: 100% 100%;
  width: 22.5%;
  height: 240px;
  float: left;
  margin-left: 2%;
  margin-top: 20px;
  position: relative;
  .tip {
    position: absolute;
    width: 100%;
    bottom: 4px;
    z-index: 99;
    left: 0;
    height: 40px;
    text-align: center;
    color: #444;
    cursor: pointer;
  }
}
</style>
