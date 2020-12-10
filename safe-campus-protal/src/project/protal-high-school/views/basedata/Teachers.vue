<template>
  <div class="teachers page-layout qui-fx">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      @org="addOrg"
      v-model="formStatus"
      :form-data="formData"
    >
      <div slot="upload" class="qui-fx qui-fx-ac">
        <upload-multi is-check :length="1" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
        <span style="font-size: 12px; margin-left: 10px"
          >大小20到100kB，像素400x400到800x800，格式仅jpg</span
        >
      </div>
    </submit-form>
    <no-data msg="暂无教职工" v-if="false">
      <div slot="btn">
        <a-button type="primary" @click="actionTeacher(0)">
          <a-icon type="plus" />添加教职工
        </a-button>
      </div>
    </no-data>
    <div class="qui-fx qui-fx-jsb" style="width: 100%" v-else>
      <div class="left u-fx">
        <org-tree @select="select" @defaultCode="defaultCode"></org-tree>
      </div>
      <div class="right qui-fx-ver qui-fx-f1">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="actionTeacher(0)">添加</a-button>
            <a-button icon="export" class="export-all-btn" @click.stop="goLead()"
              >批量导入</a-button
            >
            <a-button icon="delete" class="del-btn" @click.stop="deleteList(0)">批量删除</a-button>
          </div>
        </search-form>
        <table-list
          is-check
          is-zoom
          @clickRow="clickRow"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="teacherList"
        >
          <template v-slot:other1="other1">
            <a-tag :color="parseInt(other1.record.onJob) === 1 ? '#87d068' : '#f50'">{{
              other1.record.onJob === '1' ? '在职' : '离职'
            }}</a-tag>
          </template>
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="详情">
              <a-button
                size="small"
                class="detail-action-btn"
                icon="ellipsis"
                @click.stop="goDetail('/basedata/teacherDetail', action.record)"
              ></a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="actionTeacher(1, action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteList(1, action.record)"
            >
              <template slot="title">您确定删除吗?</template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList(searchObj)"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import OrgTree from '@c/OrgTree'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import SubmitForm from '../components/SubForm'
