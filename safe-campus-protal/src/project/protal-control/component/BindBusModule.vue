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
          :columns="busColumns"
          :table-list="busList">
        </table-list>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import busColumns from '../assets/js/table/busColumns'
import PageNum from '@c/PageNum'
export default {
  name: 'BindBusiness',
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
      busList: [],
      confirmLoading: false,
      busColumns: busColumns.slice(0, busColumns.length - 1)
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
      'getUnBindBusList', 'controlGroupBind'
    ]),
    changePage () {
      this.showBusGroup()
    },
    async showBusGroup () {
      const res = await this.getUnBindBusList({
        controlGroupCode: this.groupCode,
        schoolCode: this.schoolCode,
        ...this.pageList
      })
      this.busList = res.data.map(item => {
        return {
          ...item,
          id: item.appCode
        }
      })
    },
    bindHandle () {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择业务规则')
        return
      }
      const req = {
        schoolCode: this.schoolCode,
        controlGroupCode: this.groupCode,
        relationType: 3,
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
