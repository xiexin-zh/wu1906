<template>
  <div class="teacher page-layout u-fx u-type-white-bg">
    <div class="u-padd-t5 left-tree">
      <u-org-post :school="schoolCode" @select="select" :key="index"></u-org-post>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form :search-label="searchLabel" @search="search" ref="searchForm" @reset="reset">
          <div slot="left">
            <u-space>
              <u-button icon="plus" @click="addRoles(0)" type="primary">添加教职工</u-button>
              <u-download hasIcon :reqObj="reqObj" title="导出" fileName="教职工" type="light"></u-download>
              <u-button icon="import" @click="batch(1)" type="light">批量导入</u-button>
            </u-space>
          </div>
          <div slot="right"></div>
        </u-search-form>
        <u-space class="u-fx-ac u-choose-item">
          已选择 {{ chooseList.length }} 项数据
          <u-button @click="dels" :disabled="chooseList.length === 0" type="danger" delete>批量删除</u-button>
        </u-space>
      </u-space>
      <div class="u-fx u-fx-f1">
        <u-table
          is-zoom
          is-check
          :page-list="pageList"
          :columns="columns"
          :table-list="roleList"
          v-model="chooseList"
        >
          <template v-slot:actions="actions">
            <u-button type="link" @click="addRoles(1, actions.record)">编辑</u-button>
            <u-button type="link" delete @click="del(actions.record)">删除</u-button>
          </template>
        </u-table>
      </div>
      <u-pagination justify="end" v-model="pageList" :total="total" @change="_getTeacherList"></u-pagination>
    </div>
    <add-tea ref="addTea" v-model="visible" :title="title" @update="_getTeacherList"></add-tea>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AddTea from '../../component/AddTea.vue'
import columns from '../../table-columns/teacher'
import searchLabel from '../../search-columns/teacher'
import formData from '../../submit-columns/athority'
import RoleTree from '@/components/common/RoleTree.vue'
export default {
  name: 'Teacher',
  components: {
    AddTea,
    RoleTree
  },
  data() {
    return {
      formData,
      searchLabel,
      roleList: [],
      columns,
      chooseList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {},
      visible: false,
      title: '',
      reqObj: {
        url: '/protal_v3_11101/canpointUserInfo/teacher/export',
        method: 'post'
      },
      index: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    if (this.$route.query.type === 'fastAction') {
      this.visible = true
      this.title = '添加'
    }
    if (this.$route.query.type === 'waitInfo' && this.$route.query.info === 'photo') {
      this.$refs.searchForm.form.setFieldsValue({ hasPhoto: '0' })
      this.searchObj.hasPhoto = false
      this._getTeacherList()
    } else {
      this.searchLabel[3].initValue = []
    }
  },
  methods: {
    ...mapActions('home', ['getTeacherList', 'delTeacher', 'delTeachers']),
    select(value) {
      this.searchObj.orgCode = value.type === '1' ? value.code : ''
      this.searchObj.stationCode = value.type === '2' ? value.code : ''
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this._getTeacherList()
    },
    // 获取数据列表
    async _getTeacherList() {
      this.searchObj.schoolCode = this.schoolCode
      this.searchObj = Object.assign(this.searchObj, this.pageList)
      const res = await this.getTeacherList(this.searchObj)
      this.roleList = res.data.records.map(el => {
        return {
          ...el,
          _id: el.userCode,
          hasJob: el.hasJob ? '1' : '0'
        }
      })
      this.total = res.data.total
    },
    // 列表搜索
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      values.hasPhoto = values.hasPhoto === '1' ? true : values.hasPhoto === '0' ? false : ''
      this.searchObj = values
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this._getTeacherList()
    },
    // 添加/编辑角色  0-添加 1-编辑
    addRoles(type, record) {
      this.visible = true
      this.title = type ? '编辑' : '添加'
      this.$refs.addTea.appForm = type ? record : {}
      this.$refs.addTea.appForm.hasJob = type ? record.hasJob : '1'
      this.$refs.addTea.appForm.gender = type ? record.gender : '1'
      this.$refs.addTea.imgList = type ? [{ url: record.photoUrl }] : []
      this.$refs.addTea.defaultValue = type ? record.orgCode.split(',') : []
      this.$refs.addTea.orgCode = type ? record.orgCode.split(',') : []
      this.$refs.addTea.orgName = type ? record.orgName : ''
      this.$refs.addTea.appForm.stationCodeList = type
        ? record.stationCodeStr.length > 0
          ? record.stationCodeStr.split(',')
          : []
        : []
    },
    // 删除员工-单个
    del(record) {
      const req = {
        userCode: record.userCode,
        schoolCode: this.schoolCode
      }
      this.deleteUser(1, req)
    },
    // 批量删除
    async dels() {
      const req = {
        schoolCode: this.schoolCode,
        userCodeList: this.chooseList
      }
      this.deleteUser(0, req)
    },
    // 删除用户
    async deleteUser(type, req) {
      type ? await this.delTeacher(req) : await this.delTeachers(req)
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(this._getTeacherList)
      this.chooseList = []
    },
    batch() {
      this.$router.push({
        path: '/batchImport',
        query: {
          type: 'teacher',
          status: '1'
        }
      })
    },
    reset() {
      this.index++
    }
  }
}
</script>
<style lang="less" scoped>
</style>
