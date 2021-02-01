<template>
  <div class="page-layout u-fx-ver u-type-white-bg layout-padd">
    <u-alert message :description="des"></u-alert>
    <div class="u-auto u-padd-b">
      <div class="view-list u-fx-ae u-shadow" v-for="(board,index) in boardList" :key="index">
        <div class="tips u-fx-jsb">
          <div class="u-fx-f1 u-te u-type-primary u-bold">{{ board.name }}</div>
          <div class>
            设备数：
            <u-tag type="primary">{{ board.count }}</u-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'OnlineView',
  components: {},
  data() {
    return {
      boardList: [],
      des:
        '各宿舍楼栋创建并绑定设备后，即生成实时看板，打开看板可查看宿舍的实时识别动态面板。总看板为所有宿舍看板数据汇总的看板。'
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._getBoardList()
  },
  methods: {
    ...mapActions('home', ['getBoardList']),
    async _getBoardList() {
      const res = await this.getBoardList({
        schoolCode: this.schoolCode
      })
      this.boardList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.view-list {
  width: 24%;
  float: left;
  margin-left: 0.8%;
  margin-top: 20px;
  height: 273px;
  border-radius: 8px;
  background: url('../assets/img/view-card.png') no-repeat;
  background-size: 100% 270px;
  cursor: pointer;
  opacity: 0.9;
  overflow: hidden;
  &:hover {
    opacity: 1;
  }
  .tips {
    position: absolute;
    z-index: 88;
    width: 100%;
    height: 40px;
    bottom: 5px;
    line-height: 40px;
    padding: 0 5px 0 10px;
  }
}
</style>
