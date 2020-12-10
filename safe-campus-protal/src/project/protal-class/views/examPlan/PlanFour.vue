<template>
  <div class="plan-four qui-fx-f1">
    <choose-user
      is-check
      ref="chooseForm"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseTeacher"
      title="添加监考老师"
    ></choose-user>
    <div class="qui-fx-jsb" v-if="!isDetail">
      <div class="qui-fx-ac">
        导入参加考试的学生：
        <a-upload
          class="qui-fx qui-fx-ac"
          :multiple="false"
          name="multipartFile"
          :fileList="fileList"
          :withCredentials="true"
          :customRequest="customRequest"
          :beforeUpload="beforeUpload"
        >
          <a-button style="margin-right:20px" type="primary"> <a-icon type="upload" />导入模板 </a-button>
        </a-upload>
        <a-button @click="downFile" type="dashed">示例模板下载</a-button>
      </div>
      <div style="color: #6882da">温馨提示：考场信息和时间将于开考前24小时在设备上进行展示</div>
    </div>
    <div
      class="pos-box qui-fx"
      style="padding-bottom: 45px; padding-right: 20px; padding-top: 20px; overflow-y: scroll"
    >
      <ul class="plan-left">
        <li class="tips qui-fx-ac-jc">场地\科目</li>
        <li v-for="(place, index) in placeList" :key="index">
          <div>
            <span class="tips mar-r10">{{ place.placeName }}</span>
          </div>
          <div>{{ place.testRoomName }}</div>
          <div>考号范围：{{ place.startNumber }}~{{ place.endNumber }}</div>
        </li>
      </ul>
      <div class="qui-fx-f1 qui-fx">
        <ul class="qui-fx-f1" v-for="(view, index) in viewList" :key="index">
          <li class="qui-fx-ac-jc">
            <div class="tips">{{ view.subjectName }}</div>
            <div>
              <span class="mar-r10">{{ $tools.getDate(view.testDate, 1) }}</span>
              {{ $tools.getDate(view.startTime, 4) }}~{{ $tools.getDate(view.endTime, 4) }}
            </div>
          </li>
          <li
            v-html="showTeacher(view.id, place.id)"
            @click="addTeacher(view.id, place, showTeacher(view.id, place.id))"
            style="cursor:pointer"
            v-for="(place, ind) in placeList"
            :key="ind"
            class="qui-fx-ac-jc"
          >
            <!-- <span
              v-if="isShow(view.id, place, ind)"
              style="font-size: 30px"
            >√</span>-->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import hostEnv from '@config/host-env'
import { mapActions, mapState } from 'vuex'
import ChooseUser from '@c/ChooseUser'
export default {
  name: 'PlanFour',
  props: {
    isDetail: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: ''
    }
  },
  components: { ChooseUser },
  data() {
    return {
      fileList: [],
      userTag: false,
      viewList: [],
      placeList: [],
      mapList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showDetail()
  },
  methods: {
    ...mapActions('home', ['getPlanView', 'setTestTeacher']),
    beforeUpload(file) {
      const isEle =
        file.name.indexOf('xlsx') > -1 ||
        file.name.indexOf('xls') > -1 ||
        file.name.indexOf('XLSX') > -1 ||
        file.name.indexOf('XLS') > -1
      if (!isEle) {
        this.$message.error('请上传格式为xls或xlsx的文件')
      }
      return isEle
    },
    customRequest(data) {
      this.resList = []
      const formData = new FormData()
      formData.append('fileList', data.file)
      formData.append('planId', this.id)
      formData.append('schoolCode', this.userInfo.schoolCode)
      this.saveFile(formData)
    },
    saveFile(formData) {
      const params = {}
      axios({
        method: 'post',
        url: `${hostEnv.protal_api_11013}/test/excel/importStudentExcel`,
        data: formData,
        params
      })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success(`导入成功`)
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    downFile() {
      window.location.href = `${
        hostEnv.protal_api_11013
      }/test/excel/exportTestStudent?gradeCode=${window.sessionStorage.getItem('gradeCode')}&schoolCode=${
        this.userInfo.schoolCode
      }`
    },
    addTeacher(a, b, c) {
      if (this.isDetail) return
      if (!c) {
        return
      }
      this.testId = a
      this.planRoomId = b.id
      this.userTag = true
    },
    async chooseTeacher(item) {
      const params = item.map(item => {
        return {
          testId: this.testId,
          planRoomId: this.planRoomId,
          userCode: item.userCode,
          userName: item.userName
        }
      })
      try {
        await this.setTestTeacher(params)
        this.$message.success('添加成功')
        this.$refs.chooseForm.reset()
        this.$tools.goNext(() => {
          this.showDetail()
        })
      } catch (err) {
        this.$message.success('添加失败')
        this.$refs.chooseForm.error()
      }
    },
    async showDetail() {
      const res = await this.getPlanView(this.id)
      this.viewList = res.data.testInfoDtoList
      this.mapList = res.data.map
      this.placeList = res.data.roomDtoList
    },
    showTeacher(tId, pId) {
      const arr = this.mapList.filter(item => {
        return item.testId === tId && item.plan_room_id === pId
      })
      return arr.length > 0 ? '<span style="color:#6882da">' + (arr[0].user_name || '分配监考老师') + '</span>' : ''
    },
    isShow(id, place, index) {
      const testTag = this.mapList.filter(item => item.testId === id)
      if (testTag.length === 0) return false
      return testTag[0].planRoomId.indexOf(this.placeList[index].id) > -1
    }
  }
}
</script>

<style lang="less" scoped>
.plan-four {
  padding: 0 15px;
  .plan-left {
    min-width: 220px;
  }
  .tips {
    font-weight: bold;
    font-size: 14px;
    color: #333;
  }
  li {
    text-align: center;
    height: 70px;
    border: 1px #f5f5f5 solid;
  }
}
</style>
