<template>
  <div class="data-view page-layout qui-fx-f1 qui-bg-fff">
    <div
      @click="goView(data.categoryCode, data.categoryName)"
      class="view-list"
      v-for="(data, index) in dataList"
      :key="index"
    >
      <div class="tip">{{ data.categoryName }}</div>
    </div>
  </div>
</template>
<script>
import schoolApi from '../api/school'
import { mapState } from 'vuex'
export default {
  name: 'DataView',
  components: {},
  data() {
    return {
      schoolApi,
      dataList: [
        {
          categoryName: '宿舍楼',
          categoryCode: ''
        }
      ]
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    showList() {
      this.$ajax
        .get({
          url: this.schoolApi.buildList + window.sessionStorage.getItem('schoolScheme')
        })
        .then(res => {
          const data = res.data || []
          this.dataList = this.dataList.concat(data)
        })
    },
    goView(code, name) {
      if (process.env.NODE_ENV === 'production') {
        window.open(
          `/pc-protal/dorm-data-view#/?schoolCode=${this.userInfo.schoolCode}&buildingCode=${code}&buildingName=${name}`
        )
      } else {
        window.open(
          `http://localhost:8080/door-record.html#/?schoolCode=${this.userInfo.schoolCode}&buildingCode=${code}&buildingName=${name}`
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>
.view-list {
  background: url(../assets/img/invade/welcome.png) no-repeat;
  background-size: 100%;
  box-shadow: 0 0 3px #ccc;
  width: 22.5%;
  height: 220px;
  float: left;
  margin-left: 2%;
  margin-top: 20px;
  background-color: #ccc;
  position: relative;
  .tip {
    position: absolute;
    width: 100%;
    bottom: 0px;
    z-index: 99;
    left: 0;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    cursor: pointer;
    letter-spacing: 2px;
    background: rgba(0, 0, 0, 0.6);
  }
}
</style>
