<template>
  <div class="paln-details page-layout qui-fx-ver">
    <div class="plan-msg">
      <div class="msg-title">教学计划</div>
      <div class="msg-content" v-for="item in baseMsg" :key="item.title">
        <div class="title">{{ item.title }}：</div>
        <div class="text">{{ item.text }}</div>
      </div>
    </div>
    <div class="plan-list">
      <div class="msg-title">课程设置</div>
      <div class="tableTitle">{{ title }}</div>
      <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="hourList">
      </table-list>
    </div>
  </div>
</template>

<script>
import TableList from '@c/TableList'
import { mapState, mapActions } from 'vuex'
import Tools from '@/utils/tools'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '课程名称',
    dataIndex: 'subjectName'
  },
  {
    title: '周课时(节)',
    dataIndex: 'count'
  },
  {
    title: '学期总课时(节)',
    dataIndex: 'allCount'
  }
]
export default {
  components: {
    TableList
  },
  data() {
    return {
      columns,
      baseMsg: [
        {
          title: '教学计划',
          text: ''
        },
        {
          title: '学年',
          text: ''
        },
        {
          title: '学期',
          text: ''
        },
        {
          title: '开始日期',
          text: ''
        },
        {
          title: '结束日期',
          text: ''
        },
        {
          title: '适用年级',
          text: ''
        }
      ],
      pageList: {
        page: 1,
        size: 999
      },
      hourList: [],
      title: '',
      isHighSchool: false
    }
  },
  mounted() {
    const planId = Number(this.$route.query.id)
    const loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo') || '{}')
    const isHighSchool = loginInfo.schoolType === '8' || loginInfo.schoolType === '9'
    this.isHighSchool = isHighSchool
    this.baseMsg[1].title = isHighSchool ? '年级' : '学年'
    this.baseMsg[5].title = isHighSchool ? '适用专业' : '适用年级'
    this.getDetails(planId, isHighSchool)
  },
  methods: {
    ...mapActions('home', ['getPlanDetails', 'getPlanDetailsHigh']),
    // 获取计划详情
    async getDetails(id, isHighSchool) {
      const res = isHighSchool
        ? await this.getPlanDetailsHigh({ id })
        : await this.getPlanDetails({ id })
      const {
        title,
        startDate,
        endDate,
        schoolYear,
        semester,
        gradeCodeStr,
        courseList,
        gradeNameStr
      } = res.data
      const msgArr = [
        title,
        `${schoolYear}${ this.isHighSchool ? '' : '学年'}`,
        semester,
        Tools.getDate(startDate, 1),
        Tools.getDate(endDate, 1),
        gradeNameStr
      ]
      this.baseMsg = this.baseMsg.map((item, index) => {
        return {
          ...item,
          text: msgArr[index]
        }
      })
      this.hourList = courseList.map((item) => {
        return {
          id: item.subjectCode,
          subjectName: item.subjectName,
          count: item.weekNum,
          allCount: item.totalNum
        }
      })
      this.title = title
    }
  }
}
</script>

<style lang="less" scoped>
.paln-details {
  box-sizing: border-box;
  padding: 70px 40px 20px 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .plan-msg {
    box-sizing: border-box;
    padding: 50px 50px 40px;
    width: 100%;
    border: 1px solid #ccc;
    margin-bottom: 50px;
    position: relative;
    display: flex;
    flex-wrap: wrap;

    .msg-content {
      display: flex;
      margin-right: 50px;
      margin-bottom: 10px;

      .title {
        margin-right: 10px;
      }
    }
    .msg-content:last-child {
      margin-right: 0;
    }
  }
  .plan-list {
    box-sizing: border-box;
    padding: 50px;
    width: 100%;
    border: 1px solid #ccc;
    position: relative;

    .tableTitle {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      padding-bottom: 30px;
    }
  }

  .msg-title {
    height: 50px;
    padding: 0 10px;
    position: absolute;
    left: 50px;
    top: -25px;
    font-size: 18px;
    font-weight: 800;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>