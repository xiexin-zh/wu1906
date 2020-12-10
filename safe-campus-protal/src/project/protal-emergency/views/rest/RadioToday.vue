<template>
  <div class="page-layout qui-fx-ver">
    <search-form isReset @search-form="searchForm" :search-label="today.searchLabel">
    </search-form>
    <table-list
      :page-list="pageList"
      :columns="today.columns"
      :table-list="userList"
    >
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="试听" v-if="action.record.state !== '0' ">
          <a-button size="small" class="play-action-btn" icon="play-circle" @click="play(action.record)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <preview-audio v-model="previewTag" :url="url"></preview-audio>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import today from '../../assets/js/table/today'
import SearchForm from '@c/SearchForm'
import PreviewAudio from '../../component/PreviewAudio'
export default {
  name: 'RadioToday',
  components: {
    TableList,
    PageNum,
    SearchForm,
    PreviewAudio
  },
  data() {
    return {
      today,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {
        date: this.$tools.getDate(new Date(), 1)
      },
      userList: [],
      previewTag: false,
      url: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getTodayRadio', 'delSafeTask', 'delSafeTasks']),
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getTodayRadio(this.searchList)
      this.userList = res.data.records
      this.total = res.data.total
    },
    // 查询
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this.searchList.date = values.date ? values.date : this.$tools.getDate(new Date(), 1)
      this.showList()
    },
    // 试听
    play(record) {
      this.previewTag = true
      this.url = record.audioUrl
    }
  }
}
</script>
<style lang="less" scoped>
</style>
