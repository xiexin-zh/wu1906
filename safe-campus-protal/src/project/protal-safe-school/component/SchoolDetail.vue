<template>
  <a-modal
    title="查看车辆运营班次"
    v-model="visible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="800px"
    :footer="null"
  >
    <div class="car">
      <div class="qui-fx car-box" v-for="list in carList" :key="list.id">
        <div class="car-week">{{ list.weekDate | getWeekDay }}</div>
        <div class="qui-fx-f1">
          <span> 上午：{{ list.startTime | getDate(3) }} </span>
          <span class="mar-l10"> 下午：{{ list.endTime | getDate(3) }} </span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'SchoolDetail',
  data() {
    return {
      visible: false,
      carList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', ['getSchoolFlights']),
    async showDetail(id) {
      const res = await this.getSchoolFlights({ query: id })
      this.carList = res.data
      this.visible = true
    }
  }
}
</script>

<style lang="less" scoped>
.car {
  max-height: 600px;
  overflow-y: scroll;
  .car-box {
    height: 50px;
    line-height: 50px;
    background-color: #eee;
    margin-top: 10px;
    text-align: center;
    .car-week {
      width: 200px;
      border-right: 2px solid #ccc;
    }
  }
}
</style>
