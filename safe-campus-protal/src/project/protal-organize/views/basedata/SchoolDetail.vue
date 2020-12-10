<template>
  <div class="class-detail page-layout qui-fx-ver">
    <detail-show :detail-info="detailInfo" :title="infoTitle"></detail-show>
    <div class="content qui-fx-f1">
      <a-tabs v-model="autoKey">
        <a-tab-pane :tab="item.title" :key="item.key" v-for="item in tabList">
          <table-list
            v-if="item.key === '1'"
            :style="{height: scrollH -80+ 'px'}"
            :page-list="pageList"
            :columns="column"
            :table-list="dataList">
            <template v-slot:actions="action">
              <a-tooltip placement="topLeft" title="详情">
                <a-button size="small" class="detail-action-btn" icon="ellipsis" @click.stop="goDetail('/basedata/classDetail',action.record)"></a-button>
              </a-tooltip>
            </template>
          </table-list>
          <org-manage v-if="item.key === '2'" :readOnly="true" :school="schoolCode"></org-manage>
          <class v-if="item.key === '3'" :school="schoolCode"></class>
          <teachers v-if="item.key === '4'" :school="schoolCode"></teachers>
          <students v-if="item.key === '5'" :school="schoolCode"></students>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import DetailShow from '@c/DetailShow'
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import OrgManage from '@c/OrgManage'
import Teachers from './Teachers'
import Students from './Students'
import Class from './Class'
import Tools from '@u/tools'

const column = [
  {
    title: '序号',
    width: '25%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '管理员姓名',
    dataIndex: 'userName',
    width: '25%'
  },
  {
    title: '管理员手机号',
    dataIndex: 'mobile',
    width: '25%'
  },
  {
    title: '注册日期',
    dataIndex: 'registeDate',
    width: '25%',
    customRender: (text) => {
      return Tools.getDate(text).substring(0, 10)
    }
  }
]
export default {
  name: 'SchoolDetail',
  components: {
    TableList,
    SearchForm,
    Teachers,
    Students,
    DetailShow,
    OrgManage,
    Class
  },
  data () {
    return {
      autoKey: '1',
      dataList: [],
      column,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      detailInfo: [
        {
          key: '学校名称',
          val: ''
        },
        {
          key: '学校编码',
          val: ''
        },
        {
          key: '学段',
          val: ''
        },
        {
          key: '创建时间',
          val: ''
        },
        {
          key: '学校地址',
          val: ''
        },
        {
          key: '备注',
          val: ''
        }
      ],
      scrollH: 0,
      infoTitle: '基础信息',
      tabList: [
        { key: '1', title: '管理员' },
        { key: '2', title: '组织结构' },
        { key: '3', title: '班级信息' },
        { key: '4', title: '教职工信息' },
        { key: '5', title: '学生信息' }],
      schoolCode: ''
    }
  },
  created () {
    this.scrollH = document.documentElement.offsetHeight - 360
    this.showDetail()
  },
  mounted () {
  },
  methods: {
    ...mapActions('home', [
      'getAdmin', 'getSchoolById', 'getClassList'
    ]),
    async showDetail () {
      const res = await this.getSchoolById(this.$route.query.id)
      if (!res.data) return
      const arr = res.data.schoolStage.split(',')
      const newArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '01') {
          newArr.push('小学')
        } else if (arr[i] === '02') {
          newArr.push('初中')
        } else if (arr[i] === '03') {
          newArr.push('高中')
        }
      }
      this.detailInfo[0].val = res.data.schoolName
      this.detailInfo[1].val = res.data.schoolCode
      this.detailInfo[2].val = newArr.join(',')
      this.detailInfo[3].val = this.$tools.getDate(res.data.createTime)
      this.detailInfo[4].val = res.data.mergerName + res.data.detailAddress
      this.detailInfo[5].val = res.data.remark
      this.schoolCode = res.data.schoolCode
      this.showList()
    },
    async showList () {
      this.dataList = []
      const req = {
        ...this.pageList,
        schoolCode: this.schoolCode
      }
      const res = await this.getAdmin(req)
      if (!res.data) return
      this.dataList.push(res.data)
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
