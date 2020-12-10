<template>
  <a-modal
    :destroyOnClose="true"
    v-model="status"
    width="800px"
    title="监控摄像头列表"
    :footer="null"
    :confirmLoading="confirmLoading"
    @cancel="close">
    <div class="qui-fx-ver">
      <div class="tip u-padd-10 u-border-radius">
        <div>温馨提示</div>
        <div>1. 请选择视频获取摄像头信息！</div>
        <div>2. 如果获取不到摄像头数据，请点击 <span class="u-type-primary refresh" @click="showList">刷新</span></div>
      </div>
      <search-form @search-form="searchForm" :search-label="searchLabel">
      </search-form>
      <table-list :columns="columns" :table-list="tableList">
        <template v-slot:actions="action">
          <a-button size="small" type="primary" class="add-action-btn" @click="add(action.record)">添加</a-button>
        </template>
      </table-list>
    </div>
  </a-modal>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '30%'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '30%'
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'deviceName',
    type: 'input',
    label: '设备名称',
    placeholder: '请输入'
  }
]
export default {
  name: 'AddVideo',
  components: {
    TableList,
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns,
      searchLabel,
      tableList: [],
      confirmLoading: false,
      deviceName: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  created() {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getDeviceList'
    ]),
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    close() {
      this.$emit('closeModal')
    },
    error() {
      this.confirmLoading = false
    },
    async showList() {
      const req = {
        page: 1,
        size: 99999,
        deviceType: 1,
        deviceName: this.deviceName,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getDeviceList(req)
      this.tableList = res.data.list
    },
    add(record) {
      const recordArr = [record]
      this.$parent.sonSelected(recordArr)
      this.reset()
      // this.close()
    },
    // 弹框搜索方法
    searchForm(values) {
      this.deviceName = values.deviceName
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
.tip {
  background-color: #ff7b7b;
}
.refresh {
  cursor: pointer;
}
</style>
