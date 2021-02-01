<template>
  <div class="school-post u-fx-f1 u-fx-ver">
    <a-table
      :defaultExpandAllRows="autoDown"
      :pagination="false"
      :columns="tableSchoolPost"
      :dataSource="orgData"
      style="background-color: #fff"
      :rowKey="record => record.id"
    >
    </a-table>
  </div>
</template>
<script>
import { tableSchoolPost } from '../../../table-columns/schoolMge'
import { mapActions } from 'vuex'
export default {
  name: 'SchoolPost',
  components: {
    tableSchoolPost
  },
  props: {
    // 学校code
    schoolCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tableSchoolPost,
      orgData: [],
      autoDown: true
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getPost']),
    // 管理员列表
    async showList() {
      const res = await this.getPost({ schoolCode: this.schoolCode })
      this.orgData = res.data ? this.newOrgData([res.data]) : []
    },
    // 深层递归处理数据
    newOrgData(data) {
      data.forEach(item => {
        item.children = item.children || null
        if (item.children && item.children.length > 0) {
          this.newOrgData(item.children)
        }
      })
      return data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
