<template>
  <div class="rule-set page-layout u-fx-ver u-type-white-bg">
    <u-search-form class="u-padd-10" :search-label="classSearchLabel" @search="search">
      <div slot="left">
        <u-button icon="plus" type="primary" @click="classAction(0)">添加班次</u-button>
      </div>
    </u-search-form>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="classColumns" :table-list="classList">
        <template v-slot:slotOne="slotOne">
          <div class="u-fx-ver">
            <div class="u-fx" v-for="(ele, i) in slotOne.record.ruleTimeDtoList" :key="i">
              <span v-if="ele.startTime">{{ ele.startTime }} ~ {{ ele.endTime }}</span>
            </div>
          </div>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="classAction(1,actions.record.id)">编辑</u-button>
          <u-button type="link" delete @click="delClass(actions.record.id)">删除</u-button>
        </template>
      </u-table>
    </div>
    <u-pagination justify="end" v-model="pageList" :total="total" @change="_getClassList"></u-pagination>
    <add-class ref="addClass" v-model="visible" @update="_getClassList" :class-obj="classObg"></add-class>
  </div>
</template>

<script>
import AddClass from '../../component/AddClass'
import { mapState, mapActions } from 'vuex'
import { classSearchLabel, classColumns } from '../../table-columns/group'
export default {
  name: 'RuleSet',
  components: {
    AddClass
  },
  data() {
    return {
      classSearchLabel,
      classColumns,
      classList: [],
      classObg: {},
      visible: false,
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._getClassList()
  },
  methods: {
    ...mapActions('home', ['getShiftManage', 'delShiftManage', 'bindAccessUser', 'shiftManageDetail']),
    // 列表查询
    async _getClassList() {
      const res = await this.getShiftManage({
        name: this.name,
        ...this.pageList,
        schoolCode: this.schoolCode
      })
      this.classList = res.data.list
      this.total = res.data.total
    },
    // 列表搜索
    search(values) {
      this.pageList.page = 1
      this.name = values.name
      this._getClassList(this.searchObj)
    },
    // 添加编辑班次
    async classAction(type, id) {
      if (type) {
        // 编辑获取详情
        const res = await this.shiftManageDetail({ id: id })
        this.classObg = res.data
        this.$refs.addClass.shiftName = this.classObg.name
        this.$refs.addClass.classId = id
        this.$refs.addClass.data = this.classObg.list.map((el, index) => {
          return {
            id: index,
            key: index + 1,
            startTime: el.startTime,
            endTime: el.endTime,
            time: el.workTime,
            checked: el.hasValid === '1'
          }
        })
      } else {
        this.$refs.addClass.classId = ''
        this.$refs.addClass.shiftName = ''
        this.$refs.addClass.data = this.$refs.addClass.data.map(el => {
          return {
            ...el,
            time: '00:00',
            startTime: '00:00',
            endTime: '00:00',
            checked: true
          }
        })
      }
      this.visible = true
    },
    // 删除班次
    async delClass(id) {
      await this.delShiftManage({ id })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this._getClassList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
