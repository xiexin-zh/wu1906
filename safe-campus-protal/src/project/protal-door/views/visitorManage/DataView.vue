<template>
  <div class="data-view page-layout qui-fx-f1 qui-bg-fff">
    <div
      @click="goView(data.deviceGroupCode, data.deviceGroupName)"
      class="view-list"
      v-for="(data, index) in dataList"
      :key="index"
    >
      <div class="tip">{{ data.deviceGroupName }}</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'DataView',
  components: {},
  data() {
    return {
      dataList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['groupList']),
    showList() {
      this.groupList({
        schoolCode: this.userInfo.schoolCode,
        schoolName: this.userInfo.schoolName
      }).then(res => {
        const data = res.data || []
        this.dataList = this.dataList.concat(data)
      })
    },
    goView(code, name) {
      if (process.env.NODE_ENV === 'production') {
        window.open(
          `/pc-protal/door-data-view#/?schoolCode=${this.userInfo.schoolCode}&schoolName=${this.userInfo.schoolName}&deviceGroupCode=${code}&deviceName=${name}`
        )
      } else {
        window.open(
          `http://192.168.1.185:8080/door-data-view.html#/?schoolCode=${this.userInfo.schoolCode}&schoolName=${this.userInfo.schoolName}&deviceGroupCode=${code}&deviceName=${name}`
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
