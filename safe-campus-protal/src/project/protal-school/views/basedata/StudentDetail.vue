<template>
  <div class="student-detail page-layout qui-fx-ver">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="基本信息"> </a-tab-pane>
    </a-tabs>
    <div class="top">
      <div class="qui-fx-ver">
        <p class="info qui-fx">
          <span>学年： {{ year }}学年</span>
          <span>姓名： {{ studentInfo.userName }}</span>
          <span>学号： {{ studentInfo.workNo }}</span>
          <span>年级： {{ studentInfo.gradeName }}</span>
          <span>班级： {{ studentInfo.className }}</span>
          <span>入学年份： {{ studentInfo.admissionTime }}</span>
          <span>性别： {{ studentInfo.sex | getSex() }}</span>
          <span>走住读类型： {{ studentInfo.hasDorm | getDorm() }}</span>
          <!-- <span>状态： {{ getStudentStatus(studentInfo.status) }}</span> -->
        </p>
        <p class="phone qui-fx">
          <span class="qui-fx-ac">人脸：</span>
          <a-popover placement="right">
            <template slot="content">
              <img
                :src="studentInfo.photoUrl"
                style="max-width: 200px; max-height: 220px; display: block"
                alt=""
              />
            </template>
            <img
              :src="studentInfo.photoUrl"
              style="max-width: 80px; max-height: 80px; display: block"
              alt=""
            />
          </a-popover>
        </p>
        <span>备注： {{ studentInfo.remark }}</span>
      </div>
    </div>
    <div class="center" ref="TabBox">
      <a-tabs default-active-key="1" class="table-tabs" @change="tabChange" v-model="tabValue">
        <a-tab-pane key="0" tab="个人简介">
          <no-data msg="暂无数据~" v-if="noDataTag"></no-data>
          <div
            v-else
            class="content qui-fx-ver qui-fx-f1 u-auto"
            :style="{ height: height + 'px' }"
          >
            <div class="table intro qui-fx-ver qui-fx-f1">
              <div class="u-fx-ac u-mar-b10">
                <img class="line" src="http://canpointtest.com/mobile-img/line.png" />
                <span class="u-mar-l20 u-font-01 u-bold">个人简介：</span>
              </div>
              <div class="u-mar-b20">
                <span class="content">{{ introduction }}</span>
              </div>
              <div v-if="photoList.length > 0" class="u-fx-ac u-mar-b10">
                <img class="line" src="http://canpointtest.com/mobile-img/line.png" />
                <span class="u-mar-l20 u-font-01 u-bold">个人风采：</span>
              </div>
              <div class="">
                <div class="photo-list" v-for="(item, i) in photoList" :key="i">
                  <img class="intro-img" :src="item.url" />
                  <div class="u-fx-ac-jc u-te">{{ item.photoDes }}</div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="1" tab="学生家长">
          <div class="content qui-fx-ver qui-fx-f1">
            <div class="table qui-fx-ver qui-fx-f1">
              <!-- <div style="display: flex; justify-content: flex-end">
                <a-button style="margin-right: 20px" type="primary" @click="addParent(1)">
                  <a-icon type="plus" />添加
                </a-button>
              </div> -->
              <table-list :columns="columns" :table-list="parentsList">
                <template slot="customTitle">
                  <span title="默认该学生注册的第一个家长是主要家长，主要家长有权限管理其他家长"
                    >主要家长 <a-icon type="question-circle"
                  /></span>
                </template>
                <template v-slot:other1="other1">
                  <div>
                    <a-switch
                      :disabled="other1.record.hasMainParent"
                      @click.native.stop
                      @change="changeMain($event, other1.record)"
                      v-model="other1.record.hasMainParent"
                    />
                  </div>
                </template>
                <template v-slot:actions="action">
                  <a-tooltip placement="topLeft" title="编辑">
                    <a-button
                      size="small"
                      class="edit-action-btn"
                      icon="edit"
                      @click.stop="addParent(0, action.record)"
                    ></a-button>
                  </a-tooltip>
                  <a-popconfirm
                    placement="left"
                    okText="确定"
                    cancelText="取消"
                    @confirm="_deleteParent(action.record)"
                  >
                    <template slot="title"> 确定删除吗? </template>
                    <a-tooltip placement="topLeft" title="删除">
                      <a-button size="small" class="del-action-btn" icon="delete"></a-button>
                    </a-tooltip>
                  </a-popconfirm>
                </template>
              </table-list>
            </div>
          </div>
        </a-tab-pane>
        <!-- <a-tab-pane key="2" tab="学籍信息">
          <div class="content qui-fx-ver qui-fx-f1">
            <div class="table qui-fx-ver qui-fx-f1">
              <div class="student-status">
                <div class="table-list">
                  <div class="msg-item" v-for="item in studentMsg" :key="item.id">
                    <div class="name common">{{ item.name }}</div>
                    <div class="text common">{{ item.text }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane> -->
        <a-tab-pane key="3" tab="异动记录">
          <div class="content qui-fx-ver qui-fx-f1">
            <div class="table qui-fx-ver qui-fx-f1">
              <table-list :columns="changeColumns" :table-list="changeList">
                <template v-slot:other1="other1">
                  {{ other1.record.oldGradeName }}{{ other1.record.oldClassName }}
                </template>
                <template v-slot:other2="other2">
                  {{ other2.record.newGradeName }}{{ other2.record.newClassName }}
                </template>
              </table-list>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="调宿记录">
          <div class="content qui-fx-ver qui-fx-f1">
            <div class="table qui-fx-ver qui-fx-f1">
              <table-list :columns="dormColumns" :table-list="dormList">
                <template v-slot:other1="other1">
                  {{ other1.record.oldBuildingName }}{{ other1.record.oldFloorName
                  }}{{ other1.record.oldRoomName }}
                </template>
                <template v-slot:other2="other2">
                  {{ other2.record.newBuildingName }}{{ other2.record.newFloorName
                  }}{{ other2.record.newRoomName }}
                </template>
              </table-list>
            </div>
          </div>
        </a-tab-pane>
        <!-- <a-tab-pane key="5" tab="奖励">
          <div class="content qui-fx-ver qui-fx-f1">
            <div class="table qui-fx-ver qui-fx-f1">
              <table-list :columns="awardColumns" :table-list="awardList"> </table-list>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="6" tab="处分">
          <div class="content qui-fx-ver qui-fx-f1">
            <div class="table qui-fx-ver qui-fx-f1">
              <table-list :columns="punishmentColumns" :table-list="punishmentList"> </table-list>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="7" tab="成绩">
          <div class="content qui-fx-ver qui-fx-f1">
            <div class="table qui-fx-ver qui-fx-f1">
              <table-list
                :minHeight="tabHeight - 100 < 100 ? 150 : tabHeight - 100"
                :columns="scoreColumns"
                :table-list="scoreList"
                :scrollH="tabHeight - 150 < 100 ? 100 : tabHeight - 150"
              >
                <template v-slot:other1="other1">
                  <div style="display: flex; flex-direction: column;">
                    <span v-for="item in other1.record.list" :key="item.id">
                      {{ `${item.subjectName}：${item.score}分` }}
                    </span>
                  </div>
                </template>
              </table-list>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="8" tab="品德评语">
          <div class="content qui-fx-ver qui-fx-f1">
            <div class="table qui-fx-ver qui-fx-f1">
              <table-list :columns="moralityColumns" :table-list="moralityList"> </table-list>
            </div>
          </div>
        </a-tab-pane> -->
      </a-tabs>
    </div>
    <sub-form
      ref="form"
      @submit-form="submitForm"
      :title="formTitle"
      v-model="formStatus"
      :form-data="formData"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import { Switch } from 'ant-design-vue'
import Tools from '@u/tools'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import SubForm from '../components/SubForm'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '家长姓名',
    dataIndex: 'parentName',
    width: '10%'
  },
  {
    title: '家长电话',
    dataIndex: 'mobile',
    width: '15%'
  },
  {
    title: '亲属关系',
    dataIndex: 'relationship',
    width: '21%',
    customRender: text => {
      return Tools.relationship(text)
    }
  },
  // {
  //   title: '工作单位',
  //   dataIndex: 'workUnit',
  //   width: '20%'
  // },
  // {
  //   title: '职务',
  //   dataIndex: 'duty',
  //   width: '15%'
  // },
  // {
  //   title: '政治面貌',
  //   dataIndex: 'publicFace',
  //   width: '15%',
  //   customRender: (text) => {
  //     return Tools.getPoliticsStatus(text)
  //   }
  // },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text, 1)
    }
  },
  {
    slots: { title: 'customTitle' },
    dataIndex: 'hasMainParent',
    width: '20%',
    scopedSlots: {
      customRender: 'other1'
    }
  }
  // {
  //   title: '操作',
  //   width: '10%',
  //   scopedSlots: {
  //     customRender: 'action'
  //   }
  // }
]
const changeColumns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '异动类型',
    dataIndex: 'type',
    width: '20%',
    customRender: (text, record) => {
      const { inOrOut } = record
      let type = ''
      if (inOrOut === 1 || inOrOut === '1') {
        type = '(转入)'
      } else if (inOrOut === 2 || inOrOut === '2') {
        type = '(转出)'
      }
      switch (parseInt(text)) {
        case 0:
          return `转学${type}`
        case 1:
          return '入学'
        case 2:
          return '移出班级'
        case 3:
          return '加入班级'
        case 4:
          return '休学'
        case 5:
          return '退学'
        case 6:
          return '复学'
        case 7:
          return '升级'
        case 8:
          return '毕业'
        case 9:
          return '转班'
      }
    }
  },
  {
    title: '异动前',
    dataIndex: 'oldClassName',
    width: '20%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '异动后',
    dataIndex: 'newClassName',
    width: '20%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '异动时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return text ? Tools.getDate(text) : ''
    }
  } /* ,
  {
    title: '操作人',
    dataIndex: 'optName',
    width: '15%'
  } */
]
const dormColumns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '调宿类型',
    dataIndex: 'status',
    width: '20%',
    customRender: text => {
      switch (parseInt(text)) {
        case 1:
          return '入住'
        case 2:
          return '退宿'
        case 3:
          return '调宿'
      }
    }
  },
  {
    title: '调宿前',
    dataIndex: 'oldBuildingName',
    width: '20%'
  },
  {
    title: '调宿后',
    dataIndex: 'newBuildingName',
    width: '20%'
  },
  {
    title: '调宿时间',
    dataIndex: 'updateTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text)
    }
  } /* ,
  {
    title: '操作人',
    dataIndex: 'optName',
    width: '15%'
  } */
]
const awardColumns = [
  {
    title: '序号',
    width: '8%',
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
    title: '班级',
    dataIndex: 'className',
    width: '15%'
  },
  {
    title: '奖励',
    dataIndex: 'awardType',
    width: '10%',
    customRender: text => {
      return Tools.getAwardType(text)
    }
  },
  {
    title: '奖金',
    dataIndex: 'awardMoney',
    width: '8%'
  },
  {
    title: '奖励日期',
    dataIndex: 'disposeDate',
    width: '15%',
    customRender: text => {
      return Tools.getDate(text, 1)
    }
  },
  {
    title: '颁奖单位',
    dataIndex: 'disposeUnit',
    width: '10%'
  },
  {
    title: '奖励原因',
    dataIndex: 'disposeReason',
    width: '15%'
  },
  {
    title: '添加人',
    dataIndex: 'createUser',
    width: '10%'
  },
  {
    title: '添加时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text)
    }
  }
]
const punishmentColumns = [
  {
    title: '序号',
    width: '8%',
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
    title: '班级',
    dataIndex: 'className',
    width: '15%'
  },
  {
    title: '处分',
    dataIndex: 'punishmentType',
    width: '15%',
    customRender: text => {
      return Tools.getPunishmentType(text)
    }
  },
  {
    title: '处分日期',
    dataIndex: 'disposeDate',
    width: '15%',
    customRender: text => {
      return text ? Tools.getDate(text, 1) : ''
    }
  },
  {
    title: '处分原因',
    dataIndex: 'disposeReason',
    width: '20%'
  },
  {
    title: '撤销说明',
    dataIndex: 'cancelReason',
    width: '15%'
  },
  {
    title: '撤销日期',
    dataIndex: 'cancelTime',
    width: '20%',
    customRender: text => {
      return text ? Tools.getDate(text, 5) : ''
    }
  },
  {
    title: '添加人',
    dataIndex: 'createUser',
    width: '10%'
  },
  {
    title: '添加时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text)
    }
  }
]
const scoreColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学年',
    dataIndex: 'schoolYearName',
    width: '20%'
  },
  // {
  //   title: '学期',
  //   dataIndex: 'semester',
  //   width: '15%'
  // },
  {
    title: '考试名称',
    dataIndex: 'planName',
    width: '20%'
  },
  {
    title: '科目',
    dataIndex: 'subjectName',
    width: '20%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '总分',
    dataIndex: 'allScore',
    width: '10%',
    customRender: text => {
      return `${text}分`
    }
  },
  {
    title: '考试时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text)
    }
  }
]
const moralityColumns = [
  {
    title: '序号',
    width: '8%',
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
    title: '班级',
    dataIndex: 'className',
    width: '15%'
  },
  {
    title: '品德等级',
    dataIndex: 'moralityLevel',
    width: '15%'
  },
  {
    title: '品德评语',
    dataIndex: 'moralityComment',
    width: '20%'
  },
  {
    title: '填写人',
    dataIndex: 'writeUser',
    width: '10%'
  },
  {
    title: '填写日期',
    dataIndex: 'writeDate',
    width: '15%',
    customRender: text => {
      return Tools.getDate(text, 1)
    }
  },
  {
    title: '添加人',
    dataIndex: 'createUser',
    width: '10%'
  },
  {
    title: '添加时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text)
    }
  }
]
const statusList = [
  {
    name: '在读',
    key: '1'
  },
  {
    name: '休学',
    key: '2'
  },
  {
    name: '退学',
    key: '3'
  },
  {
    name: '复学',
    key: '4'
  }
]
const formData = [
  {
    value: 'parentName',
    initValue: '',
    type: 'input',
    label: '家长姓名',
    max: 20,
    placeholder: '请输入家长姓名'
  },
  {
    value: 'parentPhone',
    initValue: '',
    type: 'input',
    label: '手机号',
    regular: 'phone',
    placeholder: '请输入手机号'
  },
  {
    value: 'relationship',
    initValue: '',
    list: [
      {
        key: '1',
        val: '爸爸'
      },
      {
        key: '2',
        val: '妈妈'
      },
      {
        key: '3',
        val: '爷爷'
      },
      {
        key: '4',
        val: '奶奶'
      },
      {
        key: '5',
        val: '其它'
      }
    ],
    type: 'select',
    label: '关系',
    placeholder: '请选择'
  },
  {
    value: 'workUnit',
    initValue: '',
    type: 'input',
    label: '工作单位',
    required: false,
    placeholder: '请输入工作单位'
  },
  {
    value: 'duty',
    initValue: '',
    type: 'input',
    label: '职务',
    required: false,
    placeholder: '请输入职务'
  },
  {
    value: 'publicFace',
    initValue: '',
    list: [
      {
        key: 1,
        val: '党员'
      },
      {
        key: 2,
        val: '团员'
      },
      {
        key: 3,
        val: '群众'
      },
      {
        key: 4,
        val: '其它'
      }
    ],
    type: 'select',
    required: false,
    label: '政治面貌',
    placeholder: '请选择'
  }
]

