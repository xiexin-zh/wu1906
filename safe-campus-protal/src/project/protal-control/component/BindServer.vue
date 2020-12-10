<template>
  <a-modal
    title="新增业务规则"
    v-model="bindVisible"
    :destroyOnClose="true"
    width="900px"
    @ok="bindHandle"
    okText="提交"
    :confirmLoading="confirmLoading"
  >
    <div style="height: 600px" class="qui-fx-ver">
      <div class="wrap-table qui-fx-f1" id="controlTable">
        <table-list
          is-check
          v-model="chooseList"
          :page-list="pageList"
          :columns="identColumns"
          :table-list="identList">
        </table-list>
      </div>
      <page-num :total="total" v-model="pageList" @change-page="changePage"></page-num>
    </div>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
const identColumns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '15%'
  }, {
    title: '名称',
    dataIndex: 'serverName',
    width: '40%'
  }, {
    title: 'ip',
    dataIndex: 'serverIp',
    width: '20%'
  }, {
    title: '备注',
    dataIndex: 'remarks',
    width: '20%'
  }
]
export default {
  name: 'BindServer',
  components: {
    PageNum,
    TableList
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    groupCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      chooseList: [],
      identList: [],
      confirmLoading: false,
      identColumns,
      pageList: {
        page: 1,
        size: 20
      },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
    bindVisible: {
      get () {
        return this.value
      },
      set () {
        this.$emit('input', false)
      }
    }
  },
  mounted () {
    this.showBusGroup()
  },
  methods: {
    ...mapActions('home', [
      'getUnBindIdent', 'controlGroupBind'
    ]),
    changePage () {
      this.showBusGroup()
    },
    async showBusGroup () {
      const res = await this.getUnBindIdent({
        controlGroupCode: this.groupCode,
        schoolCode: this.schoolCode,
        ...this.pageList
      })
      this.identList = res.data.list.map(item => {
        return {
          ...item,
          id: item.serverCode
        }
      })
      this.total = res.data.total
    },
    bindHandle () {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择识别服务')
        return
      }
      const req = {
        schoolCode: this.schoolCode,
        controlGroupCode: this.groupCode,
        relationType: 2,
        relationCodes: this.chooseList
      }
      this.confirmLoading = true
      this.controlGroupBind(req).then(res => {
        this.$message.success('绑定成功')
        this.$tools.goNext(() => {
          this.confirmLoading = false
          this.$parent.getDeviceGroup()
          this.bindVisible = false
        })
      }).catch(() => {
        this.confirmLoading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
