<template>
  <a-modal
    :destroyOnClose="true"
    v-model="status"
    width="1100px"
    :title="title"
    :footer="null"
    :confirmLoading="confirmLoading"
    @cancel="close">
    <div class="qui-fx-ver statistic" >
      <div class="title u-mar-b10">{{ schoolName }}
      </div>
      <table-list
        :page-list="pageList"
        :columns="UndoneTaskColumns"
        :table-list="tableList"
      >
        <template v-slot:actions="action" class="u-fx">
          <div @click="undoneTaskCount(action.record)" class="text u-type-primary">{{ action.record.undoneTaskCount }}</div>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </a-modal>
</template>
<script>
import PageNum from '@c/PageNum'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import { UndoneTaskColumns } from '../../assets/js/tableColumns.js'
import SearchForm from '@c/SearchForm'
export default {
  name: 'PreviewReport',
  components: {
    TableList,
    SearchForm,
    PageNum
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      title: '未巡检详情',
      tableList: [],
      UndoneTaskColumns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      schoolName: '',
      confirmLoading: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        // return true
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
  },
  methods: {
    ...mapActions('home', [
      'eduUndonePage'
    ]),
    async setData(schoolName, schoolCode, startValue, endValue) {
      this.schoolName = schoolName
      this.schoolCode = schoolCode
      this.startValue = startValue
      this.endValue = endValue
      this.showList()
    },
    async showList() {
      const req = {
        ...this.pageList,
        startYear: Number(this.startValue.format('YYYY')),
        startMonth: Number(this.startValue.format('M')),
        endYear: Number(this.endValue.format('YYYY')),
        endMonth: Number(this.endValue.format('M')),
        schoolCode: this.schoolCode
      }
      const res = await this.eduUndonePage(req)
      this.total = res.data.total
      this.tableList = res.data.records
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    close() {
      this.$emit('closeModal')
    },
    error() {
      this.confirmLoading = false
    }
  }
}
</script>
<style lang="less" scoped>
.title{
      position: relative;
      .line{
        position: absolute;
        left:2px;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 4px;
        height: 13px;
        background: #9698D6;
      }
    }
  // .content {
  //   height: calc(100% - 10px);
  //   overflow-y: scroll;
  //  }
</style>
