<template>
  <div class="exam-plan page-layout qui-fx-ver">
    <a-tabs v-model="autoKey">
      <a-tab-pane
        v-for="(tab, index) in tabList"
        :key="index"
        :tab="tab.name"
        :disabled="autoKey > index && isDetail"
      ></a-tab-pane>
    </a-tabs>
    <div class="qui-fx-f1 qui-fx">
      <component :id="id" :is-detail="isDetail" @goNext="goNext" :is="planListCom[autoKey]"></component>
    </div>
  </div>
</template>

<script>
import PlanOne from './PlanOne'
import PlanTwo from './PlanTwo'
import PlanThree from './PlanThree'
import PlanFour from './PlanFour'
import { mapState } from 'vuex'
import { Steps } from 'ant-design-vue'
export default {
  name: 'Addexamplan',
  components: { ASteps: Steps, AStep: Steps },
  props: {},
  data() {
    return {
      id: '',
      isDetail: '',
      tabList: [
        {
          name: '1. 考试计划'
        },
        {
          name: '2. 选择考场'
        },
        {
          name: '3. 填写考试时间'
        },
        {
          name: '4. 查看考试'
        }
      ],
      autoKey: 0,
      currentCom: '',
      planListCom: [PlanOne, PlanTwo, PlanThree, PlanFour]
    }
  },
  created() {},
  mounted() {
    this.id = this.$route.query.id + ''
    this.isDetail = this.$route.query.isDetail === 'true' ? true : false
    if (this.isDetail) {
      this.autoKey = 3
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    goNext(index, id = '') {
      this.id = id + ''
      this.autoKey = index
    }
  }
}
</script>
<style lang="less" scoped>
.exam-plan {
}
</style>
