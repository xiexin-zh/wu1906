<template>
  <u-modal
    closable
    cancelText="关闭"
    :isOk="false"
    @confirm="confirm"
    :width="800"
    title="人员列表"
    v-model="status"
    v-if="value"
  >
    <div style="height: 500px" class="u-fx">
      <u-table :page-list="pageList" :columns="userTable" :table-list="userList"></u-table>
    </div>
    <u-pagination :total="total" v-model="pageList" @change="_getUserListApi"></u-pagination>
  </u-modal>
</template>

<script>
import userTable from '@a/table-columns/user'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'UserList',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      userTable,
      userList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  mounted() {
    this._getUserListApi()
  },
  methods: {
    ...mapActions('home', ['getUserListApi']),
    /**
     * 获取人员列表
     */
    async _getUserListApi() {
      const res = await this.getUserListApi({
        roleId: this.roleId,
        schoolCode: this.schoolCode,
        ...this.pageList
      })
      this.userList = res.data.records
      this.total = res.data.total
    },
    confirm() {
      this.status = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
