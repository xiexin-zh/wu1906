<template>
  <div class="class-honor qui-fx">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
      <div slot="upload" class="qui-fx qui-fx-ac">
        <upload-video
          v-if="flag"
          type="image"
          :length="1"
          v-model="fileList"
          :fileInfo="fileInfo"
          @delUpload="delUpload"
        ></upload-video>
        <span class="u-mar-l10 u-font-01 u-tips-color">支持上传png/jpg格式,大小不能超过10M</span>
      </div>
    </submit-form>
    <div class="left">
      <major-tree
        v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
        @select="select"
      ></major-tree>
      <class-tree v-else @select="select"></class-tree>
    </div>
    <div class="right qui-fx-ver">
      <div class="qui-fx-je u-mar-b10">
        <a-button class="mar-r10" type="primary" @click="addHonor(0)">
          <a-icon type="plus" />新增
        </a-button>
        <a-button type="danger" @click="deleHonor(0)">
          <a-icon type="delete" />批量删除
        </a-button>
      </div>
      <table-list
        is-check
        is-zoom
        :page-list="pageList"
        v-model="chooseList"
        :columns="columns"
        :table-list="dataList"
      >
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="修改">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addHonor(1, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm="deleHonor(1, action.record)"
          >
            <template slot="title">您确定删除吗?</template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import UploadVideo from '@c/UploadVideo'
import ClassTree from '@c/ClassTree'
import MajorTree from '@c/MajorTree'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'
import SubmitForm from '@c/SubmitForm'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '荣誉名称',
    dataIndex: 'content',
    width: '20%'
  },
  {
    title: '获奖时间',
    dataIndex: 'awardTime',
    width: '15%',
    customRender: text => {
      return Tools.getDate(text, 1)
    }
  },
  {
    title: '获奖图片',
    dataIndex: 'photoUrl',
    width: '20%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: text => {
      return Tools.getDate(text, 1)
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'content',
    initValue: '',
    type: 'input',
    label: '荣誉名称',
    max: 50,
    placeholder: '请输入荣誉名称, 不超过50个字符'
  },
  {
    value: 'awardTime',
    initValue: '',
    type: 'singleTime',
    label: '获奖时间',
    placeholder: '请选择获奖时间'
  },
  {
    type: 'upload',
    label: '图片',
    required: false,
    placeholder: '请上传图片'
  }
]
export default {
  components: {
    ClassTree,
    TableList,
    PageNum,
    SubmitForm,
    UploadVideo,
    MajorTree
  },
  data() {
    return {
      columns,
      formData,
      formStatus: false,
      flag: true,
      title: '新增荣誉',
      dataList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      chooseList: [],
      fileInfo: {
        url: '',
        tip: '上传图片',
        h: 200,
        w: 200
      },
      fileList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'loginType'])
  },
  created() {
    this.fileInfo.url = `${hostEnv.protal_api_11014}/study/theme/file/uploadFile?schoolCode=${this.userInfo.schoolCode}`
  },
  methods: {
    ...mapActions('home', [
      'getClassHonorList',
      'getClassHonorDetail',
      'addClassHonor',
      'editClassHonor',
      'deleClassHonor',
      'delFile'
    ]),
    // 选中年级
    select(item) {
      console.log(item)
      if (item.classCode) {
        this.classInfo = item
        this.showList()
      }
    },
    delUpload(value) {
      // this.delFile(value.id)
      this.flag = false
      this.$nextTick(() => {
        this.flag = true
      })
    },
    async showList() {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.classInfo.schoolYearId,
        classCode: this.classInfo.classCode,
        gradeCode: this.classInfo.gradeCode
      }
      const res = await this.getClassHonorList(req)
      this.dataList = res.data.list
      this.total = res.data.total
    },
    async deleHonor(type, record) {
      if (type) {
        console.log(record.id)
        const req = {
          ids: [record.id]
        }
        await this.deleClassHonor(req)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择删除项')
          return
        }
        this.$tools.delTip('确认删除吗?', async () => {
          const req = {
            ids: this.chooseList
          }
          await this.deleClassHonor(req)
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      }
    },
    addHonor(type, record) {
      this.formStatus = true
      if (type) {
        console.log(record)
        this.title = '编辑荣誉'
        this.id = record.id
        record.awardTime = this.$tools.getDate(record.awardTime, 1)
        this.formData = this.$tools.fillForm(formData, record)
        this.fileList = record.photoUrl ? [{ url: record.photoUrl, id: record.photoId }] : []
        this.type = 1
      } else {
        this.title = '新增荣誉'
        this.formData = formData
        this.fileList = []
        this.type = 0
      }
    },
    submitForm(values) {
      console.log(values)
      const req = {
        ...values,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.classInfo.schoolYearId,
        classCode: this.classInfo.classCode,
        gradeCode: this.classInfo.gradeCode,
        className: this.classInfo.clazzName,
        gradeName: this.classInfo.gradeName,
        photoUrl: this.fileList.length > 0 ? this.fileList[0].url : '',
        photoId: this.fileList.length > 0 ? this.fileList[0].id : '',
        createUsercode: this.loginType.userCode,
        createUsername: this.loginType.userName
      }
      let res = null
      if (this.type === 0) {
        res = this.addClassHonor(req)
      } else {
        req.id = this.id
        res = this.editClassHonor(req)
      }
      res
        .then(() => {
          this.keywords = ''
          this.$message.success(this.type === 0 ? '添加成功' : '编辑成功')
          this.$tools.goNext(() => {
            this.showList()
            this.$refs.form.reset()
            this.fileList = []
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    }
  }
}
</script>

<style lang="less" scoped>
.class-honor {
  flex: 1;
  overflow: hidden;
  .left {
    background: #fff;
    margin-right: 10px;
    padding: 10px;
    width: 200px;
  }
  .right {
    position: relative;
    flex: 1;
    background: #fff;
    padding: 10px;
    width: calc(100% - 210px);
  }
}
</style>