import SearchForm from '@c/SearchForm'
import UploadMulti from '@c/UploadFace'
import ShowDialog from '@c/ShowDialog'
import Tools from '@u/tools'
import stuSelect from '../../assets/js/table/stuSelect.js'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '10%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10',
    customRender: (text) => {
      return Tools.getSex(text)
    }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: '10%'
  },
  /*   {
    title: '组织机构',
    dataIndex: 'orgId',
    width: '10%'
  }, */
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'onJob',
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
    value: 'keyword',
    initValue: '',
    type: 'selectInput',
    selectType: [
      {
        key: 'userName',
        val: '姓名'
      },
      {
        key: 'mobile',
        val: '手机号'
      },
      {
        key: 'workNo',
        val: '工号'
      }
    ],
    placeholder: '请输入'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '有照片'
      },
      {
        key: 0,
        val: '无照片'
      }
    ],
    value: 'hasPhoto',
    type: 'select',
    label: '有无照片'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '在职'
      },
      {
        key: 0,
        val: '离职'
      }
    ],
    value: 'onJob',
    type: 'select',
    label: '状态'
  }
]
const formData = [
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    value: 'sex',
    initValue: [],
    list: [
      {
        key: 1,
        val: '男'
      },
      {
        key: 2,
        val: '女'
      },
      {
        key: 3,
        val: '未知'
      }
    ],
    type: 'select',
    label: '性别',
    placeholder: '请选择性别'
  },
  {
    value: 'mobile',
    initValue: '',
    type: 'input',
    label: '手机号码',
    regular: 'phone',
    placeholder: '请输入教职工手机号码'
  },
  {
    value: 'orgCode',
    initValue: [],
    type: 'orgChoose',
    label: '组织机构',
    placeholder: '请选择'
  },
  {
    value: 'onJob',
    initValue: '1',
    list: [
      {
        key: '1',
        val: '在职'
      },
      {
        key: '0',
        val: '离职'
      }
    ],
    type: 'radio',
    label: '状态'
  },
  {
    type: 'upload',
    label: '人脸照片',
    required: false,
    placeholder: '请上传人脸照片'
  },
  {
    value: 'workNo',
    initValue: '',
    type: 'input',
    label: '工号',
    required: false,
    placeholder: '请输入教职工工号'
  },
  {
    value: 'email',
    initValue: '',
    type: 'input',
    label: '邮箱',
    required: false,
    regular: 'email',
    placeholder: '请输入教职工邮箱'
  },
  {
    value: 'birthday',
    initValue: '',
    type: 'singleTime',
    label: '出生日期',
    required: false,
    placeholder: '请选择'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    required: false,
    placeholder: '请输入备注'
  }
  // {
  //   value: 'nativePlace',
  //   initValue: '',
  //   type: 'input',
  //   label: '籍贯',
  //   required: false,
  //   placeholder: '请输入'
  // },
  // {
  //   value: 'nation',
  //   initValue: [],
  //   list: [],
  //   type: 'select',
  //   label: '民族',
  //   required: false,
  //   placeholder: '请选择'
  // },
  // {
  //   value: 'idNumber',
  //   initValue: '',
  //   type: 'input',
  //   label: '身份证件号',
  //   required: false,
  //   placeholder: '请输入'
  // },
  // {
  //   value: 'publicFace',
  //   list: [
  //     {
  //       key: 1,
  //       val: '党员'
  //     },
  //     {
  //       key: 2,
  //       val: '团员'
  //     },
  //     {
  //       key: 3,
  //       val: '群众'
  //     },
  //     {
  //       key: 4,
  //       val: '其他'
  //     }
  //   ],
  //   type: 'select',
  //   label: '政治面貌',
  //   placeholder: '请选择',
  //   required: false
  // }
]
export default {
  name: 'Teachers',
  components: {
    TableList,
    OrgTree,
    PageNum,
    SubmitForm,
    UploadMulti,
    SearchForm,
    NoData,
    ShowDialog
  },
  data() {
    return {
      stuSelect,
      dialogTag: false,
      confirmLoading: false,
      columns,
      searchLabel,
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      uploadFile: [],
      title: '添加教职工',
      formStatus: false,
      formData,
      chooseList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      teacherList: [],
      orgCode: '',
      org: '',
      addOrgCode: '',
      addOrgName: '',
      type: 0,
      teacherId: '',
      orgCodeList: [],
      orgName: '',
      searchObj: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    const list = this.stuSelect.native.map((el, index) => {
      return {
        key: el,
        val: el
      }
    })
    // this.formData[11].list = list
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getTeacherList',
      'addTeacher',
      'getOrgBySchool',
      'getOrgList',
      'deleteTeacher',
      'deleteTeachers',
      'editTeacher',
      'getTeacherOrg'
    ]),
    defaultCode(item) {
      this.orgCodeList = item.code
      this.orgName = item.name
    },
    select(item) {
      this.orgCode = item.code
      this.orgName = item.name
      this.orgCodeList = []
      this.orgCodeList = this.familyTree(item.treeData, item.id)
      this.showList(this.searchObj)
    },
    // 遍历数组 查找节点的父节点
    familyTree(arr1, id) {
      var temp = []
      var forFn = function (arr, id) {
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i]
          if (item.id === id) {
            temp.unshift(item.code)
            forFn(arr1, item.parentId)
            break
          } else {
            if (item.children) {
              forFn(item.children, id)
            }
          }
        }
      }
      forFn(arr1, id)
      return temp
    },
    addOrg(value, name) {
      const arr = []
      value.split(',').forEach((ele) => {
        ele = ele === '' ? this.userInfo.schoolCode : ele
        arr.push(ele)
      })
      this.addOrgCode = arr.join(',')
      this.org = value
      this.addOrgName =
        name.split(',').length > 1 ? name.split(',')[name.split(',').length - 1] : name
      console.log(this.addOrgName)
    },
    submit() {
      this.confirmLoading = true
      setTimeout(() => {
        this.dialogTag = false
        this.confirmLoading = false
      }, 1000)
    },
    searchForm(values) {
      this.searchObj = values
      this.showList(this.searchObj)
    },
    submitForm(values) {
      const req = {
        ...values,
        orgCode: this.type ? this.org : this.addOrgCode,
        orgName: this.addOrgName,
        photoUrl: this.fileList.length > 0 ? this.fileList[0].url : '',
        schoolCode: this.userInfo.schoolCode,
        schoolId: this.userInfo.schoolId,
        teacherId: this.type ? this.teacherId : null
      }
      let res = null
      if (this.type === 0) {
        res = this.addTeacher(req)
      } else {
        res = this.editTeacher(req)
      }
      res
        .then(() => {
          if (this.type === 0) {
            this.$message.success('添加成功')
          } else {
            this.$message.success('编辑成功')
          }
          this.$tools.goNext(() => {
            this.showList(this.searchObj)
            this.$refs.form.reset()
            this.fileList = []
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    actionTeacher(type, record) {
      this.formStatus = true
      if (type) {
        this.type = 1
        this.title = '编辑教职工'
        record.orgCode = []
        this.formData = this.$tools.fillForm(formData, record)
        this.getTeacherOrg({
          userCode: record.userCode,
          schoolCode: this.userInfo.schoolCode
        }).then((res) => {
          this.org = res.data.orgCode
          this.addOrgName = res.data.orgName
          this.formData[3].initValue = res.data.orgCode.split(',')
          if (this.formData[3].initValue[0] === '') {
            this.formData[3].initValue[0] = this.userInfo.schoolCode
          }
          console.log(this.formData[3].initValue)
        })
        record.birthday = this.$tools.getDate(record.birthday, 1)
        this.fileList = record.photoUrl ? [{ url: record.photoUrl }] : []
        this.formData[4].initValue = record.onJob
        this.teacherId = record.id
      } else {
        this.title = '添加教职工'
        this.formData = formData
        this.fileList = []
        this.type = 0
      }
    },
    async showList(searchObj) {
      const req = {
        ...this.pageList,
        ...searchObj,
        schoolCode: this.userInfo.schoolCode,
        orgCode: this.orgCode
      }
      const res = await this.getTeacherList(req)
      if (!res.data) {
        return
      }
      this.teacherList = res.data.list
      this.total = res.data.total
    },
    async deleteList(type, record) {
      if (type) {
        console.log(record.id)
        const req = {
          id: record.id,
          schoolCode: this.userInfo.schoolCode
        }
        await this.deleteTeacher(req)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList(this.searchObj)
        })
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择删除项')
          return
        }
        const req = {
          userIds: this.chooseList,
          schoolCode: this.userInfo.schoolCode
        }
        this.$tools.delTip('您确定删除吗?', () => {
          this.deleteTeachers(req).then((res) => {
            this.$message.success('删除成功')
            this.chooseList = []
            this.$tools.goNext(() => {
              this.showList(this.searchObj)
            })
          })
        })
      }
    },
    clickRow(id) {},
    goDetail(path, record) {
      this.$router.push({
        path,
        query: { userCode: record.userCode, id: record.id }
      })
    },
    goLead() {
      this.orgCodeList[0] =
        this.orgCodeList[0] === '' ? this.userInfo.schoolCode : this.orgCodeList[0]
      const path = `/basedata/bulkImport?code=${this.orgCodeList.join(',')}&name=${
        this.orgName
      }&state=0`
      this.$router.push({ path, query: { type: 'teachers' } })
    }
  }
}
</script>
<style lang="less" scoped>
.teachers {
  background: #fff;
  height: 100%;
  .left {
    padding: 10px;
  }
  .right {
    padding: 0 10px;
    border-left: 1px solid @bor-color;
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
</style>
