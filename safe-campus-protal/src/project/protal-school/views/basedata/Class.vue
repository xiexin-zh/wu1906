<template>
  <div class="class page-layout qui-fx">
    <choose-user
      is-radio
      ref="chooseForm"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseTeacher"
      title="添加班主任"
    ></choose-user>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
      @classRoom="addClassRoom"
    ></submit-form>
    <no-data msg="暂无班级" v-if="false">
      <div slot="btn">
        <a-button type="primary" @click="addClass(0)">
          <a-icon type="plus"/>添加班级
        </a-button>
      </div>
    </no-data>
    <div class="qui-fx qui-fx-jsb" style="width:100%" v-else>
      <div class="left">
        <grade-tree @select="select" :key="index"></grade-tree>
      </div>
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left" v-if="isNewYear">
            <a-button icon="plus" class="add-btn" @click="addClass(0)">添加</a-button>
            <a-button icon="export" class="export-all-btn" @click.stop="addClass(2)">批量添加</a-button>
            <a-button icon="delete" class="del-btn" @click.stop="deleteList(0)">批量删除</a-button>
          </div>
        </search-form>
        <class-table
          is-check
          is-zoom
          @clickRow="clickRow"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="classList"
        >
          <template v-slot:editClassRooms="editClassRoom" v-if="isNewYear">
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
                  @confirm.stop="untie(0, editClassRoom.record)"
                >
                  <template slot="title">您确定解绑吗?</template>
                  <a-tooltip placement="topLeft" title="解绑">
                    <a-icon class="mouse mar-l10" type="unlock" />
                  </a-tooltip>
                </a-popconfirm>
              </span>
            </div>
          </template>
          <template
            v-slot:editClassRooms="editClassRoom"
            v-else
          >{{ editClassRoom.record.placeName }}</template>
          <template v-slot:editClassTeachers="editClassTeacher" v-if="isNewYear">
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
                  @confirm.stop="untie(1, editClassTeacher.record)"
                >
                  <template slot="title">您确定解绑吗?</template>
                  <a-tooltip placement="topLeft" title="解绑">
                    <a-icon class="mouse mar-l10" type="unlock" />
                  </a-tooltip>
                </a-popconfirm>
              </span>
            </div>
          </template>
          <template
            v-slot:editClassTeachers="editClassTeacher"
            v-else
          >{{ editClassTeacher.record.teacherName }}</template>
          <template v-slot:totalNum1s="totalNum1">
            <div
              class="table-total-num"
              @click.stop="goDetail('/basedata/classDetail', totalNum1.record, '1')"
            >{{ totalNum1.record.count }}</div>
          </template>
          <template v-slot:totalNum2s="totalNum2">
            <div
              class="table-total-num"
              @click.stop="goDetail('/basedata/classDetail', totalNum2.record, '2')"
            >{{ totalNum2.record.teacherTotal ? totalNum2.record.teacherTotal : 0 }}</div>
          </template>
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="详情">
              <a-button
                size="small"
                class="detail-action-btn"
                icon="ellipsis"
                @click.stop="goDetail('/basedata/classDetail', action.record)"
              ></a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft" title="编辑" v-if="isNewYear">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addClass(1, action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              v-if="isNewYear"
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
        <page-num v-model="pageList" :total="total" @change-page="showMore"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import detailImg from '../../assets/img/database/role/detail.png'
