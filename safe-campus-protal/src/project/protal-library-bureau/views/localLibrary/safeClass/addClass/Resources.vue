<template>
  <div class="exercise page-layout qui-fx-ver">
    <!-- <div class="content pos-box bg-fff"> -->
    <div class="u-padd-10 u-padd-l20 u-padd-t40 ">
      <a-row :gutter="[50,100]" type="flex" justify="center" >
        <a-col :span="18" >
          <div class="u-fx-ac u-mar-b10">
            <a-button icon="plus" class="add-action-btn mar-l10" type="primary" @click="addNewResources">上传新资源</a-button>
            <a-button icon="plus" class="add-action-btn mar-l10" type="primary" @click="addResources">从库中选择</a-button>
            <a-button class="mar-l10" type="primary" @click="delAll">批量删除</a-button>
          </div>
          <table-list
            is-check
            is-zoom
            v-model="chooseList"
            :page-list="pageList"
            :columns="resourcesColumns"
            :table-list="findList">
            <template v-slot:actions="action">
              <a-popconfirm
                placement="topLeft"
                ok-text="确定"
                cancel-text="取消"
                @confirm="del(action.record)">
                <template slot="title">
                  确定删除该资源吗？
                </template>
                <a-tooltip placement="topLeft" title="删除">
                  <a-button size="small" class="del-action-btn" icon="delete" ></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </table-list>
        </a-col>
      </a-row>
      <div class="u-tx-c u-mar-t20">
        <a-button @click="previous">上一步</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" >完成</a-button>
      </div>
    </div>
    <resources-list ref="form" v-model="formStatus" ></resources-list>
    <new-resources ref="newForm" v-model="newFormStatus" ></new-resources>
  </div>
</template>

<script>
import { resourcesColumns } from '../../../../assets/js/tableColumns'
import { exerciseSearchLabel } from '../../../../assets/js/searchLabel'
import PageNum from '@c/PageNum'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
export default {
  name: 'Resources',
  components: {
    TableList,
    PageNum,
    resourcesList: () => import('./ResourcesList'),
    newResources: () => import('./NewResources')
  },
  data() {
    return {
      resourcesColumns,
      exerciseSearchLabel,
      findList: [],
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      pageList: {
        page: 1,
        size: 20
      },
      // 库中添加资源
      formStatus: false,
      // 新上传资源
      newFormStatus: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
  },
  async created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.showList()
    }
  },
  methods: {
    ...mapActions('home', [
      'resourceSearch',
      'resourceBind'
    ]),
    async showList() {
      const res = await this.resourceSearch(this.id)
      this.findList = res.data
      // this.total = res.data.total
    },
    addResources() {
      this.formStatus = true
    },
    // 子组件选择的资源
    sonSelected(record) {
      if (this.findList.length === 0) {
        this.findList = this.findList.concat(record)
      } else {
        const chenckedArr = record.filter(v => this.findList.findIndex(i => i.id === v.id) === -1) // 去重
        this.findList = this.findList.concat(chenckedArr)
      }
    },
    delAll() {
      if (this.chooseList.length <= 0) return this.$message.error('请选择资源')
      const that = this
      this.$confirm({
        title: '提示',
        content: '确定批量删除选中的资源吗?',
        onOk () {
          that.findList = that.findList.filter(v => !that.chooseList.includes(v.id))
        },
        onCancel () {
        }
      })
    },
    del(record) {
      this.findList = this.findList.filter(v => v.id !== record.id)
    },
    // 上传新的资源
    addNewResources() {
      this.newFormStatus = true
    },
    // 上一步
    previous() {
      this.$parent.isActive('3')
    },
    // 提交
    async submitOk(e) {
      const req = {
        classId: Number(this.id),
        resourceIds: this.findList.map(v => v.id)
      }
      await this.resourceBind(req)
      this.$router.push('/safeClassLocal')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
