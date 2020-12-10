<template>
  <div class="home page-layout qui-fx-ver">
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
        <div class="title">班级报到信息</div>
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
import Tools from '@u/tools'
export default {
  name: 'StudentDetails',
  components: {
    SubmitForm,
    UploadMulti
  },
  data() {
    return {
      photoUrl: '',
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
          name: '专业',
          text: ''
        },
        {
          id: '2',
          name: '班级',
          text: ''
        },
        {
          id: '3',
          name: '报到状态',
          text: ''
        },
        {
          id: '4',
          name: '报到方式',
          text: ''
        },
        {
          id: '5',
          name: '报到时间',
          text: ''
        },
        {
          id: '6',
          name: '确认人',
          text: ''
        }
      ]
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    const id = this.$route.query.id
    this.showList(id)
  },
  methods: {
    ...mapActions('home', ['getStuDetails']),
    async showList(id) {
      const res = await this.getStuDetails(id)
      if (res && res.code === 200) {
        const {
          photoUrl,
          studentSource,
          state,
          gender,
          politicalOutlook,
          idNumber,
          nationality,
          grade,
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
          finalMajorName,
          className,
          hasCheckIn,
          checkInWay,
          checkInTime,
          confirmer
        } = res.data
        this.photoUrl = photoUrl
        const baseListOne = [
          studentSource,
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
        const baseListTwo = [
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
        const baseListThree = [intentionDegree, remark]
        const checkInfo = [
          finalMajorName,
          className,
          hasCheckIn ? '已报到' : '未报到',
          checkInWay,
          checkInTime ? Tools.getDate(checkInTime) : '',
          confirmer
        ]
        this.baseListOne = this.baseListOne.map((item, index) => {
          return {
            ...item,
            text: baseListOne[index]
          }
        })
        this.baseListTwo = this.baseListTwo.map((item, index) => {
          return {
            ...item,
            text: baseListTwo[index]
          }
        })
        this.baseListThree = this.baseListThree.map((item, index) => {
          return {
            ...item,
            text: baseListThree[index]
          }
        })
        this.checkInfo = this.checkInfo.map((item, index) => {
          return {
            ...item,
            text: checkInfo[index]
          }
        })
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
