<template>
  <a-modal
    title="新增设备组"
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
          :columns="deviceGroupColumns"
          :table-list="deviceGroupList">
        </table-list>
      </div>
      <page-num :total="total" v-model="pageList" @change-page="changePage"></page-num>
    </div>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import deviceGroupColumns from '../assets/js/table/deviceGroupColumns'
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
      deviceGroupList: [],
      confirmLoading: false,
      deviceGroupColumns: deviceGroupColumns.slice(0, deviceGroupColumns.length - 1),
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
    this.showDeviceGroup()
  },
  methods: {
    ...mapActions('home', [
      'getUnbindDeviceGroupList', 'controlGroupBind'
    ]),
    changePage () {
      this.showDeviceGroup()
    },
    async showDeviceGroup () {
      const res = await this.getUnbindDeviceGroupList({
        controlGroupCode: this.groupCode,
        schoolCode: this.schoolCode,
        ...this.pageList
      })
      this.deviceGroupList = res.data.list.map(item => {
        return {
          ...item,
          id: item.deviceGroupCode
        }
      })
      this.total = res.data.total
    },
    bindHandle () {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择设备组')
        return
      }
      const req = {
        schoolCode: this.schoolCode,
        controlGroupCode: this.groupCode,
        relationType: 1,
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
