<template>
  <div class="visitor-reason page-layout u-fx-ver u-type-white-bg layout-padd">
    <u-space direction="vertical">
      <u-alert message description="访客填写预约申请单时，需选择来访事由，平台已为您预设若干来访事由，可根据您的实际需求进行新增、编辑，至多添加10个哦~"></u-alert>
      <div class="u-fx-ac layout-padd-t layout-padd-b">
        <a-input v-model="causeName" type="text" placeholder="请输入事由" style="width: 200px"></a-input>
        <u-button type="primary" icon="plus" class="u-mar-l10" @click="_addCause">添加事由</u-button>
      </div>
      <div style="width: 600px; height: 580px" class="u-fx u-bd-r u-bd-l u-bd-t u-bd-b">
        <u-table :columns="causeTable" :table-list="causeList">
          <template v-slot:slotOne="slotOne">
            <u-tag type="primary">{{ slotOne.record.causeName }}</u-tag>
          </template>
          <template v-slot:actions="actions">
            <u-button type="link" delete @click="_deletaCause(actions.record.id)">删除</u-button>
          </template>
        </u-table>
      </div>
    </u-space>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import causeTable from '../table-columns/cause.js'
export default {
  name: 'VisitorReason',
  components: {},
  data() {
    return {
      causeName: '',
      causeTable,
      causeList: [],
      pageList: {
        page: 1,
        size: 20
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._causeList()
  },
  methods: {
    ...mapActions('home', ['initCause', 'getCauseList', 'addCause', 'deletaCause']),
    /**
     * 初始化
     */
    async _initCause() {
      const res = await this.initCause({
        schoolCode: this.schoolCode
      })
      this.causeList = res.data.list
    },
    /**
     * 获取列表
     */
    async _causeList() {
      const res = await this.getCauseList({
        pageNum: 1,
        pageSize: 12,
        schoolCode: this.schoolCode
      })
      // 如果事由为空则初始化
      if (res.data.list.length === 0) {
        this._initCause()
      } else {
        this.causeList = res.data.list
      }
    },
    /**
     * 新增事由
     */
    async _addCause() {
      if (!this.causeName) {
        this.$tools.message('warning', '请输入事由')
        return
      }
      if (this.causeList.length >= 10) {
        this.$tools.message('warning', '最多添加10个事由')
        return
      }
      await this.addCause({
        schoolCode: this.schoolCode,
        causeName: this.causeName
      })
      this.$tools.message('success', '新增成功')
      this.causeName = ''
      this.$tools.goNext(this._causeList)
    },
    /**
     * 删除事由
     * @param { string } id 事由id
     */
    async _deletaCause(id) {
      await this.deletaCause({
        id: id
      })
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(this._causeList)
    }
  }
}
</script>
<style lang="less" scoped></style>
