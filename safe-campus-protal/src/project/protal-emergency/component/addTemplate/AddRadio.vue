<template>
  <a-modal
    :destroyOnClose="true"
    v-model="status"
    width="800px"
    title="添加广播"
    :footer="null"
    :confirmLoading="confirmLoading"
    @cancel="close">
    <div class="qui-fx-ver" >
      <search-form @search-form="searchForm" :search-label="searchLabel">
      </search-form>
      <table-list
        v-model="chooseList"
        :columns="columns"
        :table-list="tableList">
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
    title: '广播名称',
    dataIndex: 'name',
    width: '50%'
  },
  {
    title: '操作',
    width: '40%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'broadcastName',
    type: 'input',
    label: '广播名称',
    placeholder: '请输入'
  }
]
export default {
  name: 'AddRadio',
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
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      visible: true,
      isLoad: true,
      columns,
      searchLabel,
      tableList: [],
      confirmLoading: false
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
  watch: {
  },
  created() {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getRadioSource'
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
        size: 9999,
        ...this.searchList,
        schoolCode: this.userInfo.schoolCode,
        broadcastType: '1'
      }
      const res = await this.getRadioSource(req)
      this.tableList = res.data.records
      this.total = res.data.total
    },
    add(record) {
      const recordArr = [record]
      this.$parent.sonSelected(recordArr)
      this.reset()
      // this.close()
    },
    // 弹框方法
    searchForm(values) {
      this.searchList = values
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
