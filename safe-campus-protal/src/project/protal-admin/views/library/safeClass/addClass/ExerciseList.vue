<template>
  <a-modal
    :destroyOnClose="true"
    v-model="status"
    width="1200px"
    title="课堂习题列表"
    :footer="null"
    :confirmLoading="confirmLoading"
    @cancel="close">
    <div class="qui-fx-ver statistic" >
      <search-form is-reset @search-form="searchForm" :search-label="exerciseSearchLabel">
        <div slot="left">
          <a-button icon="plus" class="add-action-btn u-mar-l20" @click="addAll">批量添加</a-button>
        </div>
      </search-form>
      <table-list
        is-check
        is-zoom
        v-model="chooseList"
        :page-list="pageList"
        :columns="exerciseListColumns"
        :table-list="tableList">
        <template v-slot:actions="action">
          <a-button size="small" type="primary" class="add-action-btn" @click="add(action.record)">添加</a-button>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </a-modal>
</template>
<script>
import { exerciseListColumns } from '../../../../assets/js/tableColumns'
import { exerciseSearchLabel } from '../../../../assets/js/searchLabel'
import PageNum from '@c/PageNum'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
export default {
  name: 'ExerciseList',
  components: {
    TableList,
    SearchForm,
    PageNum
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
      pageList: {
        page: 1,
        size: 10
      },
      total: 0,
      visible: true,
      isLoad: true,
      confirmLoading: false,
      exerciseListColumns,
      exerciseSearchLabel,
      findList: [],
      tableList: []
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
  async created() {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'ecsBindPage'
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
        source: '1',
        ...this.pageList,
        ...this.searchList,
        userCode: this.userInfo.userCode,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.ecsBindPage(req)
      this.tableList = res.data.records
      this.total = res.data.total
    },
    // 批量添加
    addAll() {
      if (this.chooseList.length === 0) return this.$message.info('请选中习题')
      const recordArr = this.tableList.filter(v => this.chooseList.includes(v.id))
      this.$parent.sonSelected(recordArr)
      this.reset()
    },
    add(record) {
      const recordArr = [record]
      this.$parent.sonSelected(recordArr)
      this.reset()
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
.task-add {
  background-color: #f5f5fb;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .input {
      width: 90%;
      border: 1px dashed #cfcfcf;
    }
   }
}
</style>
