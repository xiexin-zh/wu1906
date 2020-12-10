<template>
  <div class="teachers page-layout qui-fx">
    <div class="qui-fx qui-fx-jsb" style="width:100%">
      <div class="left">
        <org-tree @select="select" @defaultCode="defaultCode" :school="school"></org-tree>
      </div>
      <div class="right qui-fx-ver qui-fx-f1">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        </search-form>
        <table-list
          is-zoom
          :scrollH="350"
          :page-list="pageList"
          :columns="columns"
          :table-list="teacherList">
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import OrgTree from '@c/OrgTree'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
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
    title: '教职工姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '10%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10',
    customRender: (text) => {
      return Tools.getSex(text)
    }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: '10%'
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '15%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '15%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  }
]
const searchLabel = [
  {
    value: 'keyword',
    initValue: '',
    type: 'selectInput',
    selectType: [
      {
        key: 'userName',
        val: '姓名'
      },
      {
        key: 'mobile',
        val: '手机号'
      },
      {
        key: 'workNo',
        val: '工号'
      }
    ],
    placeholder: '请输入'
  }
]
export default {
  name: 'Teachers',
  components: {
    TableList,
    OrgTree,
    PageNum,
    SearchForm
  },
  props: {
    school: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogTag: false,
      confirmLoading: false,
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      teacherList: [],
      keyword: ''
    }
  },
  mounted () {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getTeacherList'
    ]),
    defaultCode(item) {
      this.orgCodeList = item.code
      this.orgName = item.name
    },
    select (item) {
      this.orgCode = item.code
      this.orgName = item.name
      this.orgCodeList = []
      this.orgCodeList = (this.familyTree(item.treeData, item.id))
      this.showList()
    },
    // 遍历数组 查找节点的父节点
    familyTree (arr1, id) {
      var temp = []
      var forFn = function (arr, id) {
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i]
          if (item.id === id) {
            temp.unshift(item.code)
            forFn(arr1, item.parentId)
            break
          } else {
            if (item.children) {
              forFn(item.children, id)
            }
          }
        }
      }
      forFn(arr1, id)
      return temp
    },
    searchForm (values) {
      this.keyword = values.keyword
      this.showList(values.keyword)
    },
    async showList (keyword = '') {
      const req = {
        ...this.pageList,
        schoolCode: this.school,
        orgCode: this.orgCode,
        keyword
      }
      const res = await this.getTeacherList(req)
      if (!res.data) {
        return
      }
      this.teacherList = res.data.list
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped>
.teachers{
  background: #fff;
  height: 100%;
  .left{
    padding: 10px;
  }
  .right{
    padding: 0 10px;
    border-left: 1px solid @bor-color;
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

</style>
