<template>
  <div class="lessonPlan qui-fx-ver">
    <div class="u-padd-10 u-padd-l20 u-padd-t40">
      <a-row type="flex" justify="center">
        <a-col :span="18" class="u-tx-c">
          <a-button icon="plus" class="add-action-btn u-mar-b20" type="primary" @click="add">添加应急器材</a-button>
          <div>请在【应急救援器材】内添加备选器材</div>
        </a-col>
      </a-row>
      <table-list
        class="u-mar-t20"
        :columns="columns"
        :table-list="equipList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete" @click="del(action.record)"> </a-button>
          </a-tooltip>
        </template>
      </table-list>
      <div class="u-tx-c u-mar-t20">
        <a-button type="primary" @click="previous">上一步</a-button>
        <a-button class="mar-l10" @click="carryOut" >完成</a-button>
      </div>
    </div>
    <add-equip v-model="addTag"></add-equip>
  </div>
</template>

<script>
import TableList from '@c/TableList'
import AddEquip from './AddEquip'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '器材名称',
    dataIndex: 'name',
    width: '20%'
  },
  {
    title: '器材数量',
    dataIndex: 'amount',
    width: '20%'
  },
  {
    title: '存放位置',
    dataIndex: 'address',
    width: '20%'
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
    AddEquip
  },
  data() {
    return {
      columns,
      equipList: [],
      isLoad: false,
      addTag: false
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
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', [ 'getTemplateEquip', 'addTemplateEquip' ]),
    // 获取详情
    async showDetail() {
      const res = await this.getTemplateEquip({ emergencyId: this.id })
      if (res.data.length === 0) return // 为空数组的时候不赋值
      this.equipList = res.data
    },
    // 添加教案
    add() {
      this.addTag = true
    },
    del(record) {
      this.equipList = this.equipList.filter(v => v.id !== record.id) // 去重
    },
    // 子组件选择的资源
    sonSelected(record) {
      if (this.equipList.length === 0) {
        this.equipList = this.equipList.concat(record)
      } else {
        const chenckedArr = record.filter(v => this.equipList.findIndex(i => i.id === v.id) === -1) // 去重
        this.equipList = this.equipList.concat(chenckedArr)
      }
    },
    previous() {
      this.$parent.isActive('4')
    },
    // 完成
    carryOut() {
      this.submitOk().then(el => {
        this.$router.push('/emergencyPlan')
      })
    },
    // 提交
    submitOk(e) {
      return new Promise((resolve, reject) => {
        const req = {
          emergencyId: this.id,
          ids: this.equipList.map(el => el.id)
        }
        this.addTemplateEquip(req).then(res => {
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
