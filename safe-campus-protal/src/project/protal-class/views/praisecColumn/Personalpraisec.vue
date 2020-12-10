/* eslint-disable space-infix-ops */
<template>
  <div class="classpraisec page-layout qui-fx">
    <div class="qui-fx qui-fx-jsb" style="width: 100%">
      <div class="left">
        <major-tree
          v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
          @select="select"
        ></major-tree>
        <grade-tree v-else @select="select"></grade-tree>
      </div>
      <div class="right qui-fx-ver qui-fx-f1">
        <div slot="left" class="qui-fx-je mar-10">
          <a-button icon="plus" class="add-btn" @click="modify()">添加</a-button>
          <a-button icon="delete" class="del-btn" @click.stop="deleteList(0)">批量删除</a-button>
        </div>
        <table-list
          is-check
          is-zoom
          @clickRow="clickRow"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="recordList"
        >
          <template v-slot:actions="action">
            <!-- <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="modify(1, action.record)"
              ></a-button>
            </a-tooltip>-->
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteList(1, action.record)"
            >
              <template slot="title">您确定删除吗?</template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
          <template v-slot:other1="record">{{ record.record.praiseName }}</template>
          <template v-slot:other2="action">
            <div v-for="(ele, index) in action.record.labelList" :key="index">
              <a-tag color="blue">{{ ele.label }}</a-tag>
            </div>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
        <add-praises ref="addPraises" :title="title" @update="showList"></add-praises>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import GradeTree from '@c/GradeTree'
import MajorTree from '@c/MajorTree'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import AddPraises from '../../component/AddPraises'
import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '表扬语',
    width: '15%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '获得的学生',
    width: '15%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '学生照片',
    dataIndex: 'praiseNamePhoto',
    width: '15%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '发布人',
    dataIndex: 'createUsername',
    width: '10%'
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: (text) => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'Classpraisec',
  components: {
    TableList,
    GradeTree,
    PageNum,
    NoData,
    AddPraises,
    MajorTree
  },
  data() {
    return {
      columns,
      title: '新增',
      formStatus: false,
      classChoose: '',
      chooseList: [],
      type: 0,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {
        schoolCode: '',
        classCode: '',
        category: 2,
        gradeCode: ''
      },
      recordList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions('home', [
      'addsetPraise',
      'delsetPraise',
      'praisesetList',
      'updatesetPraise',
      'getpraiseDetail'
    ]),
    select(item) {
      this.searchList.classCode = item.classCode
      if (this.searchList.classCode) {
        this.showList()
      }
    },
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList.schoolYearId = JSON.parse(
        window.sessionStorage.getItem('schoolYear')
      ).schoolYearId
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.praisesetList(this.searchList)
      if (!res.data.list) {
        this.recordList = []
        return
      }
      this.recordList = res.data.list
      this.total = res.data.total
    },
    async modify() {
      this.title = '新增'
      this.$refs.addPraises.appForm = {}
      this.$refs.addPraises.classList = []
      this.$refs.addPraises.addVisible = true
    },
    async deleteList(type, record) {
      if (type) {
        const req = {
          ids: [record.id]
        }
        await this.delsetPraise(req)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择删除项')
          return
        }
        const req = {
          ids: this.chooseList
        }
        this.$tools.delTip('您确定删除吗?', () => {
          this.delsetPraise(req).then((res) => {
            this.$message.success('删除成功')
            this.chooseList = []
            this.$tools.goNext(() => {
              this.showList()
            })
          })
        })
      }
    },
    clickRow(id) {}
  }
}
</script>
<style lang="less" scoped>
.classpraisec {
  .mar-10 {
    margin: 10px;
  }
}
</style>
