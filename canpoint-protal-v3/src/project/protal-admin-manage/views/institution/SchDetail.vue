<template>
  <div class="sch-detail page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-detail-show :detail-info="detailInfo" title="基础信息"></u-detail-show>
    </u-space>
    <u-tabs @change="callback" v-model="activeTab" :tab-list="tabList"></u-tabs>
    <div class="u-fx-ver u-fx-f1">
      <div v-if="activeTab === '1' || (activeTab === '2' && type === 'sch')">
        <div v-if="activeTab === '2'" class="u-padd-l">
          <a-radio-group v-model="typeKey" button-style="solid">
            <a-radio-button value="4">教职工</a-radio-button>
            <a-radio-button value="5">家长</a-radio-button>
          </a-radio-group>
        </div>
        <div v-if="applyList.length === 0" class="u-fx-f1 u-fx-ac-jc">
          <u-empty description="暂无关联应用~">
            <u-button type="primary" icon="plus" @click="showDrawer">绑定</u-button>
          </u-empty>
        </div>
        <div v-else>
          <div class="u-fx-ac-jc app-check add" @click="showDrawer">
            <div>+</div>
            <div>添加应用</div>
          </div>
          <div class="u-fx-ac-jc app-check" v-for="item in applyList" :key="item.id">
            <img class="right-img" :src="item.appLogo" alt />
            <div class="title u-te">{{ item.appName }}</div>
            <a-icon class="del" type="minus-circle" @click="del(item)" />
          </div>
        </div>
      </div>
      <div v-if="activeTab === '2' && type ==='edu'" class="u-fx u-fx-f1">
        <sub-school :type="schoolInfo.level"></sub-school>
      </div>
      <div v-if="activeTab === '3'" class="u-fx u-fx-f1">
        <u-table
          v-if="userList.length !== 0"
          :columns="tableColumns.schDetail"
          :table-list="userList"
          :page-list="pageList"
        ></u-table>
        <div v-else class="u-fx-f1 u-fx-jc">
          <u-empty description="暂无人员列表~">
            <u-button type="light" icon="plus" @click="formStatus = true">添加管理员</u-button>
          </u-empty>
        </div>
      </div>
    </div>
    <!-- 绑定应用弹框 -->
    <bind-apply
      ref="bindApply"
      :plateformType="plateformType"
      :category="defaultActiveKey"
      :schoolInfo="schoolInfo"
      :bindList="bindList"
      v-model="visible"
      v-if="visible"
      @update="update"
    ></bind-apply>
    <!-- 添加管理员弹框 -->
    <u-submit-form
      ref="form"
      :width="600"
      @submit="submitForm"
      title="添加管理员"
      v-model="formStatus"
      :form-data="submitColumns.schDetail"
    ></u-submit-form>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import tableColumns from '../../table-columns/tableColumns.js'
import submitColumns from '../../submit-columns/submitColumns.js'
import { mapActions } from 'vuex'
import BindApply from '../../component/BindApply'
import SubSchool from '../../component/SubSchool'
import DetailShow from '@c/DetailShow'

