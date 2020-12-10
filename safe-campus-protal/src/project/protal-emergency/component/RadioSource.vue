<template>
  <div class="page-layout qui-fx-ver">
    <div class="tips u-padd-l10 u-mar-b10">
      温馨提示：广播资源上传后存储在云端服务器，播放时根据云端储存地址自动下载。删除资源后，服务器与本地资源同步删除。
    </div>
    <search-form isReset @search-form="searchForm" :search-label="source.searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="add(0)">添加广播资源</a-button>
        <a-button icon="delete" class="del-btn" @click.stop="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="source.columns"
      :table-list="userList"
      v-model="chooseList"
    >
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="播放">
          <a-button size="small" class="play-action-btn" icon="play-circle" @click="play(1, action.record)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="试听">
          <a-button size="small" class="copy-action-btn" icon="copy" @click="play(0, action.record)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="编辑"
        >
          <a-button size="small" class="edit-action-btn" icon="form" @click="add(1,action)"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="del(action)"
        >
          <template slot="title">确定删除该广播资源吗？</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="_getRadioSource"></page-num>
    <preview-audio v-model="previewTag" :url="url"></preview-audio>
    <play-audio v-model="playTag" :url="url" :type="type" @update="_getRadioSource"></play-audio>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import source from '../assets/js/table/source.js'
import SearchForm from '@c/SearchForm'
import PreviewAudio from './PreviewAudio'
import PlayAudio from './PlayAudio'
export default {
  name: 'RadioSource',
  components: {
    TableList,
    PageNum,
    SearchForm,
    PreviewAudio,
    PlayAudio
  },
  data() {
    return {
      source,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      userList: [],
      form: this.$form.createForm(this),
      chooseList: [],
      previewTag: false,
      playTag: false,
      url: '',
      type: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getClassifyByCode()
    this._getRadioSource()
  },
  methods: {
    ...mapActions('home', ['getRadioSource', 'delRadioSource', 'delRadioSources', 'getClassifyByCode']),
    // 资源分类列表
    async _getClassifyByCode() {
      const res = await this.getClassifyByCode(this.userInfo.schoolCode)
      this.source.searchLabel[0].list = res.data.map(el => {
        return {
          key: el.code,
          val: el.name
        }
      })
      this.source.searchLabel[0].list.unshift({ key: '', val: '全部' })
    },
    // 广播资源列表
    async _getRadioSource() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getRadioSource(this.searchList)
      this.userList = res.data.records.map(el => {
        return {
          ...el,
          id: el.code
        }
      })
      this.total = res.data.total
    },
    // 查询
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this._getRadioSource()
    },
    // 添加
    add(type, record) {
      this.$router.push({
        path: 'sourceMange/addRadioSource',
        query: {
          code: type ? record.record.code : ''
        }
      })
    },
    // 播放和试听
    play(type, record) {
      if (type) {
        this.playTag = true
      } else {
        this.previewTag = true
      }
      this.type = record.type
      this.url = record.url
    },
    // 删除单条记录
    async del(record) {
      await this.delRadioSource(record.record.code)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._getRadioSource()
        this.chooseList = []
      })
    },
    // 批量删除
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的广播资源')
        return false
      }
      this.$tools.delTip('确定删除选中的广播资源吗？', () => {
        this.delRadioSources(this.chooseList).then((res) => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this._getRadioSource()
            this.chooseList = []
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tips {
  line-height: 36px;
  background-color: #ffffcc;
}
</style>
