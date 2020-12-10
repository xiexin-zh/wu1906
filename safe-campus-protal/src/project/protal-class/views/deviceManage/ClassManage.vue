<template>
  <div class="page-layout qui-fx-ver">
    <search-form isReset @search-form="searchForm" :search-label="searchLabel">
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
            v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
            :options="highOptions"
            placeholder="请选择班级"
            v-decorator="['classes']"
          />
          <a-cascader
            v-else
            :options="classList"
            @click.stop="classOnFocus"
            :loadData="classLoadData"
            placeholder="请选择关联数据"
            v-decorator="['classes']"
          />
        </a-form-item>
      </template>
    </search-form>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      title="绑定场地"
      v-model="formStatus"
      :form-data="formData"
      @classRoom="addClassRoom">
    </submit-form>
    <table-list
      :page-list="pageList"
      :columns="columns"
      :table-list="dataList">
      <template v-slot:other1="record">
        <a-tag :color="record.record.bindStatus === '1' ? '#71d5a1' : '#ddd'">{{ record.record.bindStatus === '1' ? '绑定中' : '已解除' }}</a-tag>
      </template>
      <template v-slot:other2="record">
        {{ record.record.gradeName }}{{ userInfo.schoolType === '8' || userInfo.schoolType === '9' ? record.record.professionName : '' }}{{ record.record.className }}
      </template>
      <template v-slot:actions="action">
        <span v-if="action.record.bindStatus === '1'">
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="untie(action.record)">
            <template slot="title">
              您确定解绑吗?
            </template>
            <a-tag color="#f50">解绑</a-tag>
          </a-popconfirm>
        </span>
        <span v-else>
          <a-tag color="cyan" @click="bind(action.record)">绑定</a-tag>
        </span>
        <span>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="resetPwd(action.record)">
            <template slot="title">
              您确定重置密码吗?
            </template>
            <a-tag color="orange">重置密码</a-tag>
          </a-popconfirm>
        </span>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import SubmitForm from '../../component/SubForm'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '10%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : parseInt(text) === 2 ? '面板机' : '未知'
    }
  },
  {
    title: 'SN码',
    dataIndex: 'deviceSn',
    width: '10%'
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '在线' : '离线'
    }
  },
  {
    title: '绑定场地',
    dataIndex: 'placeName',
    width: '10%'
  },
  {
    title: '安装位置',
    dataIndex: 'site',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '室内' : '室外'
    }
  },
  {
    title: '关联数据',
    dataIndex: 'className',
    width: '10%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '绑定状态',
    dataIndex: 'bindStatus',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'deviceName',
    initValue: '',
    type: 'input',
    label: '设备名称',
    placeholder: '请输入设备名称'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '2',
        val: '面板机'
      },
      {
        key: '1',
        val: '网络相机'
      }
    ],
    value: 'deviceType',
    type: 'select',
    label: '设备类型'
  }
]
const formData = [
  {
    value: 'placeName',
    initValue: [],
    type: 'siteChoose',
    label: '班牌场地',
    placeholder: '请选择'
  }
]
export default {
  name: 'ClassManage',
  components: {
    TableList,
    PageNum,
    SearchForm,
    SubmitForm
  },
  computed: {
    ...mapState('home', ['userInfo', 'schoolYear'])
  },
  data() {
    return {
      columns,
      formData,
      searchLabel,
      formStatus: false,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      dataList: [],
      searchList: {},
      record: {},
      placeName: '',
      buildList: [],
      classList: [],
      schoolYearId: '',
      highOptions: []
    }
  },
  mounted() {
    if (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') {
      this.schoolYearId = JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearId
      this._getHighSchoolClass()
    } else {
      this.getSchoolYearId()
    }
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getSiteList', 'getSiteById', 'getChildSite', 'resetPassWord',
      'getHighSchoolClass', 'getClassCardList', 'bindClassCard', 'unitClassCard', 'addPlace', 'getGradeData', 'getClassData', 'getSchoolYear'
    ]),
    async getSchoolYearId () {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (!res.data.list) {
        return
      }
      this.schoolYearId = res.data.list[0].id
    },
    async showList () {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        ...this.searchList,
        placeId: this.searchList.places ? this.searchList.places.join(',') : undefined,
        gradeCode: this.searchList.classes ? this.searchList.classes[0] : undefined,
        classCode: this.searchList.classes ? (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') ? (this.searchList.classes[2] || undefined) : (this.searchList.classes[1] || undefined) : undefined
      }
      const res = await this.getClassCardList(req)
      if (!res.data) {
        return
      }
      this.dataList = res.data.list
      this.total = res.data.total
    },
    async untie (record) {
      console.log(record.id)
      await this.unitClassCard({ query: record.id })
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    async resetPwd (record) {
      console.log(record.id)
      await this.resetPassWord({ query: record.id })
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    async _getHighSchoolClass() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getHighSchoolClass(req)
      this.highOptions = this.newTreeData(res.data)
    },
    // 深层递归
    newTreeData(data) {
      data.forEach((item) => {
        if (item.gradeName) {
          item.gradeName = item.gradeName + '级'
        }
        item.children = item.subjectNodeDtos || item.classNodeDtos || []
        item.isLeaf = !item.subjectNodeDtos && !item.classNodeDtos
        item.label = item.classCode
          ? item.className
          : item.subjectCode
            ? item.subjectName
            : item.gradeName
        item.value = item.classCode
          ? item.classCode
          : item.subjectCode
            ? item.subjectCode
            : item.gradeCode
        if (item.subjectNodeDtos && item.subjectNodeDtos.length > 0) {
          this.newTreeData(item.subjectNodeDtos)
        }
        if (item.classNodeDtos && item.classNodeDtos.length > 0) {
          this.newTreeData(item.classNodeDtos)
        }
      })
      return data
    },
    async onFocus(value) {
      this.buildList = []
      const req = {
        name: '',
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSiteList(req)
      this.buildList = res.data
      this.buildList.forEach(el => {
        el.label = el.name
        el.value = el.id
        el.isLeaf = false
      })
    },
    loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const req = {
        parentId: targetOption.id,
        schoolCode: this.userInfo.schoolCode
      }
      this.getChildSite(req).then(res => {
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
      })
    },
    async classOnFocus(value) {
      this.classList = []
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeData(req)
      this.classList = res.data.list
      this.classList.forEach(el => {
        el.label = el.name
        el.value = el.code
        el.isLeaf = false
      })
    },
    classLoadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const req = {
        gradeCode: targetOption.code,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId
      }
      this.getClassData(req).then(res => {
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
      })
    },
    searchForm (values) {
      this.searchList = values
      this.showList()
    },
    bind (record) {
      this.formStatus = true
      this.record = record
    },
    // 添加场地
    addClassRoom (val) {
      this.placeName = val
      console.log(this.placeName)
    },
    // 提交
    submitForm (values) {
      console.log(values)
      const req = {
        id: this.record.id,
        placeId: values.placeName.join(','),
        placeName: this.placeName,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId
      }
      console.log(req)
      this.addPlace(req).then(res => {
        this.$message.success('绑定成功')
        this.$tools.goNext(() => {
          const data = {
            ...this.pageList,
            ...this.userInfo,
            schoolYearId: this.schoolYearId,
            gradeCode: this.gradeCode,
            classCode: this.classCode
          }
          this.showList(data)
          this.$refs.form.reset()
        })
      }).catch(() => {
        this.$refs.form.error()
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
