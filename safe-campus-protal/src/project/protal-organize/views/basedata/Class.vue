<template>
  <div class="class page-layout qui-fx">
    <div class="qui-fx qui-fx-jsb" style="width:100%">
      <div class="left">
        <grade-tree @select="select" :school="school"></grade-tree>
      </div>
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <table-list
          :scrollH="350"
          :page-list="pageList"
          :columns="columns"
          :table-list="classList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="详情">
              <a-button size="small" class="detail-action-btn" icon="ellipsis" @click.stop="goDetail('/basedata/classDetail',action.record)"></a-button>
            </a-tooltip>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showMore"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import GradeTree from '@c/GradeTree'
import PageNum from '@c/PageNum'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '10%'
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '班级教室',
    dataIndex: 'placeName',
    width: '20%'
  },
  {
    title: '班主任',
    dataIndex: 'teacherName',
    width: '10%'
  },
  {
    title: '学生人数',
    width: '10%',
    dataIndex: 'count'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

export default {
  name: 'Class',
  components: {
    TableList,
    GradeTree,
    PageNum
  },
  props: {
    school: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      columns,
      schoolYearId: '',
      gradeCode: '',
      classCode: '',
      gradeId: '',
      gradeName: '',
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      classList: [],
      gradeList: [],
      schoolYear: ''
    }
  },
  created () {
  },
  methods: {
    ...mapActions('home', [
      'getClassList', 'getGradeList', 'addNewClass', 'addClassList', 'deleteTheClass', 'editTheClass', 'addPlace'
    ]),
    // 选中年级
    select (item) {
      console.log(item)
      this.schoolYear = item.title
      this.schoolYearId = item.schoolYearId
      this.gradeCode = item.gradeCode
      this.classCode = item.classCode
      const req = {
        ...this.pageList,
        schoolCode: this.school,
        schoolId: this.$route.query.id,
        schoolYearId: item.schoolYearId,
        gradeCode: item.gradeCode || '',
        classCode: item.classCode || ''
      }
      this.showList(req)
    },
    // 翻页
    showMore () {
      const req = {
        ...this.pageList,
        schoolCode: this.school,
        schoolId: this.$route.query.id,
        schoolYearId: this.schoolYearId,
        gradeCode: this.gradeCode,
        classCode: this.classCode
      }
      this.showList(req)
    },
    // 查询班级列表
    async showList (req) {
      const res = await this.getClassList(req)
      if (!res.data.list) {
        this.classList = []
        return
      }
      this.classList = res.data.list
      this.total = res.data.total
    },
    // 详情
    goDetail (path, record) {
      this.$router.push({ path, query: { id: record.id, schoolCode: this.school, schoolYearId: record.schoolYearId, classCode: record.classCode, gradeCode: record.gradeCode } })
    }
  }
}
</script>
<style lang="less" scoped>
.class{
  height: 100%;
  background: #fff;
  .left{
    padding: 10px;
  }
  .table-total-num{
    cursor: pointer;
  }
  .right{
    border-left: 1px solid @bor-color;
    padding: 0 0 0 10px;
    .action{
      div{
        cursor: pointer;
        margin: 4px 30px 0 0;
        img{
          width: 20px;
          height: 20px;
        }
        span{
          font-size:12px;
        }
      }
    }
  }
}
.modal{
  padding: 0 40px;
  .line{
    margin-bottom: 20px;
  }
  .title{
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
    min-width: 70px;
  }
  .download{
    color:#6882da;
    cursor: pointer;
  }
  /deep/ .ant-upload-list-item-info{
    padding: 0 22px 0 4px;
  }
}
.tab-add{
  cursor: pointer;
  color:#6882da;
}
</style>
