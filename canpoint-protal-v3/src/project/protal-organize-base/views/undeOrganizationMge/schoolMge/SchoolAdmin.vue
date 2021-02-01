<template>
  <div class="school-admin u-fx-f1 u-fx-ver">
    <u-table
      :columns="tableSchoolAdmin"
      :table-list="userList"
      :page-list="pageList"
    ></u-table>
  </div>
</template>
<script>
import { tableSchoolAdmin } from '../../../table-columns/schoolMge'
import { mapActions } from 'vuex'
export default {
  name: 'SchoolAdmin',
  components: {
    tableSchoolAdmin
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
      tableSchoolAdmin,
      userList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      total: 0,
      list: [],
      chooseList: [],
      schoolName: '',
      areaList: []
    }
  },
  mounted() {
    this.adminGet()
  },
  methods: {
    ...mapActions('home', ['getAdmin']),
    // 管理员列表
    async adminGet() {
      const res = await this.getAdmin({ schoolCode: this.schoolCode })
      this.userList = []
      if (res.data) {
        res.data.id = res.data.mobile
        this.userList = [res.data]
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
