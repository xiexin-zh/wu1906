<template>
  <div class="home page-layout qui-fx-ver">
    <a-modal
      :title="checkTitle"
      :visible="checkVisible"
      :confirm-loading="confirmLoading"
      @ok="handleCheckOk"
      @cancel="handleCheckCancel"
    >
      <div class="check-result check-box">
        <div class="check-title">审核结果：</div>
        <div class="check-area">
          <a-radio-group name="radioGroup" v-model="checkData.result">
            <a-radio :value="true"> 通过(录取) </a-radio>
            <a-radio :value="false"> 不通过(不录取) </a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="check-text check-box">
        <div class="check-title">审核意见：</div>
        <div class="check-area">
          <a-textarea
            :style="{ width: '100%' }"
            v-model="checkData.text"
            placeholder="请输入审核意见"
            :auto-size="{ minRows: 3, maxRows: 8 }"
          />
        </div>
      </div>
    </a-modal>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="editFormStatus"
      :form-data="editFormDatas"
      @getGrade="getGrade"
    >
      <div slot="upload" class="qui-fx qui-fx-ac">
        <upload-multi is-check :length="1" v-model="fileList" type="face" :fileInfo="fileInfo"></upload-multi>
      </div>
    </submit-form>
    <div class="head-btn">
      <a-button type="primary" v-if="canCheck" @click="checkClick"> 审核 </a-button>
      <a-button type="primary" :style="{ marginLeft: '10px' }" @click="editFormStatus = true"> 编辑 </a-button>
    </div>
    <div class="message-box">
      <div class="base-message message">
        <div class="title">基本信息</div>
        <div class="base-photo">
          <img :src="photoUrl" alt="" />
        </div>
        <div class="base-msg-table msg-table">
          <div class="table-list">
            <div class="msg-item" v-for="item in baseListOne" :key="item.id">
              <div class="name common">{{ item.name }}</div>
              <div class="text common">{{ item.text }}</div>
            </div>
          </div>
          <div class="table-list">
            <div class="msg-item" v-for="item in baseListTwo" :key="item.id">
              <div class="name common">{{ item.name }}</div>
              <div class="text common">{{ item.text }}</div>
            </div>
          </div>
          <div class="table-list">
            <div class="msg-item" v-for="item in baseListThree" :key="item.id">
              <div class="name common">{{ item.name }}</div>
              <div class="text common">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="project-message message">
        <div class="title">审核信息</div>
        <div class="project-msg-table msg-table">
          <div class="table-list">
            <div class="msg-item" v-for="item in checkInfo" :key="item.id">
              <div class="name common">{{ item.name }}</div>
              <div class="text common">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UploadMulti from '@c/UploadFace'
