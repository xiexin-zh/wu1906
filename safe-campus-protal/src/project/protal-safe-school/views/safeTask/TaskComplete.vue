<template>
  <div class="check-completion page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <div class="u-font-1 u-bold u-mar-b10">任务名称： {{ taskName }}</div>
      <div class="qui-fx-ac u-mar-t10 u-mar-b10" v-if="taskType !== '1'">
        <div>{{ taskType === '2' ? '周' : '月' }}计划：</div>
        <a-select v-model="dateNum" @change="showList" style="width: 200px">
          <a-select-option v-for="list in planList" :key="`${list.year}-${list.dateNum}`">{{ list.year }}-{{ list.dateNum }}{{ taskType === '2' ? '周' : '月' }}</a-select-option>
        </a-select>
      </div>
      <div class="qui-fx-ac u-mar-b10">
        <div>任务状态：</div>
        <a-select @change="statusChange" default-value="" style="width: 200px">
          <a-select-option value="">所有任务</a-select-option>
          <a-select-option value="1">未完成</a-select-option>
          <a-select-option value="2">已完成</a-select-option>
          <a-select-option value="3">逾期填报</a-select-option>
        </a-select>
        <div>(已完成数/总数：{{ compNum }}/{{ sum }})</div>
      </div>
      <div v-for="(el,index) in dataList" :key="index">
        <div class="fill-top u-mar-b20 ">
          <span class="fill-head">{{ el.orgName }}&nbsp;{{ number(el.list) }}</span>
        </div>
        <div class="card">
          <div class="cont u-fx-wp u-mar-t10">
            <div
              class="list-box u-fx-ac-jc u-mar-10"
              :class="v.state === '2' || v.state === '3'|| v.state === '5'? 'green' : 'red'"
              v-for="(v,index2) in el.list"
              :key="index2"
              @click="check(v)"
            >
              <div class="title u-bold u-font-1">{{ v.userName }}</div>
              <div class="btn u-fx-ac-jc u-font-01">{{ v.state | safetyTaskStatus }}</div>
            </div>
          </div>
        </div>
      </div>
      <task-status ref="taskStatus"></task-status>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TaskStatus from '../../component/TaskStatus'
export default {
  name: 'TaskComplete',
  components: {
    TaskStatus
  },
  data() {
    return {
      taskName: this.$route.query.taskName,
      state: [], // 状态
      dateNum: '', // 计划
      sum: '',
      compNum: '',
      dataList: [],
      taskType: '',
      planList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])

  },
  async mounted() {
    this.taskType = this.$route.query.taskType
    this.taskCode = this.$route.query.code
    if (this.taskType !== '1') {
      await this.taskTimeGet()
    }
    this.showList()
  },
  methods: {
    ...mapActions('home', ['schTaskCompleted', 'getTeachers', 'wechatNotice', 'planLists']),
    async showList() {
      const req = {
        state: this.state,
        year: this.dateNum.split('-')[0],
        dateNum: this.dateNum.split('-')[1],
        schoolCode: this.userInfo.schoolCode,
        taskTemplateCode: this.taskCode
        // taskType: this.taskType
      }
      const res = await this.schTaskCompleted(req)
      const { compNum, outCompInfoOfTaskByOrgDtoList, sum } = res.data
      this.compNum = compNum
      this.sum = sum
      this.dataList = outCompInfoOfTaskByOrgDtoList
    },
    async taskTimeGet() {
      const res = await this.planLists({ taskCode: this.taskCode })
      this.planList = res.data
      this.dateNum = `${res.data[0].year}-${res.data[0].dateNum}`
    },
    statusChange(value) {
      if (value === '1') {
        this.state = ['1', '2']
      } else if (value === '2') {
        this.state = ['3', '7']
      } else if (value === '3') {
        this.state = ['4', '8']
      } else if (value === '4') {
        this.state = ['5']
      } else if (value === '5') {
        this.state = ['6']
      } else {
        this.state = []
      }
      this.showList()
    },
    number(list) {
      const a = list.length
      const b = list.filter(v => v.state === '3' || v.state === '7').length
      return `(${b}/${a})`
      // return `a`
    },
    check(record) {
      if (record.state === '1') {
        this.$tools.delTip('确定要通知该学校相关负责人去处理该任务？', () => {
          // 查微信号
          const req1 = {
            schoolCode: record.schoolCode,
            userCodes: record.userCode.split(',')
          }
          this.getTeachers(req1).then((res) => {
            const req2 = {
          	  openId: res.data.map(v => v.openId),
              schoolCode: record.schoolCode,
              taskCode: record.taskCode
            }
            this.wechatNotice(req2).then(result => {
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.showList()
              })
            })
          })
        })
      } else {
        this.$refs.taskStatus.title = record.schoolName
        this.$refs.taskStatus.showDetail(record)
        this.$refs.taskStatus.visible = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.check-completion {
  padding: 20px;
  .card {
    cursor: pointer;
    .title-tab {
      border-bottom: 1px solid #dedede;
      height: 30px;
      position: relative;
      display: flex;
      justify-content: space-between;
      .title-tab-pane {
        height: 30px;
        font-size: 14px;
        color: #666;
        margin-right: 40px;
        border-bottom: 1px solid #dedede;
        display: inline-block;
        font-weight: 400;
        cursor: pointer;
        &.on {
          color: #6882da;
          border-bottom: 2px solid #6882da;
          font-weight: bold;
        }
      }
    }
  }
}
.fill-top {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: #4d4cac;
    border-bottom: 1px solid #ccc;
    .fill-head {
      // text-align: center;
      border-bottom: 3px solid #4d4cac;
    }
    .task {
      width: 100px;
    }
    .report {
      width: 100px;
    }
  }
  .list-box {
    width: 250px;
    height: 100px;
    .btn {
      margin-top: 5px;
      color: #fff;
      width: 90px;
      height: 25px;
      border-radius: 15px;
    }
  }
  .green {
    background: url('../../assets/img/wanchengbg.png') no-repeat;
    background-size: 100% 100%;
    .btn {
      background-color: #00a35f;
    }
  }
  .red {
    background: url('../../assets/img/nowangcheng.png') no-repeat;
    background-size: 100% 100%;
    .btn {
      background-color: #ff5454;
    }
  }
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
  }
</style>
