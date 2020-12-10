<template>
  <div class="class-honor qui-fx">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
    </submit-form>
    <div class="right qui-fx-ver">
      <div class="qui-fx-je u-mar-b10">
        <a-button class="mar-r10" type="primary" @click="addHonor(0)">
          <a-icon type="plus" />新增
        </a-button>
        <a-button type="danger" @click="deleHonor(0)">
          <a-icon type="delete" />批量删除
        </a-button>
      </div>
      <table-list
        is-check
        is-zoom
        :page-list="pageList"
        v-model="chooseList"
        :columns="columns"
        :table-list="dataList"
      >
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="修改">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addHonor(1, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleHonor(1, action.record)">
            <template slot="title">
              您确定删除吗?
            </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'
import SubmitForm from '@c/SubmitForm'
const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '招领内容',
    dataIndex: 'content',
    width: '20%'
  },
  {
    title: '发布者',
    dataIndex: 'createUserName',
    width: '20%'
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'content',
    initValue: '',
    type: 'textarea',
    label: '招领内容',
    max: 100,
    minRows: 5,
    maxRows: 10,
    placeholder: '请输入招领内容, 不超过100个字符'
  }
]
export default {
  components: {
    TableList,
    PageNum,
    SubmitForm
  },
  data () {
    return {
      columns,
      formData,
      formStatus: false,
      title: '新增',
      dataList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      chooseList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created () {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getLostList', 'addLost', 'editLost', 'deleLost', 'batchDeleLost']),
    async showList () {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getLostList(req)
      this.dataList = res.data.list
      this.total = res.data.total
    },
    deleHonor(type, record) {
      if (type) {
        this.deleLost(record.id).then(() => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择删除项')
          return
        }
        this.$tools.delTip('确定删除吗？', () => {
          this.batchDeleLost(this.chooseList.join(',')).then(() => {
            this.$message.success('删除成功')
            this.$tools.goNext(() => {
              this.showList()
            })
          })
        })
      }
    },
    addHonor(type, record) {
      this.formStatus = true
      if (type) {
        console.log(record)
        this.title = '编辑'
        this.formData = this.$tools.fillForm(formData, record)
        this.id = record.id
        this.type = 1
      } else {
        this.title = '新增'
        this.formData = formData
        this.type = 0
      }
    },
    submitForm(values) {
      const req = {
        ...values,
        schoolCode: this.userInfo.schoolCode,
        createUserCode: this.userInfo.userCode,
        createUserName: this.userInfo.userName
      }
      let res = null
      if (this.type === 0) {
        res = this.addLost(req)
      } else {
        req.id = this.id
        res = this.editLost(req)
      }
      res
        .then(() => {
          this.$message.success(this.type === 0 ? '新增成功' : '编辑成功')
          this.$tools.goNext(() => {
            this.showList()
            this.$refs.form.reset()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    }
  }
}
</script>

<style lang="less" scoped>
.class-honor{
  flex: 1;
  overflow: hidden;
  .right{
    position: relative;
    flex: 1;
    background: #fff;
    padding: 10px;
    width: calc(100%);
  }
}
</style>
