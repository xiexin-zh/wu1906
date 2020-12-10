<template>
  <div class="add-find page-layout bg-fff qui-fx-ver">
    <div class="card" v-for="(item,index) in dataList" :key="index">
      <div class="title-tab">
        <span class="title-tab-pane on u-type-primary">{{ item.name }}</span>
      </div>
      <div class="cont u-fx-wp u-mar-t10">
        <div
          class="list_box u-fx-ac-jc u-mar-10"
          :class="v.state==4||v.state==3?'green':'red'"
          v-for="(v,index2) in item.schoolAndStateList"
          :key="index2"
          @click="reviewDetails(v.taskId)">
          <div class="title u-bold u-font-1">{{ v.schoolName }}</div>
          <div class="btn u-fx-ac-jc u-font-01" >
            {{ v.state | taskStatus }}
          </div>
        </div>
      </div>
    </div>
    <special-detail ref="SpecialDetail" ></special-detail>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SpecialDetail from './SpecialDetail'
export default {
  name: 'Views',
  components: {
    // SpecialDetail: () => import('./SpecialDetail')
    SpecialDetail
  },
  data() {
    this.code = this.$route.query.code || ''
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
    ...mapActions('home', ['getStreetStatus']),
    async showList() {
      const res = await this.getStreetStatus(this.code)
      this.dataList = res.data
    },
    reviewDetails(id) {
      this.$refs.SpecialDetail.$refs.modal.visible = true
      this.$refs.SpecialDetail.showDetail(id)
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.add-find {
  padding: 20px;
  .card{
    .title-tab{
      border-bottom: 1px solid #DEDEDE;
      height: 30px;
      position: relative;
      display: flex;
      justify-content: space-between;
      .title-tab-pane{
        height: 30px;
        font-size: 14px;
        color: #666;
        margin-right: 40px;
        border-bottom: 1px solid #DEDEDE;
        display: inline-block;
        font-weight: 400;
        cursor: pointer;
        &.on{
          color: #6882da;
          border-bottom: 2px solid #6882da;
          font-weight: bold;
        }
      }
    }
    .list_box{
      width: 250px;
      height: 100px;
      .btn{
        margin-top: 5px;
        color: #fff;
        width: 90px;
        height: 25px;
        border-radius: 15px;
      }
    }
    .green{
      background: url('../../assets/img/wanchengbg.png')  no-repeat;
      background-size:100% 100%;
      .btn{
        background-color: #00a35f;
      }
    }
    .red{
      background: url('../../assets/img/nowangcheng.png')  no-repeat;
      background-size:100% 100%;
      .btn{
        background-color: #ff5454;
      }
    }
  }
}
</style>