export default {
  name: 'SchDetail',
  components: {
    DetailShow,
    BindApply,
    SubSchool
  },
  data() {
    return {
      tableColumns,
      submitColumns,
      tabList: [
        {
          key: '1',
          title: 'PC应用'
        },
        {
          key: '2',
          title: 'APP应用'
        },
        {
          key: '3',
          title: '管理员'
        }
      ],
      typeKey: '4',
      defaultActiveKey: '1',
      userList: [],
      formStatus: false,
      activeTab: '1',
      detailInfo: {},
      bindList: [],
      applyList: [],
      schoolInfo: {},
      visible: false,
      plateformType: '1',
      pageList: {
        page: 1,
        size: 20
      },
      type: ''
    }
  },
  watch: {
    typeKey(n) {
      console.log('n', n)
      this.defaultActiveKey = n
      this.showData()
    }
  },
  mounted() {
    this.type = this.$route.query.type
    if (this.type === 'edu') {
      this.tabList[1].title = '下属机构'
      this.defaultActiveKey = '2'
    }
    this.showInstitute(this.$route.query.id)
  },
  methods: {
    ...mapActions('home', ['searchBindApp', 'schoolDetail', 'delBindApp', 'addAdmin', 'getAdmin']),
    showDrawer() {
      this.visible = true
      this.bindList = this.applyList
    },
    async update() {
      this.visible = false
      await this._searchBindApp()
    },
    async showInstitute(id) {
    const res = await this.schoolDetail({ schoolCode: id })
      this.schoolInfo = res.data
      if (this.type === 'edu') {
        this.detailInfo = {
          机构名称: res.data.schoolName,
          机构编码: res.data.schoolCode,
          机构级别: getDataState('eduLevel', res.data.level),
          创建时间: this.$tools.getDate(res.data.createTime),
          机构地址: res.data.area ? res.data.area.substring(3).replace(/,/g, '/') + ' ' + res.data.detailAddress : '',
          备注: res.data.remark
        }
      } else {
        this.detailInfo = {
          学校名称: res.data.schoolName,
          学校编码: res.data.schoolCode,
          办学层次: this.filtersData(res.data.sectionList),
          学校类型: getDataState('schoolType', res.data.schoolType),
          学校地址: res.data.area ? res.data.area.substring(3).replace(/,/g, '/') + ' ' + res.data.detailAddress : '',
          创建时间: this.$tools.getDate(res.data.createTime),
          备注: res.data.remark
        }
      }
      this._searchBindApp()
      this.adminGet()
    },
    filtersData(text) {
      const newArr = []
      for (let i = 0; i < text.length; i++) {
        if (text[i].sectionType === '1') {
          newArr.push('幼儿园')
        } else if (text[i].sectionType === '2') {
          newArr.push('小学')
        } else if (text[i].sectionType === '3') {
          newArr.push('初中')
        } else if (text[i].sectionType === '4') {
          newArr.push('高中')
        } else if (text[i].sectionType === '5') {
          newArr.push('中职')
        } else if (text[i].sectionType === '6') {
          newArr.push('高校')
        }
      }
      return newArr.join(',')
    },
    // 已关联的应用
    async _searchBindApp() {
      const web = await this.searchBindApp({ schoolCode: this.schoolInfo.schoolCode })
      this.allApply = web.data
      this.applyList = web.data.pcAppList
      await this.showData()
    },
    // 管理员列表
    async adminGet() {
      const res = await this.getAdmin({ schoolCode: this.schoolInfo.schoolCode })
      this.userList = []
      if (res.data) {
        res.data.id = res.data.mobile
        this.userList = [res.data]
      }
    },
    showData() {
      this.applyList =
        this.activeTab === '1'
          ? this.allApply.pcAppList
          : this.activeTab === '2' && this.typeKey === '4'
          ? this.allApply.teacherAppList
          : this.activeTab === '2' && this.typeKey === '5'
          ? this.allApply.parentAppList
          : []
    },
    callback(key) {
      this.showData()
      this.plateformType = parseInt(key) === 1 ? '1' : parseInt(key) === 2 ? '3' : ''
      this.defaultActiveKey =
        this.type === 'edu' && parseInt(key) === 1
          ? '2'
          : this.type === 'sch' && parseInt(key) === 1
          ? '1'
          : this.type === 'sch' && parseInt(key) === 2
          ? this.typeKey
          : ''
    },
    async submitForm(values) {
      try {
        values.schoolCode = this.schoolInfo.schoolCode
        await this.addAdmin(values)
        this.$refs.form.reset()
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.adminGet()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    del(record) {
      this.$tools.delTip('确定删除当前应用吗？', () => {
        const req = {
          appId: record.id,
          schoolCode: this.schoolInfo.schoolCode
        }
        this.delBindApp(req).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this._searchBindApp()
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.sch-detail {
  .app-check {
    width: 120px;
    height: 120px;
    margin: 25px 0 5px 25px;
    float: left;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    .title {
      margin-top: 10px;
      overflow: hidden;
    }
    .right-img {
      width: 62px;
      height: 62px;
      position: relative;
    }
    .del {
      color: red;
      font-size: 14px;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .add {
    width: 75px;
    height: 75px;
    margin-top: 40px;
    border: 1px solid #0099ff;
    color: #0099ff;
  }
}
</style>
