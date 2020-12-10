<template>
  <a-modal
    title="新增设备"
    v-model="bindVisible"
    :destroyOnClose="true"
    width="1120px"
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
          :columns="deviceColumns"
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
import deviceColumns from '../assets/js/table/unBindDeviceColumns'
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
    },
    deviceType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      chooseList: [],
      deviceGroupList: [],
      confirmLoading: false,
      deviceColumns: deviceColumns,
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
    this.showDevice()
  },
  methods: {
    ...mapActions('home', [
      'getDeviceList', 'bindDevice'
    ]),
    changePage () {
      this.showDevice()
    },
    async showDevice () {
      const res = await this.getDeviceList({
        deviceType: this.deviceType,
        bindStatus: 2,
        schoolCode: this.schoolCode,
        ...this.pageList
      })
      this.deviceGroupList = res.data.list.map(item => {
        return {
          ...item,
          id: item.deviceSn
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
        deviceGroupCode: this.groupCode,
        deviceType: this.deviceType,
        deviceSns: this.chooseList
      }
      this.confirmLoading = true
      this.bindDevice(req).then(res => {
        this.$message.success('绑定成功')
        this.$tools.goNext(() => {
          this.confirmLoading = false
          this.$parent.getDeviceList()
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
