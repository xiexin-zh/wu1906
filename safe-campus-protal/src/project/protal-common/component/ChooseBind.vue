<template>
  <a-modal
    width="1200px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <a-tabs v-model="activeKey" @change="tabChange">
          <a-tab-pane tab="班级" key="1" class="choose-user qui-fx">
            <div class="org-box">
              <major-tree
                :is-class="false"
                v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
                @select="classSelect"
              ></major-tree>
              <grade-tree v-else isOnlyNewSchoolYear @select="classSelect" :isChoose="true"></grade-tree>
            </div>
            <div class="qui-fx-ver qui-fx-f1">
              <table-list
                :minHeight="500"
                :scroll-h="450"
                is-check
                :page-list="pageList"
                v-model="classChooseList"
                :columns="columns1"
                @clickRow="classClickRow"
                @selectAll="selectAllClass"
                :table-list="classTableList"
              >
                <template
                  v-slot:other2="record"
                >{{ record.record.gradeName }}{{ record.record.className }}</template>
              </table-list>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="教职工" key="2" class="choose-user">
            <div class="qui-fx-f1">
              <search-form isReset @search-form="teaSearch" :search-label="searchLabel"></search-form>
            </div>
            <div class="qui-fx">
              <div class="org-box">
                <org-tree @select="teaSelect" @defaultCode="defaultCode"></org-tree>
              </div>
              <div class="qui-fx-ver qui-fx-f1">
                <table-list
                  :minHeight="500"
                  :scroll-h="450"
                  is-check
                  :page-list="pageList"
                  v-model="teaChooseList"
                  :columns="columns2"
                  @clickRow="teaClickRow"
                  @selectAll="selectAllTea"
                  :table-list="teaTableList"
                >
                  <template
                    v-slot:other2="record"
                  >{{ record.record.gradeName }}{{ record.record.className }}</template>
                </table-list>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="设备" key="3" class="choose-user">
            <div class="qui-fx-f1">
              <search-form isReset @search-form="deviceSearch">
                <template v-slot:place>
                  <a-form-item label="绑定场地">
                    <a-cascader
                      :options="buildList"
                      @click.stop="onFocus"
                      :loadData="loadData"
                      placeholder="请选择绑定场地"
                      v-decorator="['places']"
                    />
                  </a-form-item>
                  <a-form-item label="关联数据">
                    <a-cascader
                      :options="classList"
                      @click.stop="classOnFocus"
                      :loadData="classLoadData"
                      placeholder="请选择关联数据"
                      v-decorator="['classes']"
                    />
                  </a-form-item>
                </template>
              </search-form>
            </div>
            <table-list
              :minHeight="500"
              :scroll-h="450"
              is-check
              :page-list="pageList"
              v-model="deviceChooseList"
              :columns="columns3"
              @clickRow="deviceClickRow"
              @selectAll="selectAllDevice"
              :table-list="deviceTableList"
            >
              <template
                v-slot:other2="record"
              >{{ record.record.gradeName }}{{ record.record.className }}</template>
            </table-list>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="user-box qui-fx-ver">
        <a-tabs v-model="activeKey">
          <a-tab-pane tab="班级" key="1">
            <div class="title qui-fx-jsb">
              <span>已选择</span>
              <span>{{ classTotalList.length }}个</span>
            </div>
            <div class="choose-list qui-fx-f1" style="overflow: auto">
              <ul>
                <li
                  v-for="(item, index) in classTotalList"
                  :key="item.classCode"
                  class="qui-fx-jsb qui-fx-ac"
                >
                  <span>{{ item.gradeName }}{{ userInfo.schoolType === '8' || userInfo.schoolType === '9' ? item.subjectName : '' }}{{ item.className }}</span>
                  <a-tag @click="delClass(item.classCode, index)" color="#f50">删除</a-tag>
                </li>
              </ul>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="教职工" key="2">
            <div class="title qui-fx-jsb">
              <span>已选择</span>
              <span>{{ teaTotalList.length }}个</span>
            </div>
            <div class="choose-list qui-fx-f1" style="overflow: auto">
              <ul>
                <li
                  v-for="(item, index) in teaTotalList"
                  :key="item.userCode"
                  class="qui-fx-jsb qui-fx-ac"
                >
                  <span>{{ item.userName }}</span>
                  <a-tag @click="delTea(item.userCode, index)" color="#f50">删除</a-tag>
                </li>
              </ul>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="设备" key="3">
            <div class="title qui-fx-jsb">
              <span>已选择</span>
              <span>{{ deviceTotalList.length }}个</span>
            </div>
            <div class="choose-list qui-fx-f1" style="overflow: auto">
              <ul>
                <li
                  v-for="(item, index) in deviceTotalList"
                  :key="item.deviceSn"
                  class="qui-fx-jsb qui-fx-ac"
                >
                  <span>{{ item.gradeName }}{{ item.className }}</span>
                  <a-tag @click="delDevice(item.deviceSn, index)" color="#f50">删除</a-tag>
                </li>
              </ul>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </a-modal>
