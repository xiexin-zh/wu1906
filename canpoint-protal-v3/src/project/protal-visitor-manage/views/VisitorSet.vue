<template>
  <div class="visitor-record page-layout u-fx u-type-white-bg">
    <u-choose-teacher
      is-check
      ref="chooseTeacherRef"
      v-if="showTag"
      v-model="showTag"
      :schoolCode="schoolCode"
      @submit="submitUser"
      title="选择人员"
    ></u-choose-teacher>
    <div class="left-tree layout-padd-t">
      <u-org-tree @select="select" :school="schoolCode"></u-org-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <div class="layout-padd">
        <u-search-form :search-label="setSearch" @search="search">
          <div slot="left">
            <u-button type="primary" icon="plus" @click="bindUser">添加人员</u-button>
          </div>
        </u-search-form>
      </div>
      <u-table is-zoom :page-list="pageList" :columns="setTable" :table-list="setList">
        <template v-slot:slotOne="slotOne">
          <u-type>{{ getDataState('sex', slotOne.record.respondentGender) }}</u-type>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" delete @click="_deleteSetUser(actions.record.id)">删除</u-button>
        </template>
      </u-table>
      <u-pagination :total="total" v-model="pageList" @change="_setList"></u-pagination>
    </div>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import setTable from '../table-columns/set'
import setSearch from '../search-columns/set'
export default {
  name: 'VisitorSet',
  data() {
    return {
      getDataState,
      setTable,
      setSearch,
      setList: [],
      showTag: false,
      pageList: {
        page: 1,
        size: 20
      },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo'])
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['getSetList', 'bindSet', 'deleteSetUser']),
    /**
     * 权限人员列表
     */
    async _setList(searchObj = {}) {
      const res = await this.getSetList({
        ...this.pageList,
        schoolCode: this.schoolCode,
        orgCode: this.orgCode,
        ...searchObj
      })
      this.setList = res.data.list
      this.total = res.data.total
    },
    select(values) {
      this.orgCode = values.code === this.schoolCode ? '' : values.code
      this._setList()
    },
    /**
     * 搜索
     */
    search(values) {
      this._setList(values)
    },
    /**
     * 绑定设备
     */
    bindUser() {
      this.showTag = true
    },
    async submitUser(values) {
      const result = values.map(item => {
        return {
          orgCode: item.orgCode,
          orgName: item.orgName,
          photoUrl: item.photoUrl,
          respondentCode: item.userCode,
          respondentGender: item.gender,
          respondentMobile: item.mobile,
          respondentName: item.userName,
          schoolCode: this.schoolCode,
          schoolName: this.loginInfo.schoolName
        }
      })
      try {
        await this.bindSet({
          respondentInfoDtoList: result
        })
        this.$tools.message('success', '添加成功')
        this.$refs.chooseTeacherRef.reset()
        this.$tools.goNext(this._setList)
      } catch (err) {
        this.$refs.chooseTeacherRef.console.error()
      }
    },
    /**
     * 删除人员
     * @param { number } id 设备id
     */
    async _deleteSetUser(id) {
      await this.deleteSetUser({
        id
      })
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(this._setList)
    }
  }
}
</script>
<style lang="less" scoped></style>
