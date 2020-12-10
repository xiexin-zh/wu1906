<template>
  <div class="class page-layout qui-fx">
    <choose-post
      is-radio
      ref="chooseForm"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseTeacher"
      title="添加班主任"
    ></choose-post>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="type === 2 ? highClass.formDatas : type === 3 ? highClass.roomData : highClass.formData"
      @classRoom="addClassRoom"
    ></submit-form>
    <div class="qui-fx qui-fx-jsb" style="width:100%">
      <div class="left">
        <major-tree ref="majorTree" @select="select"></major-tree>
      </div>
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form is-reset @search-form="searchForm" :search-label="highClass.searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="addClass(0)">添加</a-button>
            <a-button icon="export" class="export-all-btn" @click.stop="addClass(2)">批量添加</a-button>
            <a-button icon="delete" class="del-btn" @click.stop="deleteList(0)">批量删除</a-button>
            <a-button icon="delete" class="power-action-btn" @click.stop="deleteList(2)">批量解绑辅导员</a-button>
            <a-button icon="delete" class="del-action-btn" @click.stop="deleteList(3)">批量解绑教室</a-button>
          </div>
        </search-form>
        <class-table
          is-check
          :page-list="pageList"
          v-model="chooseList"
          :columns="highClass.columns"
          :table-list="classList"
        >
          <template v-slot:editClassRooms="editClassRoom">
            <div class="qui-fx">
              <span
                class="tab-add"
                v-if="editClassRoom.record.placeName === ''"
                @click.stop="addClass(3, editClassRoom.record)"
              >
                <a-tag color="green">添加</a-tag>
              </span>
              <span v-else>
                {{ editClassRoom.record.placeName }}
                <a-popconfirm
                  placement="left"
                  okText="确定"
                  cancelText="取消"
                  @confirm.stop="del('unbindHighClass', {ids: editClassRoom.record.id})"
                >
                  <template slot="title">您确定解绑吗?</template>
                  <a-tooltip placement="topLeft" title="解绑">
                    <a-icon class="mouse mar-l10" type="unlock" />
                  </a-tooltip>
                </a-popconfirm>
              </span>
            </div>
          </template>
          <template v-slot:editClassTeachers="editClassTeacher">
            <div class="qui-fx">
              <span
                class="tab-add"
                v-if="editClassTeacher.record.teacherName === ''"
                @click.stop="addClass(4, editClassTeacher.record)"
              >
                <a-tag color="green">添加</a-tag>
              </span>
              <span v-else>
                {{ editClassTeacher.record.teacherName }}
                <a-popconfirm
                  placement="left"
                  okText="确定"
                  cancelText="取消"
                  @confirm.stop="del('unbindHighTea', {ids: editClassTeacher.record.id})"
                >
                  <template slot="title">您确定解绑吗?</template>
                  <a-tooltip placement="topLeft" title="解绑">
                    <a-icon class="mouse mar-l10" type="unlock" />
                  </a-tooltip>
                </a-popconfirm>
              </span>
            </div>
          </template>
          <template v-slot:totalNum1s="totalNum1">
            <div
              class="table-total-num"
              @click.stop="goDetail('/basedata/highDetail', totalNum1.record, '1')"
            >{{ totalNum1.record.count }}</div>
          </template>
          <template v-slot:totalNum2s="totalNum2">
            <div
              class="table-total-num"
              @click.stop="goDetail('/basedata/highDetail', totalNum2.record, '2')"
            >{{ totalNum2.record.teacherTotal ? totalNum2.record.teacherTotal : 0 }}</div>
          </template>
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="详情">
              <a-button
                size="small"
                class="detail-action-btn"
                icon="ellipsis"
                @click.stop="goDetail('/basedata/highDetail', action.record)"
              ></a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addClass(1, action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm.stop="deleteList(1, action.record)"
            >
              <template slot="title">您确定删除吗?</template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </class-table>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import highClass from '../../assets/js/table/highClass.js'
import { mapState, mapActions } from 'vuex'
import ClassTable from '../components/ClassTable'
import MajorTree from '@c/MajorTree'
import GradeTree from '@c/GradeTree'
import PageNum from '@c/PageNum'
import SubmitForm from '../components/SubForm'
import SearchForm from '@c/SearchForm'
import ChoosePost from '@c/choose/ChoosePost'

export default {
  name: 'HighClass',
  components: {
    ClassTable,
    GradeTree,
    PageNum,
    SubmitForm,
    SearchForm,
    ChoosePost,
    MajorTree
  },
  data() {
    return {
      highClass,
      title: '添加班级',
      formStatus: false,
      chooseList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      classList: [],
      type: 0,
      placeName: '',
      record: null,
      userTag: false,
      highSubList: [],
      highSubTerm: [],
      searchList: {},
      bindList: {},
      isShow: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.getGrade()
    this._getSubjectList()
  },
  methods: {
    ...mapActions('home', [
      'getHighClass', 'addHighClass', 'addClassList', 'addHighClasses',
      'delHighClass', 'getHighTerm', 'getHighSub', 'highClassBind',
      'delHighClasses', 'unbindHighClass', 'unbindHighTea', 'getHighGrade'
    ]),
    // 获取学年
    async getGrade() {
      this.highClass.formData[0].list = []
      this.highClass.formDatas[0].list = []
      const res = await this.getHighGrade({ schoolCode: this.userInfo.schoolCode })
      if (res.data.length === 0) {
        return
      }
      this.highSubTerm = res.data
      res.data.forEach(ele => {
        this.highClass.formData[0].list.push({ key: ele.gradeCode, val: `${ele.gradeName}级` })
        this.highClass.formDatas[0].list.push({ key: ele.gradeCode, val: `${ele.gradeName}级` })
      })
    },
    // 获取专业
    async _getSubjectList() {
      this.highClass.formData[1].list = []
      this.highClass.formDatas[1].list = []
      const req = {
        page: 1,
        size: 99999,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getHighSub(req)
      if (res.data.records.length === 0) {
        return
      }
      this.highSubList = res.data.records
      res.data.records.forEach(ele => {
        this.highClass.formData[1].list.push({ key: ele.subjectCode, val: ele.subjectName })
        this.highClass.formDatas[1].list.push({ key: ele.subjectCode, val: ele.subjectName })
      })
    },
    // 查询班级列表
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getHighClass(this.searchList)
      if (!res.data.records) {
        this.classList = []
        return
      }
      this.classList = res.data.records
      this.total = res.data.total
      this.isShow = false
    },
    // 选中年级
    select(item) {
      if (this.isShow) {
        this.showList()
      } else {
        this.searchList.gradeCode = item.gradeCode
        this.searchList.gradeName = item.gradeName
        this.searchList.grade = item.gradeName
        this.searchList.subjectCode = item.subjectCode || ''
        this.searchList.classCode = item.classCode || ''
        this.showList()
      }
    },
    // 模糊查询
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    },
    // 编辑添加
    addClass(type, record) {
      this.formStatus = true
      this.type = type
      if (type === 1) {
        this.title = '编辑班级'
        this.highClass.formData = this.$tools.fillForm(highClass.formData, record)
        this.record = record
        this.highClass.formData[0].disabled = true
        this.highClass.formData[1].disabled = true
        this.highClass.formData[1].initValue = record.subjectName
      } else if (type === 2) {
        this.title = '批量添加班级'
        this.highClass.formDatas[0].disabled = false
        this.highClass.formDatas[0].initValue = this.searchList.gradeCode
        if (this.searchList.subjectCode) {
          this.highClass.formDatas[1].initValue = this.searchList.subjectCode
          // this.highClass.formDatas[1].initValue = this.highSubList.filter(el => el.subjectCode === this.searchList.subjectCode)[0].subjectName
        } else {
          this.highClass.formDatas[1].initValue = []
        }
      } else if (type === 0) {
        this.title = '添加班级'
        this.highClass.formData[0].disabled = false
        this.highClass.formData[1].disabled = false
        this.highClass.formData[0].initValue = this.searchList.gradeCode
        if (this.searchList.subjectCode) {
          this.highClass.formData[1].initValue = this.searchList.subjectCode
          // this.highClass.formData[1].initValue = this.highSubList.filter(el => el.subjectCode === this.searchList.subjectCode)[0].subjectName
        } else {
          this.highClass.formData[1].initValue = []
        }
        this.highClass.formData[2].initValue = ''
        this.highClass.formData[3].initValue = ''
      } else if (type === 3) {
        this.title = '添加教室'
        this.record = record
      } else if (type === 4) {
        this.formStatus = false
        this.title = '添加班主任'
        this.userTag = true
        this.record = record
      }
    },
    async deleteList(type, record) {
      // 单个删除
      if (type === 1) {
        await this.delHighClass({ id: record.id })
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.isShow = true
          this.$refs.majorTree.initMenu()
        })
        // 批量解绑
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择班级')
          return
        }
        const string = type === 2 ? '解绑辅导员' : type === 3 ? '解绑教室' : '删除'
        this.$tools.delTip(`您确定${string}吗?`, () => {
          const method = type === 2 ? 'unbindHighTea' : type === 3 ? 'unbindHighClass' : 'delHighClasses'
          const req = { ids: this.chooseList }
          this.del(method, req)
        })
      }
    },
    // 解绑公共方法
    del(method, req) {
      this[method](req).then(res => {
        this.$message.success('操作成功')
        this.chooseList = []
        this.$tools.goNext(() => {
          this.isShow = true
          this.$refs.majorTree.initMenu()
        })
      })
    },
    // 选择班主任
    chooseTeacher(value) {
      this.bindList.teacherCode = value[0].userCode
      this.bindList.teacherName = value[0].userName
      this.bindList.placeCode = ''
      this.bindList.placeName = ''
      this._highClassBind('chooseForm')
    },
    // 选择场地
    addClassRoom(val) {
      this.placeName = val
    },
    // 教室和辅导员绑定
    _highClassBind(form) {
      this.bindList.id = this.record.id
      this.bindList.className = this.record.className
      this.highClassBind(this.bindList).then(res => {
        this.$message.success('绑定成功')
        this.$tools.goNext(() => {
          this.showList()
          this.$refs[form].reset()
        })
      })
        .catch(() => {
          this.$refs[form].error()
        })
    },
    // 提交
    submitForm(values) {
      // 绑定教室
      if (this.type === 3) {
        this.bindList.placeCode = values.placeName.join(',')
        this.bindList.placeName = this.placeName.split('-').join(',')
        this.bindList.teacherCode = ''
        this.bindList.teacherName = ''
        this._highClassBind('form')
      } else {
        values.schoolCode = this.userInfo.schoolCode
        values.gradeName = this.highSubTerm.filter(el => el.gradeCode === values.gradeCode)[0].gradeName
        if (this.type === 0) {
          console.log('values', values)
          // return
          values.subjectName = this.highSubList.filter(el => el.subjectCode === values.subjectCode)[0].subjectName
          this.addHighClass(values)
            .then(res => {
              this.$message.success('添加成功')
              this.$tools.goNext(() => {
                this.isShow = true
                this.$refs.majorTree.initMenu()
                this.$refs.form.reset()
              })
            })
            .catch(() => {
              this.$refs.form.error()
            })
        } else if (this.type === 1) {
          values.id = this.record.id
          this.highClassBind(values).then(res => {
            this.$message.success('编辑成功')
            this.$tools.goNext(() => {
              this.isShow = true
              this.$refs.majorTree.initMenu()
              this.$refs.form.reset()
            })
          })
            .catch(() => {
              this.$refs.form.error()
            })
        } else if (this.type === 2) {
          values.subjectName = this.highSubList.filter(el => el.subjectCode === values.subjectCode)[0].subjectName
          this.addHighClasses(values)
            .then(res => {
              this.$message.success('添加成功')
              this.$tools.goNext(() => {
                this.isShow = true
                this.$refs.majorTree.initMenu()
                this.$refs.form.reset()
              })
            })
            .catch(() => {
              this.$refs.form.error()
            })
        }
      }
    },
    // 详情
    goDetail(path, record, type = '1') {
      this.$router.push({
        path,
        query: {
          id: record.id,
          subjectCode: record.subjectCode,
          classCode: record.classCode,
          gradeCode: record.gradeCode
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.class {
  height: 100%;
  background: #fff;
  .left {
    padding: 10px;
  }
  .table-total-num {
    cursor: pointer;
  }
  .right {
    border-left: 1px solid @bor-color;
    padding: 0 0 0 10px;
  }
}
.tab-add {
  cursor: pointer;
  color: #6882da;
}
</style>
