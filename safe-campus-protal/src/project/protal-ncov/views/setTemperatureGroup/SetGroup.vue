<template>
  <div class="set-group page-layout qui-fx-ver">
    <down-record v-if="recordTag" :device-sn="bussCode" buss-code="yqfk" v-model="recordTag"></down-record>
    <a-form :form="form" :style="{ maxHeight: maxHeight }">
      <a-form-item label="测温组名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
        <a-input
          placeholder="请输入测温组名称"
          :maxLength="15"
          v-decorator="['name', { initialValue: groupName, rules: [{ required: true, message: '请输入测温组名称' }] }]"
        />
      </a-form-item>
      <a-form-item
        label="测温设备"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 15 }"
        :required="true"
      >
        <device-list
          :table-list="groupList"
          :columns="columns"
          :page-list="pageList"
          :chooseType="chooseType"
          :bind-code="groupId"
          :schoolCode="userInfo.schoolCode"
          @groupList="addGroup"
          @delGroup="delGroup"
          @getRecordList="getRecordList"
          @showData="showData"
        ></device-list>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 15, offset: 3 }">
        <a-button style="margin-right:50px;" @click="cancle">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
import DownRecord from '@c/DownRecord'
import DeleteTag from '@c/DeleteTag'
import { mapState, mapActions } from 'vuex'
import DeviceList from '@c/DeviceList'
import deleImg from '../../assets/img/dele.png'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    },
    align: 'center'
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '30%',
    align: 'center'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '20%',
    align: 'center'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : '面板机'
    },
    align: 'center'
  },
  {
    title: '下发记录',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

export default {
  name: 'SetGroup',
  components: {
    DeleteTag,
    DeviceList,
    DownRecord
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      loading: false,
      bussCode: '',
      recordTag: false,
      columns,
      moment,
      maxHeight: 0,
      deleImg,
      dateData: [],
      formLayout: 'horizontal',
      pageList: {
        page: 1,
        size: 9999
      },
      form: this.$form.createForm(this),
      groupList: [],
      groupId: '',
      detailData: null,
      groupName: '',
      chooseType: '',
      bindObj: {}
    }
  },
  async created() {
    this.chooseType = 'ncov'
    this.groupId = this.$route.query.id ? this.$route.query.id.toString() : ''
  },
  methods: {
    ...mapActions('home', ['addAccess', 'getAccessDetail', 'updateAccess']),
    // 下发记录
    getRecordList(item) {
      this.recordTag = true
      this.bussCode = item.deviceSn
    },
    // 表单回填
    showData(value) {
      if (!value) return
      this.detailData = value
      this.groupName = value.groupName
      this.groupList = value.controllerGroups
    },
    // 提交权限组
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          console.log(this.groupList)
          if (this.groupList.length === 0) {
            this.$message.warning('请添加测温设备')
            return
          }
          const controllerGroups = []
          this.groupList.forEach(ele => {
            controllerGroups.push({
              deviceIp: ele.deviceIp,
              deviceName: ele.deviceName,
              deviceSn: ele.deviceSn,
              deviceStatus: ele.deviceStatus,
              deviceType: ele.deviceType,
              snapSite: ele.snapSite
            })
          })
          const req = {
            controllerGroups,
            groupName: values.name,
            schoolCode: this.userInfo.schoolCode,
            type: this.$route.query.type === 'teacher' ? 4 : 8
          }
          this.loading = true
          const path = this.$route.query.type === 'teacher' ? '/teacherTemperatureSet' : '/studentTemperatureSet'
          if (this.groupId) {
            req.id = this.groupId
            this.updateAccess(req)
              .then(res => {
                this.$message.success('编辑成功')
                this.$tools.goNext(() => {
                  this.loading = false
                  this.$router.push({ path })
                })
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.addAccess(req)
              .then(res => {
                this.$message.success('添加成功')
                this.$tools.goNext(() => {
                  this.loading = false
                  this.$router.push({ path })
                })
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    // 删除设备
    delGroup(value) {
      const index = this.groupList.findIndex(list => list.deviceSn === value.deviceSn)
      if (index !== -1) {
        this.groupList.splice(index, 1)
      }
    },
    // 添加测温设备
    addGroup(value) {
      this.groupList = value
    },
    cancle() {
      const path = this.$route.query.type === 'teacher' ? '/teacherTemperatureSet' : '/studentTemperatureSet'
      this.$router.push({ path })
    }
  }
}
</script>

<style lang="less" scoped>
.set-group {
  background: #fff;
  padding-top: 20px;
  overflow: auto;
  .action {
    margin: 5px 0;
    span {
      margin: 0 5px;
    }
    .right {
      img {
        width: 24px;
        height: 24px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
  .control-list {
    display: inline-block;
    margin: 0 10px 10px 0;
    line-height: 25px;
  }
}
</style>
