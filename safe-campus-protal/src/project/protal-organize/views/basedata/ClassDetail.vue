<template>
  <div class="class-detail page-layout qui-fx-ver">
    <detail-show :detail-info="detailInfo" :title="infoTitle"></detail-show>
    <div class="tit qui-fx-jsb qui-fx-ac">
      <p>班级学生</p>
      <search-form isReset @search-form="searchForm" :search-label="searchLabel">
      </search-form>
    </div>
    <div class="content qui-fx-ver qui-fx-f1">
      <div class="table qui-fx-ver qui-fx-f1">
        <table-list
          is-zoom
          :columns="columns"
          :table-list="studentsList">
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList(keywords)"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import DetailShow from '@c/DetailShow'
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'

const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学生姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    customRender: (text) => {
      return Tools.getSex(text)
    }
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '入学年份',
    dataIndex: 'admissionTime',
    width: '15%',
    customRender: (text) => {
      return new Date(text).getFullYear()
    }
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '加入班级时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: (text) => {
      return Tools.getDate(text).substring(0, 10)
    }
  }
]
const searchLabel = [
  {
    value: 'keywords',
    initValue: '',
    type: 'selectInput',
    selectType: [
      {
        key: 1,
        val: '姓名'
      },
      {
        key: 2,
        val: '学号'
      }
    ],
    placeholder: '请输入'
  }
]
export default {
  name: 'StudentDetail',
  components: {
    TableList,
    SearchForm,
    PageNum,
    DetailShow
  },
  data () {
    return {
      searchLabel,
      studentsList: [],
      columns,
      keywords: '',
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      classInfo: {},
      detailInfo: [
        {
          key: '年级',
          val: ''
        },
        {
          key: '班级名称',
          val: ''
        },
        {
          key: '班级教室',
          val: ''
        },
        {
          key: '班级学生人数',
          val: ''
        },
        {
          key: '班主任',
          val: ''
        },
        {
          key: '备注',
          val: ''
        }
      ],
      infoTitle: '基础信息'
    }
  },
  created () {
  },
  mounted () {
    this.showList()
    this.showClassDetail()
  },
  methods: {
    ...mapActions('home', [
      'detailClass', 'getClassStudentList'
    ]),
    async showClassDetail () {
      const res = await this.detailClass(this.$route.query.id)
      this.detailInfo[0].val = res.data.gradeName
      this.detailInfo[1].val = res.data.className
      this.detailInfo[2].val = res.data.placeName
      this.detailInfo[3].val = res.data.count || 0
      this.detailInfo[4].val = res.data.teacherName
      this.detailInfo[5].val = res.data.remark
    },
    async showList (keyword = '') {
      const req = {
        classCode: this.$route.query.classCode,
        gradeCode: this.$route.query.gradeCode,
        schoolYearId: this.$route.query.schoolYearId,
        ...this.pageList,
        schoolCode: this.$route.query.schoolCode,
        keyword: keyword
      }
      const res = await this.getClassStudentList(req)
      this.studentsList = res.data.list
      this.total = res.data.total
    },
    searchForm (value) {
      this.keywords = value.keywords
      this.showList(value.keywords)
    }
  }
}
</script>
<style lang="less" scoped>
.class-detail{
  height:100%;
  .tit{
    margin:10px 0 0 0;
    p{
      border-left: 3px solid @main-color;
      padding-left: 10px;
      font-weight: bold;
      margin: 0 0 0 10px;
      line-height: 16px;
      height: 16px;
      font-size: 16px;
    }
  }
   .top{
    background: #fff;
    border:1px solid #ddd;
    padding: 20px;
    margin-top: 10px;
    font-weight: bold;
    .info{
      margin-bottom: 20px;
      span{
        margin-right: 50px;
      }
    }
    .phone{
      margin-bottom: 20px;
      img{
        width: 50px;
        height: 50px;
        margin-right: 20px;
        border-radius: 4px;
      }
    }
  }
  .content{
    background: #fff;
    padding:20px 20px 0 20px;
    .add{
      margin:10px 0;
    }
  }
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
</style>
