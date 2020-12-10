<template>
  <div class="school-add page-layout bg-fff qui-fx-ver">
    <a-form :form="form">
      <a-form-item label="牌照：" v-bind="formItemLayout">
        <a-input
          v-decorator="[
            'licensePlate',
            {
              initialValue: appForm.licensePlate,
              rules: [{ required: true, message: '请填写牌照' }]
            }
          ]"
          placeholder="请填写牌照"
        />
      </a-form-item>
      <a-form-item label="车型：" v-bind="formItemLayout">
        <a-input
          v-decorator="[
            'type',
            {
              initialValue: appForm.type,
              rules: [{ required: true, message: '请填写车型' }]
            }
          ]"
          placeholder="请填写车型"
        />
      </a-form-item>
      <a-form-item label="核载人数：" v-bind="formItemLayout">
        <a-input-number
          style="width: 100%"
          :min="1"
          :max="99999"
          v-decorator="[
            'num',
            {
              initialValue: appForm.num,
              rules: [{ required: true, message: '请填写核载人数' }]
            }
          ]"
          placeholder="请填写核载人数"
        />
      </a-form-item>
      <a-form-item label="车辆运营班次：" v-bind="formItemLayout" required>
        <div class="qui-fx">
          <div class="qui-fx-f1">
            <div class="project-box">
              <div class="qui-fx-ac">
                <a-button icon="plus" class="add-btn mar-b10" size="small" @click="add">添加</a-button>
              </div>
              <div v-for="(item,index) in normalList" :key="item.key">
                <div class="qui-fx">
                  <a-select style="width:20%;margin-right:10px;" v-model="normalList[index].weekDate" placeholder="请选择星期">
                    <a-select-option v-for="week in weekDays" :key="week.key">{{ week.value }}</a-select-option>
                  </a-select>
                  上午：
                  <a-time-picker style="margin: 0 10px;" v-model="normalList[index].startTime"/>
                  下午：
                  <a-time-picker style="margin: 0 10px;" v-model="normalList[index].endTime"/>
                  <div class="del-index mar-l10" @click="del(item)">删除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="车辆运营证上传：" v-bind="formItemLayout" required>
        <upload-multi :length="1" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center' }">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UploadMulti from '@c/UploadMulti'
import moment from 'moment'
export default {
  name: 'SchoolAdd',
  components: {
    UploadMulti
  },
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      isLoad: false,
      visible: false,
      form: this.$form.createForm(this),
      appForm: {},
      normalList: [],
      count: 0,
      checkList: [],
      weekDays: [
        {
          key: 2,
          value: '星期一'
        },
        {
          key: 3,
          value: '星期二'
        },
        {
          key: 4,
          value: '星期三'
        },
        {
          key: 5,
          value: '星期四'
        },
        {
          key: 6,
          value: '星期五'
        },
        {
          key: 7,
          value: '星期六'
        },
        {
          key: 1,
          value: '星期日'
        }
      ],
      deviceCode: '',
      detailId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.deviceCode = this.$route.query.code
    this.detailId = this.$route.query.id
    if (this.detailId) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', ['addSchoolArchive', 'getSchoolDetail', 'getSchoolFlights', 'updateSchoolArchive']),
    moment,
    async showDetail() {
      const res = await this.getSchoolDetail(this.detailId)
      const result = await this.getSchoolFlights({ query: this.deviceCode })
      this.appForm = res.data
      this.normalList = result.data.map((el, index) => {
        return {
          ...el,
          key: index,
          startTime: moment(new Date(el.startTime), 'HH:mm:ss'),
          endTime: moment(new Date(el.endTime), 'HH:mm:ss')
        }
      })
      this.fileList = [{ url: res.data.cardUrl }]
      this.count = result.data.length
    },
    // 添加
    add() {
      const { count, normalList } = this
      const newData = {
        key: count
      }
      this.normalList = [...normalList, newData]
      this.count = count + 1
    },
    // 删除
    del(list) {
      this.normalList = this.normalList.filter(i => i !== list)
    },
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (this.fileList.length === 0) {
          this.$message.warning('请上传图片')
          return
        }
        const isList = this.normalList.map(el => !el.weekDate || !el.endTime || !el.startTime || el.startTime >= el.endTime ? '1' : '-1')
        if (this.normalList.length === 0 || isList.indexOf('1') > -1) {
          this.$message.warning('请完善车辆运营班次')
          return
        }
        this.isLoad = false
        if (!error) {
          values.schoolCode = this.userInfo.schoolCode
          values.cardUrl = this.fileList[0].url
          values.flights = this.normalList.map(el => {
            return {
              weekDate: el.weekDate,
              startTime: moment(el.startTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: moment(el.endTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
          this.isLoad = true
          if (!this.detailId) {
            this.addSchoolArchive(values)
              .then(res => {
                this.visible = false
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          } else {
            values.id = this.detailId
            this.updateSchoolArchive(values)
              .then(res => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.school-add {
  padding: 20px;
  .project-box {
    max-height: 400px;
    overflow-y: scroll;
    padding-top: 10px;
    .del-index {
      color: @tip-color;
      cursor: pointer;
    }
  }
  .ant-calendar-picker {
    width: 100% !important;
  }
  .ant-checkbox-group {
    width: 100%;
  }
}
</style>
