<template>
  <div class="page-layout qui-fx-ver">
    <div class="top-btn-group qui-fx padd-b10">
      <a-button @click="modifyApp(2)" type="primary">添加</a-button>
    </div>
    <div id="table" class="wrap-table qui-fx-f1">
      <a-table
        :loading="loadTable"
        :pagination="false"
        :rowKey="(record, index) => index"
        :columns="columns"
        :dataSource="teacherList"
        :scroll="{y: this.$tools.setScroll('table')}"
      >
        <template slot="number" slot-scope="text, record, index">
          <span>{{ (subjectSearch.page - 1) * (subjectSearch.size) + (index + 1) }}</span>
        </template>
        <template slot="other1" slot-scope="outUserInfoDtoList">
          <span v-for="(item, i) in outUserInfoDtoList" :key="i">{{ item.userName }}{{ i === outUserInfoDtoList.length-1 ? '' : '，' }}</span>
        </template>
        <template slot="createTime" slot-scope="createTime">
          {{ createTime | getDate(1) }}
        </template>
        <template slot="action" slot-scope="text, record">
          <a-tag color="#2db7f5" @click="modifyApp(1, record)">编辑</a-tag>
          <a-tag color="#f50" @click="modifyApp(0, record)">删除</a-tag>
        </template>
      </a-table>
    </div>
    <page-num v-model="subjectSearch" :total="total" @change-page="changePage"></page-num>
    <add-teacher ref="addTeacher" @updataTeacher="teacherGet"></add-teacher>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AddTeacher from '../../component/ScheduleComponents/AddTeacher'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
export default {
  name: 'TeacherManage',
  components: {
    PageNum,
    AddTeacher,
    SearchForm
  },
  data () {
    return {
      loading: false,
      isTag: true, // true为添加 false为编辑
      isLoad: false, // 新增或编辑时 确定按钮不可用
      form: this.$form.createForm(this),
      loadTable: false, // 表格是否显示加载提示
      columns: [ {
        title: '序号',
        scopedSlots: {
          customRender: 'number'
        },
        width: '10%'
      }, {
        title: '学科',
        dataIndex: 'subjectName',
        width: '20%'
      }, {
        title: '授课老师',
        dataIndex: 'outUserInfoDtoList',
        width: '55%',
        scopedSlots: { customRender: 'other1' }
      }, /* {
        title: '发布时间',
        dataIndex: 'createTime',
        width: '20%',
        scopedSlots: { customRender: 'createTime' }
      }, */ {
        title: '操作',
        key: 'action',
        width: '25%',
        scopedSlots: { customRender: 'action' }
      }],
      total: 0,
      examPlanId: '',
      paramsForm: {},
      subjectSearch: {
        page: 1,
        size: 20,
        schoolCode: ''
      },
      subjectList: [],
      teacherList: []
    }
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  methods: {
    ...mapActions('home', ['getTeacherCourse', 'delBindTeacher']),
    // 操作分页组件回调, 更新searchForm的值
    changePage () {
      this.subjectSearch.schoolCode = this.userInfo.schoolCode
      this.teacherGet()
    },
    filterSearch (data) {
      data.forEach(el => {
        this.$set(el, 'key', el.id)
        this.$set(el, 'val', el.name)
      })
      return data
    },
    modifyApp (type, record) {
      if (type) {
        this.$refs.addTeacher.addVisible = true
        this.$refs.addTeacher.subjectSelect()
        if (type === 1) {
          this.$refs.addTeacher.type = '1'
          this.$refs.addTeacher.teacherInfo = record
        } else {
          this.$refs.addTeacher.type = '0'
          this.$refs.addTeacher.teacherInfo = {}
        }
      } else {
        console.log(record)
        const _this = this
        _this.$tools.delTip('确定删除此内容吗?', () => {
          _this.delBindTeacher(record.subjectId).then(res => {
            _this.$message.success('删除成功')
            _this.$tools.goNext(() => {
              _this.teacherGet()
            })
          })
        })
      }
    },
    // 老师列表
    teacherGet (value) {
      if (value) {
        this.subjectSearch.teacherName = value.teacherName
        this.subjectSearch.courseId = value.courseId
      }
      this.getTeacherCourse(this.subjectSearch).then(res => {
        this.teacherList = res.data.list
        this.total = res.data.total
      })
    }
  },
  mounted () {
    this.subjectSearch.schoolCode = this.userInfo.schoolCode
    this.teacherGet()
  }
}
</script>
<style lang="less" scoped>
</style>