export default {
  name: 'StudentDetail',
  components: {
    NoData,
    TableList,
    ASwitch: Switch,
    SubForm,
    PageNum
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      changeTag: false,
      changeTitle: '变更',
      columns,
      changeColumns,
      dormColumns,
      awardColumns,
      punishmentColumns,
      scoreColumns,
      moralityColumns,
      userCode: '',
      year: '',
      parentsList: [],
      changeList: [],
      dormList: [],
      selectedParent: '',
      studentInfo: {},
      childCode: '',
      yearId: '',
      status: '1',
      tabValue: '0',
      statusList,
      photoList: [],
      introduction: '',
      noDataTag: false,
      height: 0,
      awardList: [],
      punishmentList: [],
      scoreList: [],
      moralityList: [],
      schoolYearList: [],
      formTitle: '添加',
      addType: '',
      parentId: '',
      formStatus: false,
      formData,
      tabHeight: 200,
      scoreTotal: 0,
      studentMsg: [
        {
          id: '1',
          name: '籍贯',
          text: ''
        },
        {
          id: '2',
          name: '政治面貌',
          text: ''
        },
        {
          id: '3',
          name: '民族',
          text: ''
        },
        {
          id: '4',
          name: '家庭住址',
          text: ''
        }
      ]
    }
  },
  mounted() {
    this.tabHeight = this.$refs.TabBox.offsetHeight || 200
    this.height = window.innerHeight - 460
    this.userCode = this.$route.query.userCode
    this.year = this.$route.query.year
    this.yearId = this.$route.query.yearId
    this.showStudentInfo()
    this.getSchoolYearList()
  },
  methods: {
    ...mapActions('home', [
      'queryStudentInfoById',
      'getParents',
      'setParents',
      'getChangeList',
      'getDormChangeList',
      'getIntro',
      'addParents',
      'deleteParent',
      'editParent',
      'getAwardList',
      'getPunishment',
      'getMorality',
      'getScoreShow',
      'getSchoolYear'
    ]),
    tabChange() {
      console.log(this.tabValue)
      this.showList()
    },
    changeMain(value, e) {
      this.parentsList.map(ele => {
        ele.hasMainParent = false
      })
      const index = this.parentsList.findIndex(list => list.id === e.id)
      if (index !== -1) {
        this.parentsList[index].hasMainParent = value
      }
      const req = {
        childCode: e.studentCode,
        parentCode: e.parentCode
      }
      this.setParents(req).then(res => {
        this.$message.success('设置成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    async showStudentInfo() {
      const res = await this.queryStudentInfoById({
        userCode: this.userCode,
        schoolYearId: this.yearId
      })
      this.studentInfo = res.data
      this.childCode = res.data.userCode
      this.studentId = res.data.id
      this.showList()
    },
    async showList() {
      if (this.tabValue === '0') {
        const res = await this.getIntro({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.childCode,
          userType: '8'
        })
        if (!res.data || res.data.introduction === '') {
          this.introduction = ''
          this.photoList = []
          this.noDataTag = true
          return
        }
        this.introduction = res.data.introduction
        if (res.data.outUserStyleDtoList.length === 0) {
          return
        }
        this.photoList = res.data.outUserStyleDtoList.map(el => {
          return {
            url: el.photoUrl,
            id: el.id,
            photoDes: el.photoDes
          }
        })
      } else if (this.tabValue === '1') {
        const res = await this.getParents({ childCode: this.childCode })
        if (!res.data) return
        this.parentsList = res.data
        this.parentsList.map(ele => {
          ele.hasMainParent = ele.hasMainParent === '1'
        })
      } else if (this.tabValue === '2') {
        const { nativePlace, publicFace, nation, homeAddress } = this.studentInfo
        const msgArr = [nativePlace, this.$tools.getPoliticsStatus(publicFace), nation, homeAddress]
        this.studentMsg = this.studentMsg.map((item, index) => {
          return {
            ...item,
            text: msgArr[index]
          }
        })
      } else if (this.tabValue === '3') {
        const res = await this.getChangeList({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        })
        this.changeList = res.data
      } else if (this.tabValue === '4') {
        const res = await this.getDormChangeList({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        })
        this.dormList = res.data
      } else if (this.tabValue === '5') {
        const res = await this.getAwardList({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        })
        this.awardList = res.data
      } else if (this.tabValue === '6') {
        const res = await this.getPunishment({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        })
        this.punishmentList = res.data
      } else if (this.tabValue === '7') {
        const req = {
          page: 1,
          size: 500,
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        }
        const res = await this.getScoreShow(req)
        let planArr = res.data.list.map(item => item.planId)
        if (planArr.length > 0) {
          planArr = Array.from(new Set(planArr))
        }
        const scoreList = planArr.map(item => {
          return {
            planId: item,
            list: []
          }
        })
        for (let i = 0; i < scoreList.length; i++) {
          for (let j = 0; j < res.data.list.length; j++) {
            if (scoreList[i].planId === res.data.list[j].planId) {
              scoreList[i].list.push(res.data.list[j])
            }
          }
        }
        const list = scoreList.map(item => {
          let allScore = 0
          item.list.forEach(el => {
            allScore = allScore + el.score
          })
          return {
            ...item,
            ...item.list[0],
            allScore
          }
        })
        this.scoreList = list.map(item => {
          return {
            ...item,
            schoolYearName: this.getSchoolYearName(item.schoolYearId, this.schoolYearList)
          }
        })
      } else if (this.tabValue === '8') {
        const res = await this.getMorality({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        })
        this.moralityList = res.data
      }
    },
    getSchoolYearName(id, arr) {
      if (!id || arr.length === 0) {
        return id || ''
      }
      const list = arr.filter(item => {
        return id === item.id
      })
      if (list.length === 0) {
        return id || ''
      }
      return list[0].schoolYear || id || ''
    },
    parentChange(value) {
      this.selectedParent = value
    },
    save() {
      console.log(this.selectedParent)
    },
    addParent(type, item) {
      this.formData = formData
      this.formStatus = true
      if (type) {
        this.formTitle = '添加'
        this.addType = 1
        return
      }
      this.formData = this.$tools.fillForm(formData, item)
      this.formData[1].initValue = item.mobile
      this.formTitle = '编辑'
      this.addType = 2
      this.parentId = item.id
    },
    async _deleteParent(item) {
      await this.deleteParent({ Id: item.id })
      this.showList()
    },
    async submitForm(values) {
      const req = {
        ...values,
        id: this.parentId,
        schoolCode: this.userInfo.schoolCode,
        studentCode: this.childCode,
        studentId: this.studentId
      }
      if (this.addType === 1) {
        delete req.id
      }
      this.addType === 1 ? await this.addParents(req) : await this.editParent(req)
      this.formStatus = false
      this.showList()
      this.$refs.form.reset()
    },
    getStudentStatus(state) {
      return Tools.getStudentStatus(state)
    },
    // 获取年级列表
    async getSchoolYearList() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (res.data.list.length === 0) return
      this.schoolYearList = res.data.list.filter(item => {
        return item.semester === '下学期'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.student-detail {
  height: 100%;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  .tit {
    margin-bottom: 20px;
    p {
      border-left: 3px solid #6882da;
      padding-left: 10px;
      font-weight: bold;
      margin: 0 0 0 10px;
      line-height: 25px;
      height: 25px;
      font-size: 16px;
    }
  }
  .top {
    background: #fff;
    padding: 10px 20px;
    margin-bottom: 10px;
    .info {
      margin-bottom: 20px;
      flex-wrap: wrap;
      span {
        margin-right: 50px;
        padding: 10px 0;
      }
    }
    .phone {
      margin-bottom: 20px;
      img {
        width: 80px;
        height: 80px;
        margin-right: 20px;
        border-radius: 4px;
      }
    }
  }
  .center {
    flex: 1;
    display: flex;
    flex-direction: column;

    .table-tabs {
      flex: 1;
    }
  }
  .content {
    background: #fff;
    padding: 0 20px;
    .table {
      margin-bottom: 20px;
    }
  }
  .intro {
    .line {
      width: 2px;
      height: 14px;
    }
    .content {
      text-indent: 2em;
    }
    .photo-list {
      margin-bottom: 10px;
      border-radius: 4px;
      overflow: hidden;
      width: 240px;
      height: 200px;
      background-color: #fff;
      float: left;
      margin-right: 1.5%;
      position: relative;
      & > img {
        width: 240px;
        height: 180px;
        display: block;
      }
    }
  }

  .student-status {
    padding: 30px;
    box-sizing: border-box;

    .table-list {
      display: flex;
      flex-wrap: wrap;
      flex: 1;

      .msg-item {
        display: flex;
        width: 50%;
        border: 1px solid #ccc;

        .common {
          box-sizing: border-box;
          height: 40px;
          padding: 0 8px;
        }

        .name {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          width: 30%;
          background-color: rgba(242, 242, 242, 1);
        }
        .text {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 70%;
        }
      }
      .msg-item {
        border-top: 0;
        border-left: 0;
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