import SubmitForm from '../../component/SubForm.vue'
import { nation } from '@u/nation'
import Tools from '@u/tools'
const editFormDatas = [
  {
    value: 'gradeName',
    initValue: '',
    list: [],
    type: 'select',
    label: '年级',
    eventClick: true,
    placeholder: '请选择年级'
  },
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '姓名',
    max: 20,
    placeholder: '请输入学生姓名(长度限制在20字符以内)',
    message: '学生姓名限制在20字符以内'
  },
  {
    value: 'sex',
    initValue: '1',
    list: [
      {
        key: '1',
        val: '男'
      },
      {
        key: '2',
        val: '女'
      }
    ],
    type: 'radio',
    label: '性别',
    placeholder: ''
  },
  {
    value: 'idCard',
    initValue: '',
    type: 'input',
    label: '身份证号',
    placeholder: '请输入身份证号',
    message: '身份证号码格式错误',
    regular: 'idCard'
  },
  {
    value: 'identity',
    initValue: '',
    list: [
      {
        key: '群众',
        val: '群众'
      },
      {
        key: '团员',
        val: '团员'
      },
      {
        key: '党员',
        val: '党员'
      }
    ],
    type: 'select',
    label: '政治面貌',
    placeholder: '请选择政治面貌'
  },
  {
    value: 'nation',
    initValue: '',
    list: nation.map((item) => {
      return {
        key: item.name,
        val: item.name
      }
    }),
    type: 'select',
    label: '民族',
    placeholder: '请选择民族'
  },
  {
    value: 'mobile',
    initValue: '',
    type: 'input',
    label: '联系电话',
    placeholder: '请输入电话号码',
    message: '电话号码格式错误',
    regular: 'phone'
  },
  {
    value: 'project',
    initValue: '',
    list: [],
    type: 'select',
    label: '申请专业',
    placeholder: '请选择专业'
  },
  {
    value: 'source',
    initValue: '',
    list: [
      {
        key: '应届',
        val: '应届'
      },
      {
        key: '非应届',
        val: '非应届'
      }
    ],
    type: 'radio',
    label: '学生来源',
    placeholder: ''
  },
  {
    value: 'object',
    initValue: '',
    list: [
      {
        key: '应届初中',
        val: '应届初中'
      },
      {
        key: '非应届',
        val: '非应届'
      }
    ],
    type: 'radio',
    label: '招生对象',
    placeholder: ''
  },
  {
    value: 'lastSchool',
    initValue: '',
    type: 'input',
    label: '毕业学校',
    max: 20,
    placeholder: '请输入毕业学校',
    message: '毕业学校名称限制在20字符内'
  },
  {
    value: 'health',
    initValue: '',
    type: 'input',
    label: '健康状况',
    max: 10,
    placeholder: '请输入健康状况',
    message: '健康状况限制在10字符内'
  },
  {
    value: 'houseType',
    initValue: '',
    list: [
      {
        key: '农业',
        val: '农业'
      },
      {
        key: '非农',
        val: '非农'
      }
    ],
    type: 'radio',
    label: '户口性质',
    placeholder: ''
  },
  {
    value: 'address',
    initValue: '',
    type: 'input',
    label: '户口所在地区县以下详细地址',
    max: 30,
    placeholder: '请输入详细地址',
    message: '详细地址限制在30字符内'
  },
  {
    value: 'police',
    initValue: '',
    type: 'input',
    label: '所属派出所',
    placeholder: '请输入所属派出所名称',
    max: 20,
    message: '派出所名称限制在20字符内'
  },
  {
    value: 'addressType',
    initValue: '',
    list: [
      {
        key: '农村',
        val: '农村'
      },
      {
        key: '城镇',
        val: '城镇'
      },
      {
        key: '县城',
        val: '县城'
      }
    ],
    type: 'select',
    label: '学生居住地类型',
    placeholder: '请选择居住地类型'
  },
  {
    value: 'addressNow',
    initValue: '',
    type: 'input',
    label: '家庭现住址',
    max: 20,
    placeholder: '请输入家庭现住址',
    message: '住址限制在20字符内'
  },
  {
    value: 'parentName',
    initValue: '',
    type: 'input',
    label: '家长姓名',
    max: 20,
    placeholder: '请输入家长姓名',
    message: '家长姓名在20字符内'
  },
  {
    value: 'parentTel',
    initValue: '',
    type: 'input',
    label: '家长手机号',
    placeholder: '请输入家长手机号',
    message: '电话号码格式错误',
    regular: 'phone'
  },
  {
    value: 'relation',
    initValue: '',
    type: 'input',
    label: '与本人关系',
    max: 10,
    placeholder: '请输入家长与本人关系',
    message: '关系字数在10字符内'
  },
  {
    value: 'isGuardian',
    initValue: '',
    list: [
      {
        key: true,
        val: '是'
      },
      {
        key: false,
        val: '否'
      }
    ],
    type: 'radio',
    label: '是否监护人',
    placeholder: ''
  },
  {
    type: 'upload',
    initValue: '',
    label: '学生人脸照片(选填)',
    required: false,
    placeholder: '请上传人脸照片'
  },
  {
    value: 'purpose',
    initValue: '',
    list: [
      {
        key: '高',
        val: '高'
      },
      {
        key: '中',
        val: '中'
      },
      {
        key: '低',
        val: '低'
      }
    ],
    type: 'select',
    label: '意向程度',
    placeholder: '请选择意向程度'
  },
  {
    value: 'mark',
    initValue: '',
    type: 'textarea',
    label: '备注',
    required: false,
    placeholder: '请输入备注信息'
  }
]
export default {
  name: 'ApplyDetails',
  components: {
    SubmitForm,
    UploadMulti
  },
  data() {
    return {
      title: '编辑新生',
      editFormStatus: false,
      canCheck: false,
      editFormDatas,
      fileList: [],
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      photoUrl: '',
      checkTitle: '审核',
      checkVisible: false,
      confirmLoading: false,
      applyId: '',
      checkData: {
        result: true,
        checkText: ''
      },
      baseListOne: [
        {
          id: '1',
          name: '姓名',
          text: ''
        },
        {
          id: '2',
          name: '申请状态',
          text: ''
        },
        {
          id: '3',
          name: '性别',
          text: ''
        },
        {
          id: '4',
          name: '政治面貌',
          text: ''
        },
        {
          id: '5',
          name: '身份证号',
          text: ''
        },
        {
          id: '6',
          name: '民族',
          text: ''
        },
        {
          id: '7',
          name: '年级',
          text: ''
        },
        {
          id: '8',
          name: '学生来源',
          text: ''
        },
        {
          id: '9',
          name: '申请专业',
          text: ''
        },
        {
          id: '10',
          name: '招生对象',
          text: ''
        },
        {
          id: '11',
          name: '联系电话',
          text: ''
        },
        {
          id: '12',
          name: '毕业学校',
          text: ''
        },
        {
          id: '13',
          name: '申请时间',
          text: ''
        },
        {
          id: '14',
          name: '健康状况',
          text: ''
        }
      ],
      baseListTwo: [
        {
          id: '1',
          name: '户口性质',
          text: ''
        },
        {
          id: '2',
          name: '家长姓名',
          text: ''
        },
        {
          id: '3',
          name: '户口所在地区县一下详细地址',
          text: ''
        },
        {
          id: '4',
          name: '家长手机号',
          text: ''
        },
        {
          id: '5',
          name: '所属派出所',
          text: ''
        },
        {
          id: '6',
          name: '与本人关系',
          text: ''
        },
        {
          id: '7',
          name: '学生居住地类型',
          text: ''
        },
        {
          id: '8',
          name: '是否监护人',
          text: ''
        },
        {
          id: '9',
          name: '家庭现住址',
          text: ''
        }
      ],
      baseListThree: [
        {
          id: '1',
          name: '意向程度',
          text: ''
        },
        {
          id: '2',
          name: '备注',
          text: ''
        }
      ],
      checkInfo: [
        {
          id: '1',
          name: '审核意见',
          text: ''
        },
        {
          id: '2',
          name: '审核人',
          text: ''
        },
        {
          id: '3',
          name: '审核时间',
          text: ''
        }
      ]
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'gradeList', 'schoolCode'])
  },
  mounted() {
    this.applyId = this.$route.query.id
    this.showList(this.$route.query.id)
    this.editFormDatas[0].list = this.gradeList.map((item) => {
      return {
        key: Number(item.gradeName),
        val: Number(item.gradeName)
      }
    })
  },
  methods: {
    ...mapActions('home', ['studentDetail', 'singleCheck', 'editStudent', 'getApplyTree']),
    async showList(id) {
      const res = await this.studentDetail(id)
      if (res && res.code === 200) {
        const {
          photoUrl,
          studentName,
          state,
          gender,
          politicalOutlook,
          idNumber,
          nationality,
          grade,
          studentSource,
          majorCode,
          majorName,
          enrollmentTarget,
          mobile,
          graduationSchool,
          createTime,
          healthyState,
          registrationNature,
          parentName,
          homeAddress,
          parentMobile,
          policeStation,
          relationship,
          residentialType,
          hasGuardian,
          registrationAddress,
          intentionDegree,
          remark,
          auditOpinion,
          auditor,
          auditTime
        } = res.data
        this.canCheck = (state === '1' || state === '2')
        this.photoUrl = photoUrl
        this.fileList = [{ url: photoUrl }]
        const baseOne = [
          studentName,
          this.getState(state),
          this.getSex(gender),
          politicalOutlook,
          idNumber,
          nationality,
          grade,
          studentSource,
          majorName,
          enrollmentTarget,
          mobile,
          graduationSchool,
          createTime ? Tools.getDate(createTime) : '',
          healthyState
        ]
        const baseTwo = [
          registrationNature,
          parentName,
          homeAddress,
          parentMobile,
          policeStation,
          relationship,
          residentialType,
          hasGuardian ? '是' : '否',
          registrationAddress
        ]
        const baseThree = [intentionDegree, remark]
        const checkArr = [auditOpinion, auditor, auditTime ? Tools.getDate(auditTime) : '']
        this.baseListOne = this.baseListOne.map((item, index) => {
          return {
            ...item,
            text: baseOne[index]
          }
        })
        this.baseListTwo = this.baseListTwo.map((item, index) => {
          return {
            ...item,
            text: baseTwo[index]
          }
        })
        this.baseListThree = this.baseListThree.map((item, index) => {
          return {
            ...item,
            text: baseThree[index]
          }
        })
        this.checkInfo = this.checkInfo.map((item, index) => {
          return {
            ...item,
            text: checkArr[index]
          }
        })
        this.editFormDatas[0].initValue = grade
        this.editFormDatas[1].initValue = studentName
        this.editFormDatas[2].initValue = gender
        this.editFormDatas[3].initValue = idNumber
        this.editFormDatas[4].initValue = politicalOutlook
        this.editFormDatas[5].initValue = nationality
        this.editFormDatas[6].initValue = mobile
        this.editFormDatas[7].initValue = majorCode
        this.editFormDatas[8].initValue = studentSource
        this.editFormDatas[9].initValue = enrollmentTarget
        this.editFormDatas[10].initValue = graduationSchool
        this.editFormDatas[11].initValue = healthyState
        this.editFormDatas[12].initValue = registrationNature
        this.editFormDatas[13].initValue = homeAddress
        this.editFormDatas[14].initValue = policeStation
        this.editFormDatas[15].initValue = residentialType
        this.editFormDatas[16].initValue = homeAddress
        this.editFormDatas[17].initValue = parentName
        this.editFormDatas[18].initValue = parentMobile
        this.editFormDatas[19].initValue = relationship
        this.editFormDatas[20].initValue = hasGuardian
        this.editFormDatas[21].initValue = photoUrl,
        this.editFormDatas[22].initValue = intentionDegree
        this.editFormDatas[23].initValue = remark

        // this.editFormDatas[7].list = [{key: majorCode, val: majorName}]
        this.getGrade(grade)
      }
    },
    // 打开审核弹框
    checkClick() {
      this.checkVisible = true
    },
    // 审核提交
    async handleCheckOk() {
      const req = {
        auditOpinion: this.checkData.text,
        auditResult: this.checkData.result,
        auditor: this.userInfo.userName,
        id: this.applyId
      }
      const res = await this.singleCheck(req)
      if (res && res.code === 200) {
        this.$message.success('审核成功')
        this.checkVisible = false
        this.$router.push({
          path: '/studentApply'
        })
      } else {
        this.$message.error('审核失败')
      }
      // this.checkVisible = false
    },
    // 取消审核
    handleCheckCancel() {
      this.checkVisible = false
    },
    // 编辑学生信息提交
    async submitForm(item) {
      const photoUrl = this.fileList.length === 0 ? '' : this.fileList[0].url
      const gradeList = this.gradeTreeList.filter((el) => {
        return el.grade === item.gradeName
      })
      const majorList = gradeList[0].majorList
      const nowMajor = majorList.filter((el) => {
        return el.majorCode === item.project
      })
      const req = {
        enrollmentTarget: item.object,
        gender: item.sex,
        grade: item.gradeName,
        graduationSchool: item.lastSchool,
        hasGuardian: item.isGuardian,
        healthyState: item.health,
        homeAddress: item.addressNow,
        id: this.applyId,
        idNumber: item.idCard,
        intentionDegree: item.purpose,
        majorCode: item.project,
        majorName: nowMajor[0].majorName,
        mobile: item.mobile,
        nationality: item.nation,
        parentMobile: item.parentTel,
        parentName: item.parentName,
        photoUrl: photoUrl,
        policeStation: item.police,
        politicalOutlook: item.identity,
        registrationAddress: item.address,
        registrationNature: item.houseType,
        relationship: item.relation,
        remark: item.mark,
        residentialType: item.addressType,
        studentName: item.name,
        studentSource: item.source
      }
      const res = await this.editStudent(req)
      if (res && res.code === 200) {
        this.editFormStatus = false
        this.showList(this.applyId)
      }
    },
    // 获取申请状态
    getState(state) {
      const status = Number(state)
      if (status === 1) {
        return '申请中'
      }
      if (status === 2) {
        return '申请失败'
      }
      if (status === 3) {
        return '申请成功'
      }
      return '未知'
    },
    // 获取年级下专业列表
    async getGrade(gradeName) {
      const res = await this.getApplyTree(this.schoolCode)
      this.gradeTreeList = [...res.data]
      const list = [...res.data].filter((item) => {
        return item.grade === gradeName
      })
      if (list.length > 0) {
        this.editFormDatas[7].list = list[0].majorList.map((item) => {
          return {
            ...item,
            key: item.majorCode,
            val: item.majorName
          }
        })
      }
    },
    getSex(text) {
      if (text === 1 || text === '1') {
        return '男'
      }
      if (text === 2 || text === '2') {
        return '女'
      }
      return '未知'
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  padding: 20px 40px;
}
.check-box {
  display: flex;

  .check-title {
    width: 100px;
    margin-bottom: 20px;
  }
  .check-area {
    flex: 1;
  }
}
.head-btn {
  width: 100%;
  margin: 0 auto;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  box-sizing: border-box;
}
.message-box {
  flex: 1;
  box-sizing: border-box;
  padding-right: 20px;
  overflow-y: auto;
}
.title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 46px;
  padding: 0 10px;
  font-size: 16px;
  background: rgba(242, 242, 242, 1);
}
.message {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.base-message,
.project-message {
  padding: 30px 0;
  margin-bottom: 50px;

  .base-photo {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 150px;
      height: 170px;
    }
  }

  .base-msg-table,
  .project-msg-table {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    padding: 40px 100px;
    border: 1px solid rgba(242, 242, 242, 1);

    .table-list {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      margin-bottom: 20px;

      .msg-item {
        display: flex;
        width: 50%;
        border: 1px solid #ccc;
        border-top: 0;
        border-left: 0;

        .common {
          box-sizing: border-box;
          height: 40px;
          padding: 0 8px;
        }

        .name {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          width: 40%;
          background-color: rgba(242, 242, 242, 1);
        }
        .text {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 60%;
        }
      }

      .msg-item:nth-child(2n + 1) {
        border-top: 0;
        border-left: 1px solid #ccc;
      }
      .msg-item:nth-child(1) {
        border-top: 1px solid #ccc;
      }
      .msg-item:nth-child(2) {
        border-top: 1px solid #ccc;
      }
    }
  }
}
</style>
