<template>
  <div class="student-detail page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="detail.formData"
    ></submit-form>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="基本信息"> </a-tab-pane>
    </a-tabs>
    <div class="top">
      <div class="qui-fx-ver">
        <p class="info qui-fx">
          <span>姓名： {{ studentInfo.userName }}</span>
          <span>学号： {{ studentInfo.workNo }}</span>
          <span>性别： {{ studentInfo.sex | getSex() }}</span>
          <span>走住读： {{ studentInfo.hasDorm | getDorm() }}</span>
          <span>年级： {{ studentInfo.grade }}级</span>
          <span>专业： {{ studentInfo.subjectName }}</span>
          <span>班级： {{ studentInfo.className }}</span>
          <span>卡号： {{ studentInfo.cardNo }}</span>
          <span>备注： {{ studentInfo.remark }}</span>
        </p>
        <p class="phone qui-fx">
          <span class="qui-fx-ac">图片：</span>
          <a-popover placement="right">
            <template slot="content">
              <img
                :src="studentInfo.photoUrl || noImg"
                style="max-width: 200px; max-height: 220px; display: block"
                alt=""
              />
            </template>
            <img
              :src="studentInfo.photoUrl || noImg"
              style="max-width: 80px; max-height: 80px; display: block"
              alt=""
            />
          </a-popover>
        </p>
      </div>
    </div>
    <a-tabs default-active-key="1" @change="tabChange" v-model="tabValue">
      <a-tab-pane key="1" tab="学生家长">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <!-- <div class="top-btn-group" style="display: flex; justify-content: flex-end">
              <a-button
                style="margin-right: 20px"
                icon="plus"
                class="add-btn"
                @click="add(0)"
              >添加</a-button
              >
            </div> -->
            <table-list :columns="detail.columns" :table-list="parentsList">
              <template slot="customTitle">
                <span
                  title="默认该学生注册的第一个家长是主要家长，主要家长有权限管理其他家长"
                >主要家长 <a-icon
                  type="question-circle"
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
                    icon="form"
                    @click.stop="add('1', action.record)"
                  ></a-button>
                </a-tooltip>
                <a-popconfirm
                  placement="left"
                  okText="确定"
                  cancelText="取消"
                  @confirm="del(action.record)"
                  v-if="action.record.status !== '使用中'"
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
          <div class="content qui-fx-ver qui-fx-f1">
            <div class="table qui-fx-ver qui-fx-f1">
              <div class="teacher-status">
                <div class="table-list">
                  <div class="msg-item" v-for="item in detail.studentMsg" :key="item.id">
                    <div class="name common">{{ item.name }}</div>
                    <div class="text common">{{ item.text }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane> -->
      <a-tab-pane key="3" tab="学籍异动">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list :columns="detail.changeColumns" :table-list="changeList">
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
      <!-- <a-tab-pane key="4" tab="奖励">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list :columns="detail.jlColumns" :table-list="awardList"> </table-list>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="5" tab="处分">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list :columns="detail.cfColumns" :table-list="punishList"> </table-list>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="6" tab="成绩">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list :columns="detail.cjColumns" :table-list="scoreList">
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
      <a-tab-pane key="7" tab="品德评语">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list :columns="detail.pdColumns" :table-list="moralityList"> </table-list>
          </div>
        </div>
      </a-tab-pane> -->
      <a-tab-pane key="8" tab="调宿记录">
        <div class="content qui-fx-ver qui-fx-f1">
          <div class="table qui-fx-ver qui-fx-f1">
            <table-list :columns="detail.dormColumns" :table-list="dormList">
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
    </a-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SubmitForm from '@c/SubmitForm'
import TableList from '@c/TableList'
import { Switch } from 'ant-design-vue'
import NoData from '@c/NoData'
import detail from '../../assets/js/table/highStuDetail.js'
import noImg from '../../assets/img/no_img.png'

export default {
  name: 'Detail',
  components: {
    NoData,
    TableList,
    ASwitch: Switch,
    SubmitForm
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      noImg,
      detail,
      formStatus: false,
      changeTag: false,
      changeTitle: '变更',
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
      tabValue: '1',
      photoList: [],
      noDataTag: false,
      height: 0,
      studentId: '',
      awardList: [],
      punishList: [],
      scoreList: [],
      type: '',
      string: '',
      moralityList: [],
      title: '添加'
    }
  },
  mounted() {
    this.height = window.innerHeight - 460
    this.userCode = this.$route.query.userCode
    this.year = this.$route.query.year
    this.yearId = this.$route.query.yearId
    this.studentId = this.$route.query.id
    this.showStudentInfo()
  },
  methods: {
    ...mapActions('home', [
      'getHighStuDetail',
      'getChangeList',
      'getStuAward',
      'getStuMorality',
      'addStuParent',
      'getDormChangeList',
      'delStuParent',
      'getStuParent',
      'updateStuParent',
      'updateMainParent',
      'getStuPunish',
      'queryParents'
    ]),
    tabChange() {
      this.showList()
    },
    changeMain(value, e) {
      this.parentsList.map((ele) => {
        ele.hasMainParent = false
      })
      const index = this.parentsList.findIndex((list) => list.id === e.id)
      if (index !== -1) {
        this.parentsList[index].hasMainParent = value
      }
      const req = {
        childCode: e.studentCode,
        parentCode: e.parentCode
      }
      this.updateMainParent(req).then((res) => {
        this.$message.success('设置成功')
        this.$tools.goNext(() => {
          this._getStuParent()
        })
      })
    },
    async showStudentInfo() {
      const res = await this.getHighStuDetail({ id: this.studentId })
      this.studentInfo = res.data
      this.childCode = res.data.userCode
      // const otherInfo = res.data.otherInfo
      // this.detail.studentMsg = [
      //   {
      //     id: '1',
      //     name: '联系电话',
      //     text: otherInfo.mobile
      //   },
      //   {
      //     id: '2',
      //     name: '学生来源',
      //     text: otherInfo.studentSource
      //   },
      //   {
      //     id: '3',
      //     name: '招生对象',
      //     text: otherInfo.enrollmentTarget
      //   },
      //   {
      //     id: '4',
      //     name: '毕业学校',
      //     text: otherInfo.graduationSchool
      //   },
      //   {
      //     id: '5',
      //     name: '健康状况',
      //     text: otherInfo.healthyState
      //   },
      //   {
      //     id: '6',
      //     name: '籍贯',
      //     text: otherInfo.nativePlace
      //   },
      //   {
      //     id: '7',
      //     name: '民族',
      //     text: otherInfo.nationality
      //   },
      //   {
      //     id: '8',
      //     name: '政治面貌',
      //     text: otherInfo.politicalOutlook
      //   },
      //   {
      //     id: '9',
      //     name: '户口性质',
      //     text: otherInfo.registrationNature
      //   },
      //   {
      //     id: '10',
      //     name: '家长姓名',
      //     text: otherInfo.parentName
      //   },
      //   {
      //     id: '11',
      //     name: '户口所在地区县以下详细地址',
      //     text: otherInfo.registrationAddress
      //   },
      //   {
      //     id: '12',
      //     name: '家长手机号',
      //     text: otherInfo.parentMobile
      //   },
      //   {
      //     id: '13',
      //     name: '所属派出所',
      //     text: otherInfo.policeStation
      //   },
      //   {
      //     id: '14',
      //     name: '与本人关系',
      //     text: otherInfo.relationship
      //   },
      //   {
      //     id: '15',
      //     name: '学生居住地类型',
      //     text: otherInfo.residentialType
      //   },
      //   {
      //     id: '16',
      //     name: '是否是监护人',
      //     text: otherInfo.hasGuardian ? '是' : '否'
      //   },
      //   {
      //     id: '17',
      //     name: '家庭现住址',
      //     text: otherInfo.homeAddress
      //   }
      // ]
      this.showList()
    },
    async showList() {
      if (this.tabValue === '1') {
        // 学生家长
        this._getStuParent()
      } else if (this.tabValue === '3') {
        // 学籍异动
        const res = await this.getChangeList({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        })
        this.changeList = res.data
      } else if (this.tabValue === '4') {
        // 奖励
        const res = await this.getStuAward({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        })
        this.awardList = res.data
      } else if (this.tabValue === '5') {
        // 处分
        const res = await this.getStuPunish({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        })
        this.punishList = res.data
      } else if (this.tabValue === '6') {
        // 高教版暂时没有接口
        if (true) {
          return
        }
        const req = {
          page: 1,
          size: 500,
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        }
        const res = await this.getScoreShow(req)
        let planArr = res.data.list.map((item) => item.planId)
        if (planArr.length > 0) {
          planArr = Array.from(new Set(planArr))
        }
        const scoreList = planArr.map((item) => {
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
        const list = scoreList.map((item) => {
          let allScore = 0
          item.list.forEach((el) => {
            allScore = allScore + el.score
          })
          return {
            ...item,
            ...item.list[0],
            allScore
          }
        })
        this.scoreList = list.map((item) => {
          return {
            ...item,
            schoolYearName: this.getSchoolYearName(item.schoolYearId, this.schoolYearList)
          }
        })
      } else if (this.tabValue === '7') {
        // 品德评语
        const res = await this.getStuMorality({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        })
        this.moralityList = res.data
      } else if (this.tabValue === '8') {
        // 调宿记录
        const res = await this.getDormChangeList({
          schoolCode: this.userInfo.schoolCode,
          userCode: this.userCode
        })
        this.dormList = res.data
      }
    },
    // 获取家长信息
    async _getStuParent() {
      // const res = await this.getStuParent({ childCode: this.childCode })
      const res = await this.queryParents({ childCode: this.childCode })
      this.parentsList = res.data
      this.parentsList.map((ele) => {
        ele.hasMainParent = ele.hasMainParent === '1'
      })
    },
    add(type, record) {
      if (type) {
        this.listId = record.id
        record.parentPhone = record.mobile
        this.detail.formData = this.$tools.fillForm(detail.formData, record)
        this.title = '编辑'
      } else {
        this.title = '添加'
        this.detail.formData = this.$tools.fillForm(detail.formData, {})
      }
      this.formStatus = true
    },
    async submitForm(values) {
      const req = {
        ...values,
        schoolCode: this.userInfo.schoolCode,
        studentCode: this.userCode,
        studentId: this.studentId
      }
      if (this.title === '编辑') {
        req.id = this.listId
      }
      const res =
        this.title === '编辑' ? await this.updateStuParent(req) : await this.addStuParent(req)
      if (res && res.code === 200) {
        this.formStatus = false
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this._getStuParent()
          this.$refs.form.reset()
        })
      }
    },
    // 删除家长
    async del(record) {
      await this.delStuParent({ Id: record.id })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this._getStuParent()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.student-detail {
  height: 100%;
  padding-top: 10px;
  .top {
    background: #fff;
    padding: 10px 20px;
    margin-bottom: 10px;
    .info {
      margin-bottom: 20px;
      flex-wrap: wrap;
      span {
        width: 200px;
        margin-right: 10px;
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
  .content {
    background: #fff;
    padding: 0 20px;
    .table {
      margin-bottom: 20px;
    }
  }
}
.teacher-status {
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
</style>
