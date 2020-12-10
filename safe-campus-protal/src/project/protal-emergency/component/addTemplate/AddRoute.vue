<template>
  <a-modal
    :destroyOnClose="true"
    v-model="status"
    width="800px"
    title="疏散路线图列表"
    :footer="null"
    :confirmLoading="confirmLoading"
    @cancel="close">
    <div class="qui-fx-ver" >
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
    title: '疏散路线图',
    dataIndex: 'photoUrl',
    width: '30%',
    scopedSlots: {
      customRender: 'photoPic'
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
export default {
  name: 'AddRoute',
  components: {
    TableList
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
      findList: [],
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
      'getRouteImg'
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
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getRouteImg(req)
      this.tableList = res.data.records
      this.total = res.data.total
    },
    add(record) {
      const recordArr = [record]
      this.$parent.sonSelected(recordArr)
      this.reset()
      // this.close()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