import editImg from '../../assets/img/database/role/edit.png'
import deleteImg from '../../assets/img/database/role/delete.png'
import { mapState, mapActions } from 'vuex'
import ClassTable from '../components/ClassTable'
import GradeTree from '@c/GradeTree'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import SubmitForm from '../components/SubForm'
import SearchForm from '@c/SearchForm'
import ChooseUser from '@c/ChooseUser'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '10%'
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '班级教室',
    dataIndex: 'placeName',
    width: '20%',
    scopedSlots: { customRender: 'editClassRoom' }
  },
  {
    title: '班主任',
    dataIndex: 'teacherName',
    width: '10%',
    scopedSlots: { customRender: 'editClassTeacher' }
  },
  {
    title: '班级学生人数',
    width: '10%',
    scopedSlots: {
      customRender: 'totalNum1'
    }
  },
  {
    title: '任课教师人数',
    width: '10%',
    scopedSlots: {
      customRender: 'totalNum2'
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'teacherName',
    type: 'input',
    label: '班主任',
    placeholder: '请输入班主任姓名'
  }
]
const formData = [
  {
    value: 'gradeName',
    initValue: [],
    list: [],
    type: 'select',
    label: '年级',
    placeholder: '请选择年级'
  },
  {
    value: 'className',
    initValue: '',
    type: 'input',
    label: '班级名称',
    placeholder: '请输入班级'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    required: false,
    placeholder: '请输入备注'
  }
]
const formDatas = [
  {
    value: 'gradeName',
    initValue: [],
    list: [],
    type: 'select',
    label: '年级',
    placeholder: '请选择年级'
  },
  {
    value: 'num',
    initValue: '',
    type: 'input',
    label: '班级数量',
    placeholder: '请输入数字'
  }
]
const roomData = [
  {
    value: 'placeName',
    initValue: [],
    type: 'siteChoose',
    label: '教室班级',
    placeholder: '请选择'
  }
]
export default {
  name: 'Class',
  components: {
    ClassTable,
    GradeTree,
    PageNum,
    SubmitForm,
    SearchForm,
    NoData,
    ChooseUser
  },
  data() {
    return {
      detailImg,
      editImg,
      deleteImg,
      columns,
      searchLabel,
      title: '添加班级',
      formStatus: false,
      formData,
      formDatas,
      roomData,
      schoolYearId: '',
      gradeCode: '',
      classCode: '',
      gradeId: '',
      gradeName: '',
      chooseList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      classList: [],
      gradeList: [],
      type: 0,
      yearList: [],
      isNewYear: true,
      teacherName: '',
      placeName: '',
      record: null,
      userTag: false,
      schoolYear: '',
      index: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.getGrade()
  },
  methods: {
    ...mapActions('home', [
      'getClassList',
      'getGradeList',
      'addNewClass',
      'addClassList',
      'deleteTheClass',
      'editTheClass',
      'addPlace'
    ]),
    // 获取学年年级
    async getGrade() {
      this.formData[0].list = []
      this.formDatas[0].list = []
      this.gradeList = []
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeList(req)
      if (res.data.list.length === 0) {
        return
      }
      res.data.list.forEach(ele => {
        this.formData[0].list.push({ key: ele.code, val: ele.name })
        this.formDatas[0].list.push({ key: ele.code, val: ele.name })
        this.gradeList.push({ key: ele.code, val: ele.name })
      })
    },
    // 添加场地
    addClassRoom(val) {
      this.placeName = val
    },
    // 选中年级
    select(item) {
      console.log(item)
      this.schoolYear = item.title
      this.schoolYearId = item.schoolYearId
      this.gradeCode = item.gradeCode
      this.classCode = item.classCode
      this.isNewYear = item.isNewYear
      if (item.gradeCode) {
        this.formData[0].initValue = item.gradeCode
      } else {
        this.formData[0].initValue = []
      }
      const req = {
        ...this.pageList,
        ...this.userInfo,
        schoolYearId: item.schoolYearId,
        gradeCode: item.gradeCode || '',
        classCode: item.classCode || ''
      }
      this.showList(req)
    },
    // 模糊查询
    searchForm(values) {
      this.teacherName = values.teacherName
      const req = {
        ...this.pageList,
        ...this.userInfo,
        schoolYearId: this.schoolYearId,
        gradeCode: this.gradeCode,
        classCode: this.classCode,
        teacherName: values.teacherName
      }
      this.showList(req)
    },
    // 翻页
    showMore() {
      const req = {
        ...this.pageList,
        ...this.userInfo,
        schoolYearId: this.schoolYearId,
        gradeCode: this.gradeCode,
        classCode: this.classCode,
        teacherName: this.teacherName
      }
      this.showList(req)
    },
    // 提交
    submitForm(values) {
      console.log(values)
      if (this.type === 0) {
        this.gradeName = this.gradeList.filter(ele => ele.key === values.gradeName)[0].val
        const req = {
          ...this.userInfo,
          schoolYearId: this.schoolYearId,
          gradeCode: values.gradeName,
          className: values.className,
          gradeName: this.gradeName
        }
        console.log(req)
        console.log(123455)
        this.addNewClass(req)
          .then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this.index++
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
          })
          .catch(() => {
            this.$refs.form.error()
          })
      } else if (this.type === 1) {
        const req = {
          ...this.userInfo,
          schoolYearId: this.schoolYearId,
          gradeCode: this.record.gradeCode,
          className: values.className,
          id: this.record.id,
          remark: values.remark,
          placeName: this.record.placeName,
          placeId: this.record.placeId
        }
        console.log(req)
        this.editTheClass(req)
          .then(res => {
            this.$message.success('编辑成功')
            this.$tools.goNext(() => {
              this.index++
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
          })
          .catch(() => {
            this.$refs.form.error()
          })
      } else if (this.type === 2) {
        this.gradeName = this.gradeList.filter(ele => ele.key === values.gradeName)[0].val
        const req = {
          ...this.userInfo,
          schoolYearId: this.schoolYearId,
          gradeCode: values.gradeName,
          num: values.num,
          gradeName: this.gradeName
        }
        console.log(req)
        this.addClassList(req)
          .then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this.index++
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
          })
          .catch(() => {
            this.$refs.form.error()
          })
      } else if (this.type === 3) {
        const req = {
          id: this.record.id,
          placeId: values.placeName.join(','),
          teacherId: this.record.teacherId,
          schoolYearId: this.schoolYearId
        }
        console.log(req)
        this.addPlace(req)
          .then(res => {
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
          })
          .catch(() => {
            this.$refs.form.error()
          })
      }
    },
    // 编辑添加
    addClass(type, record) {
      this.formStatus = true
      if (type === 1) {
        this.title = '编辑班级'
        this.formData = this.$tools.fillForm(formData, record)
        this.type = 1
        this.record = record
        this.formData[0].disabled = true
      } else if (type === 2) {
        this.title = '批量添加班级'
        this.formData = this.formDatas
        this.type = 2
        this.formData[0].disabled = false
      } else if (type === 0) {
        this.title = '添加班级'
        this.formData = formData
        this.type = 0
        this.formData[0].disabled = false
      } else if (type === 3) {
        this.title = '添加教室'
        this.formData = roomData
        this.type = 3
        this.record = record
      } else if (type === 4) {
        this.formStatus = false
        this.title = '添加班主任'
        this.type = 4
        this.userTag = true
        this.record = record
      }
    },
    // 解绑
    untie(type, record) {
      console.log(type, record)
      const req = {
        ...this.userInfo,
        id: record.id,
        placeName: type === 0 ? '' : record.placeName,
        placeId: type === 0 ? '' : record.placeId,
        teacherName: type === 1 ? '' : record.teacherName,
        teacherId: type === 1 ? '' : record.teacherId,
        schoolYearId: this.schoolYearId
      }
      console.log(req)
      this.addPlace(req)
        .then(res => {
          this.$message.success('解绑成功')
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
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    // 绑定班主任
    chooseTeacher(value) {
      console.log(value)
      const req = {
        schoolCode: this.userInfo.schoolCode,
        schoolId: this.userInfo.schoolId,
        id: this.record.id,
        teacherName: value[0].userName,
        teacherId: value[0].id,
        placeId: this.record.placeId,
        schoolYearId: this.schoolYearId
      }
      console.log(req)
      this.addPlace(req)
        .then(res => {
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
            this.$refs.chooseForm.reset()
          })
        })
        .catch(() => {
          this.$refs.chooseForm.error()
        })
    },
    // 查询班级列表
    async showList(req) {
      const res = await this.getClassList(req)
      if (!res.data.list) {
        this.classList = []
        return
      }
      this.classList = res.data.list
      this.total = res.data.total
    },
    // 删除班级
    async deleteList(type, record) {
      let ids = []
      if (type) {
        ids = [record.id]
        console.log(ids)
        await this.deleteTheClass(ids)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.index++
          const data = {
            ...this.pageList,
            ...this.userInfo,
            schoolYearId: this.schoolYearId,
            gradeCode: this.gradeCode,
            classCode: this.classCode
          }
          this.showList(data)
        })
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择删除项')
          return
        }
        ids = this.chooseList
        this.$tools.delTip('您确定删除吗?', () => {
          this.deleteTheClass(ids).then(res => {
            this.$message.success('删除成功')
            this.$tools.goNext(() => {
              this.index++
              const data = {
                ...this.pageList,
                ...this.userInfo,
                schoolYearId: this.schoolYearId,
                gradeCode: this.gradeCode,
                classCode: this.classCode
              }
              this.showList(data)
            })
          })
        })
      }
    },
    // 选中列表项
    clickRow(id) {
      console.log(id)
    },
    // 详情
    goDetail(path, record, type = '1') {
      this.$router.push({
        path,
        query: {
          id: record.id,
          schoolYear: this.schoolYear,
          schoolYearId: record.schoolYearId,
          classCode: record.classCode,
          gradeCode: record.gradeCode,
          isNewYear: this.isNewYear ? '1' : '0',
          type
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
    .action {
      div {
        cursor: pointer;
        margin: 4px 30px 0 0;
        img {
          width: 20px;
          height: 20px;
        }
        span {
          font-size: 12px;
        }
      }
    }
  }
}
.modal {
  padding: 0 40px;
  .line {
    margin-bottom: 20px;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
    min-width: 70px;
  }
  .download {
    color: #6882da;
    cursor: pointer;
  }
  /deep/ .ant-upload-list-item-info {
    padding: 0 22px 0 4px;
  }
}
.tab-add {
  cursor: pointer;
  color: #6882da;
}
</style>