</template>

<script>
import GradeTree from '@c/GradeTree'
import OrgTree from '@c/OrgTree'
import MajorTree from '@c/MajorTree'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import { mapState } from 'vuex'
import $ajax from '@u/ajax-serve'
import hostEnv from '@config/host-env'
const searchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  }
]
const columns1 = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '20%'
  },
  {
    title: '专业',
    dataIndex: 'subjectName',
    width: '20%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '20%'
  },
  {
    title: '班主任',
    dataIndex: 'teacherName',
    width: '20%'
  }
]
const columns2 = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '30%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '30%'
  }
]
const columns3 = [
  {
    title: '序号',
    width: '25%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '绑定场地',
    dataIndex: 'placeName',
    width: '25%'
  },
  {
    title: '安装位置',
    dataIndex: 'site',
    width: '25%',
    customRender: text => {
      return parseInt(text) === 1 ? '室内' : '室外'
    }
  },
  {
    title: '关联数据',
    dataIndex: 'className',
    width: '25%',
    scopedSlots: {
      customRender: 'other2'
    }
  }
]
export default {
  name: 'ChooseSubteacher',
  components: {
    TableList,
    SearchForm,
    GradeTree,
    OrgTree,
    MajorTree
  },
  props: {
    isCheck: {
      type: Boolean,
      default: true
    },
    chooseType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    bindObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      confirmLoading: false,
      activeKey: '1',
      keyword: '',
      classChooseList: [],
      teaChooseList: [],
      deviceChooseList: [],
      pageList: {
        page: 1,
        size: 999999
      },
      searchLabel,
      columns1,
      columns2,
      columns3,
      searchList: {},
      classTableList: [],
      deviceTableList: [],
      teaTableList: [],
      classTotalList: [],
      teaTotalList: [],
      deviceTotalList: [],
      buildList: [],
      classList: []
    }
  },
  created() {
    if (!this.$tools.isHighSchool()) {
      const index = this.columns1.findIndex(list => {
        return list.dataIndex === 'subjectName'
      })
      this.columns.splice(index, 1)
    }
    this.bindObj.classList.forEach(item => {
      this.classChooseList.push(item.classCode)
      this.classTotalList.push({
        ...item,
        userId: item.id
      })
    })
    this.bindObj.teaList.forEach(item => {
      this.teaChooseList.push(item.userCode)
      this.teaTotalList.push({
        ...item,
        userId: item.id
      })
    })
    this.bindObj.deviceList.forEach(item => {
      this.deviceChooseList.push(item.deviceSn)
      this.deviceTotalList.push({
        ...item,
        userId: item.id
      })
    })
  },
  async mounted() {
    this.showList('class')
  },
  methods: {
    tabChange(val) {
      if (val === '1') {
        this.showList('class')
      } else if (val === '2') {
        this.showList('teachers')
      } else if (val === '3') {
        this.showList('device')
      }
    },
    async showList(type) {
      if (type === 'class') {
        let url
        const params = {
          schoolYearId: this.schoolYearId,
          gradeCode: this.gradeCode,
          schoolCode: this.userInfo.schoolCode,
          ...this.pageList
        }
        if (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') {
          params.gradeName = this.grade
          params.subjectCode = this.subjectCode
          url = hostEnv.protal_api_8092
        } else {
          url = hostEnv.protal_api_11002
        }
        const res = await $ajax.post({
          url: `${url}/class/manage/list`,
          params: params
        })
        this.classTableList = (res.data.list || res.data.records).map(item => {
          return {
            ...item,
            id: item.classCode,
            subjectName: this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? item.subjectName : undefined,
            subjectCode: this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? item.subjectCode : undefined
          }
        })
      } else if (type === 'teachers') {
        const res = await $ajax.post({
          url: `${hostEnv.protal_api_11002}/userinfo/teacher/user/queryTeacherInfo`,
          params: {
            orgCode: this.orgCode,
            keyword: this.keyword,
            schoolCode: this.userInfo.schoolCode,
            ...this.pageList
          }
        })
        this.teaTableList = res.data.list.map(item => {
          return {
            ...item,
            id: item.userCode
          }
        })
      } else if (type === 'device') {
        const res = await $ajax.post({
          url: `${hostEnv.protal_api_11009}/classcard/bind/list`,
          params: {
            ...this.pageList,
            schoolCode: this.userInfo.schoolCode,
            ...this.searchList,
            placeId: this.searchList.places ? this.searchList.places.join(',') : undefined,
            gradeCode: this.searchList.classes ? this.searchList.classes[0] : undefined,
            classCode: this.searchList.classes ? this.searchList.classes[1] : undefined,
            bindStatus: '1'
          }
        })
        if (!res.data) {
          return
        }
        this.deviceTableList = res.data.list.map(item => {
          return {
            ...item,
            id: item.deviceSn
          }
        })
      }
    },
    teaSearch(values) {
      this.keyword = values.userName
      this.showList('teachers')
    },
    deviceSearch(values) {
      this.searchList = values
      this.showList('device')
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    delClass(id, index) {
      this.classTotalList.splice(index, 1)
      this.classChooseList.splice(this.classChooseList.indexOf(id), 1)
    },
    delTea(id, index) {
      this.teaTotalList.splice(index, 1)
      this.teaChooseList.splice(this.teaChooseList.indexOf(id), 1)
    },
    delDevice(id, index) {
      this.deviceTotalList.splice(index, 1)
      this.deviceChooseList.splice(this.deviceChooseList.indexOf(id), 1)
    },
    selectAllDevice(item, type) {
      if (type) {
        this.deviceTotalList = this.deviceTotalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.deviceTotalList.findIndex(list => {
            return list.deviceSn === item.deviceSn
          })
          this.deviceTotalList.splice(index, 1)
        })
      }
    },
    selectAllClass(item, type) {
      if (type) {
        this.classTotalList = this.classTotalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.classTotalList.findIndex(list => {
            return list.classCode === item.classCode
          })
          this.classTotalList.splice(index, 1)
        })
      }
    },
    selectAllTea(item, type) {
      if (type) {
        this.teaTotalList = this.teaTotalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.teaTotalList.findIndex(list => {
            return list.userCode === item.userCode
          })
          this.teaTotalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    classClickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.classTotalList.push(item)
        } else {
          this.classTotalList = [item]
        }
      } else {
        const index = this.classTotalList.findIndex(list => list.classCode === item.classCode)
        this.classTotalList.splice(index, 1)
      }
    },
    teaClickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.teaTotalList.push(item)
        } else {
          this.teaTotalList = [item]
        }
      } else {
        const index = this.teaTotalList.findIndex(list => list.userCode === item.userCode)
        this.teaTotalList.splice(index, 1)
      }
    },
    deviceClickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.deviceTotalList.push(item)
        } else {
          this.deviceTotalList = [item]
        }
      } else {
        const index = this.deviceTotalList.findIndex(list => list.deviceSn === item.deviceSn)
        this.deviceTotalList.splice(index, 1)
      }
    },
    submitOk() {
      if (
        this.deviceTotalList.length === 0 &&
        this.teaTotalList.length === 0 &&
        this.classTotalList.length === 0
      ) {
        this.$message.warning('请选择发布对象')
        return
      }
      this.confirmLoading = true
      this.$emit('submit', {
        classList: this.classTotalList,
        teaList: this.teaTotalList,
        deviceList: this.deviceTotalList
      })
    },
    classSelect(item) {
      this.gradeCode = item.gradeCode
      this.grade = item.gradeName || ''
      this.subjectCode = item.subjectCode
      this.schoolYearId = item.schoolYearId
      this.showList('class')
    },
    teaSelect(item) {
      this.orgCode = item.code
      this.showList('teachers')
    },
    defaultCode(item) {
      this.orgCode = item.code[0]
    },
    async onFocus(value) {
      this.buildList = []
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_10050}/place/manage/getFirstStagePlaceList`,
        params: {
          schoolCode: this.userInfo.schoolCode
        }
      })
      this.buildList = res.data
      this.buildList.forEach(el => {
        el.label = el.name
        el.value = el.id
        el.isLeaf = false
      })
    },
    async loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_10050}/place/manage/getPlaceManageList`,
        params: {
          parentId: targetOption.id,
          schoolCode: this.userInfo.schoolCode
        }
      })
      targetOption.loading = false
      targetOption.children = res.data.list
      // 处理第三层没有子节点的情况
      targetOption.children.forEach(el => {
        el.label = el.name + (el.type === '2' ? '楼' : '')
        el.value = el.id
        el.isLeaf = el.type === '3'
      })
      targetOption.children.unshift({
        label: '全部',
        value: ''
      })
      this.buildList = [...this.buildList]
    },
    async classOnFocus(value) {
      this.classList = []
      const res = await $ajax.postForm({
        url: `${hostEnv.protal_api_11002}/grade/manage/list`,
        params: {
          schoolCode: this.userInfo.schoolCode
        }
      })
      this.classList = res.data.list
      this.classList.forEach(el => {
        el.label = el.name
        el.value = el.code
        el.isLeaf = false
      })
    },
    async classLoadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_11002}/classManage/list`,
        params: {
          gradeCode: targetOption.code,
          schoolCode: this.userInfo.schoolCode
        }
      })
      targetOption.loading = false
      targetOption.children = res.data.list
      targetOption.children.forEach(el => {
        el.label = el.className
        el.value = el.classCode
        el.isLeaf = true
      })
      targetOption.children.unshift({
        label: '全部',
        value: ''
      })
      this.classList = [...this.classList]
    }
  }
}
</script>

<style lang="less" scoped>
.choose-user {
  height: 600px;
  .org-box {
    width: 200px;
  }
  .user-box {
    border: 1px #f5f5f5 solid;
    margin-left: 15px;
    width: 280px;
    .title {
      padding: 0 10px;
      background-color: #f5f5f5;
      height: 41px;
      line-height: 41px;
      border-bottom: 1px #f5f5f5 solid;
    }
    .choose-list {
      height: 520px;
    }
    li {
      border-bottom: 1px #f5f5f5 solid;
      padding: 6px 0px 6px 8px;
    }
  }
}
/deep/ .ant-modal-body {
  padding: 14px;
}
/deep/ .ant-tabs-bar {
  margin-bottom: 0;
}
.search-form {
  padding-bottom: 5px;
}
</style>
