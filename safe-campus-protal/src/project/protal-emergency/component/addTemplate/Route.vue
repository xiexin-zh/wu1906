<template>
  <div class="lessonPlan qui-fx-ver">
    <div class="u-padd-10 u-padd-l20 u-padd-t40">
      <a-row type="flex" justify="center">
        <a-col :span="18" class="u-tx-c">
          <a-button icon="plus" class="add-action-btn u-mar-b20" type="primary" @click="add">添加疏散路线图</a-button>
          <div>请在【演练疏散路线】内添加备选路线图</div>
        </a-col>
      </a-row>
      <table-list
        class="u-mar-t20"
        :columns="columns"
        :table-list="routeList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete" @click="del(action.record)"></a-button>
          </a-tooltip>
        </template>
      </table-list>
      <div class="u-tx-c u-mar-t20">
        <a-button type="primary" @click="previous">上一步</a-button>
        <a-button class="mar-l10" type="primary" @click="nextStep">下一步</a-button>
        <a-button class="mar-l10" @click="carryOut" >完成</a-button>
      </div>
    </div>
    <add-route v-model="addTag"></add-route>
  </div>
</template>

<script>
import TableList from '@c/TableList'
import AddRoute from './AddRoute'
import { mapActions } from 'vuex'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '标题',
    dataIndex: 'name',
    width: '40%'
  },
  {
    dataIndex: 'photoUrl',
    width: '30%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'Route',
  components: {
    TableList,
    AddRoute
  },
  data() {
    return {
      columns,
      routeList: [],
      addTag: false
    }
  },
  async created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', [ 'getTemplateRoute', 'addTemplateRoute' ]),
    // 添加教案
    add() {
      this.addTag = true
    },
    del(record) {
      this.routeList = this.routeList.filter(v => v.id !== record.id) // 去重
    },
    // 获取详情
    async showDetail() {
      const res = await this.getTemplateRoute({ emergencyId: this.id })
      if (res.data.length === 0) return // 为空数组的时候不赋值
      this.routeList = res.data
    },
    // 子组件选择的资源
    sonSelected(record) {
      if (this.routeList.length === 0) {
        this.routeList = this.routeList.concat(record)
      } else {
        const chenckedArr = record.filter(v => this.routeList.findIndex(i => i.id === v.id) === -1) // 去重
        this.routeList = this.routeList.concat(chenckedArr)
      }
    },
    previous() {
      this.$parent.isActive('3')
    },
    // 完成
    carryOut() {
      this.submitOk().then(el => {
        this.$router.push('/emergencyPlan')
      })
    },
    // 下一步
    nextStep() {
      this.submitOk().then(el => {
        this.$parent.isActive('5')
      })
    },
    // 提交
    submitOk(e) {
      return new Promise((resolve, reject) => {
        const req = {
          emergencyId: this.id,
          ids: this.routeList.map(el => el.id)
        }
        this.addTemplateRoute(req).then(res => {
          return resolve(res)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.lessonPlan {
  .ant-collapse{
    background-color: #fff;
    border: none;
    .ant-collapse-item{
      border: 1px solid #f5f5f5;
      margin-bottom: 20px;
      @{deep} .header{
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
