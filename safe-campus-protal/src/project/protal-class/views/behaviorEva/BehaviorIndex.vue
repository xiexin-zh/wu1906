<template>
  <div class="page-layout qui-fx-ver">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
    </submit-form>
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="modify(0)">新增指标</a-button>
    </div>
    <table-list :page-list="pageList" :columns="columns" :table-list="scorePlanList">
      <template v-slot:other1="record">
        <a-button size="small" class="power-action-btn" icon="lock" @click="check(record.record)"></a-button>
      </template>
      <template v-slot:actions="action">
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(1, action.record)">
          <template slot="title">您确定{{ action.record.status === '2' ? '启用' : '禁用' }}吗?</template>
          <a-tooltip placement="topLeft" :title="action.record.status === '2' ? '启用' : '禁用'">
            <a-button size="small" class="play-action-btn" icon="play-circle"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click="modify(2, action.record)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(0, action.record)">
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tooltip placement="topLeft" title="授权">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click.stop="modify(1, action.record)"
          ></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="changePage"></page-num>
    <choose-user
      ref="chooseUser"
      is-check
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      :chooseType="chooseType"
      :bindObj="bindObj"
      title="添加人员"
    >
    </choose-user>
    <a-modal title="查看人列表" width="700px" :footer="null" v-model="visible">
      <table-list :page-list="pageList" :columns="authorColumns" :table-list="authorList" :scroll-h="360"></table-list>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import ChooseUser from '@c/ChooseUser'
const formData = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '名称',
    max: 8,
    placeholder: '请输入名称'
  }
]
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '方案名称',
    dataIndex: 'name',
    width: '20%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '20%',
    customRender: text => {
      if (text === '1') {
        return '启用'
      } else {
        return '禁用'
      }
    }
  },
  {
    title: '查看人',
    width: '20%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '30%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

const authorColumns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '40%'
  },
  {
    title: '编码',
    width: '40%',
    dataIndex: 'userCode'
  }
]
export default {
  name: 'BehaviorIndex',
  components: {
    PageNum,
    TableList,
    SubmitForm,
    ChooseUser
  },
  data() {
    return {
      authorColumns,
      userTag: false,
      formData,
      title: '新增指标',
      scorePlanList: [],
      loading: false,
      isTag: true, // true为添加 false为编辑
      columns,
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      examPlanId: '',
      formStatus: false,
      indexId: '',
      appraiseItemId: '',
      chooseType: 'class',
      bindObj: {
        groupCode: ''
      },
      visible: false,
      authorList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.categoryGet()
  },
  methods: {
    ...mapActions('home', [
      'getIndex',
      'delIndex',
      'indexDetail',
      'getAuthorList',
      'updateIndex',
      'addIndex',
      'updateAuthor'
    ]),
    // 授权查看人选择
    async chooseUser(teacherList) {
      const userCodes = teacherList.map(el => {
        return el.userCode
      })
      const req = {
        appraiseItemId: this.appraiseItemId,
        userCodes: userCodes
      }
      await this.updateAuthor(req)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.$refs.chooseUser.reset()
        this.categoryGet()
      })
    },
    // 操作分页组件回调, 更新searchForm的值
    changePage() {
      this.categoryGet()
    },
    filterSearch(data) {
      data.forEach((el, index) => {
        this.$set(el, 'code', index)
      })
      return data
    },
    async modify(type, record) {
      if (type) {
        // const res = await this.indexDetail(text.id)
        if (type === 1) {
          this.appraiseItemId = record.id
          this.bindObj.groupCode = record.id
          this.userTag = true
        } else if (type === 2) {
          this.title = '编辑指标'
          this.formData = this.$tools.fillForm(formData, record)
          this.indexId = record.id
          this.formStatus = true
        } else {
          this.title = '新增指标'
        }
      } else {
        this.title = '新增指标'
        this.formData = this.$tools.fillForm(formData, [])
        this.formStatus = true
      }
    },
    categoryGet() {
      this.pageList.schoolCode = this.userInfo.schoolCode
      this.getIndex(this.pageList).then(res => {
        this.scorePlanList = res.data.list
        this.total = res.data.total
      })
    },
    async submitForm(values) {
      try {
        const params = {
          schoolCode: this.userInfo.schoolCode,
          status: '1',
          name: values.name
        }

        if (this.title === '编辑指标') {
          params.id = this.indexId
          await this.updateIndex(params)
        } else {
          await this.addIndex(params)
        }
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.categoryGet()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    del(type, text) {
      if (type) {
        // 启用禁用
        const req = {
          status: text.status === '1' ? '2' : '1',
          id: text.id
        }
        this.updateIndex(req).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.categoryGet()
          })
        })
      } else {
        // 删除
        this.delIndex(text.id).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.categoryGet()
          })
        })
      }
    },
    async authorGet() {
      const res = await this.getAuthorList(this.indexId)
      this.authorList = res.data
    },
    check(record) {
      this.indexId = record.id
      this.authorGet()
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
.qui-fx-f3 {
  min-width: 0px;
  flex: 3;
  position: relative;
}
.score-info {
  display: inline-block;
  width: 75px;
  color: #000;
}
</style>
