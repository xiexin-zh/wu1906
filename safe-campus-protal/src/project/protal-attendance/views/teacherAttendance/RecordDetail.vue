<template>
  <a-modal
    width="800px"
    title="操作记录"
    v-model="dialogTag"
    :maskClosable="false"
    :destroyOnClose="true"
    :footer="null"
  >
    <table-list
      :scroll-h="350"
      :columns="columns"
      :table-list="recordList">
    </table-list>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import columns from '../../assets/js/table/teacherOperate'
export default {
  name: 'RecordDetail',
  components: {
    TableList
  },
  data () {
    return {
      dialogTag: false,
      columns,
      recordList: [],
      recordId: ''
    }
  },
  methods: {
    ...mapActions('home', ['getRecordList']),
    async showList () {
      const res = await this.getRecordList({ recordId: this.recordId, userType: '1' })
      this.recordList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
