<template>
  <div class="page-layout qui-fx-ver">
    <div class="bg-fff padd-l10 padd-r10" style="height: 210px">
      <detail-show :detail-info="detailInfo" :title="infoTitle"></detail-show>
    </div>
    <div class="title">
      <span class="tip"></span>
      <span>参数设置</span>
    </div>
    <div class="form-box qui-fx-f1 mar-t10 bg-fff padd-l10 padd-r10">
      <a-form :form="form">
        <a-form-item label="设备名称" v-bind="formItemLayout">
          <a-input v-decorator="['deviceName', { initialValue: deviceInfo.deviceName }]" disabled />
        </a-form-item>
        <a-form-item label="管理密码" v-bind="formItemLayout">
          <a-input
            type="number"
            v-decorator="[
              'password',
              {
                initialValue: deviceInfo.password,
                rules: [{ required: true, message: '请输入管理密码,限6位长度数字', max: 6, min: 6 }]
              }
            ]"
            placeholder="请输入管理密码,限6位长度数字"
          />
        </a-form-item>
        <a-form-item label="所属档口" v-bind="formItemLayout">
          <a-select
            @change="changeType"
            v-decorator="[
              'windowName',
              { initialValue: deviceInfo.windowName, rules: [{ required: true, message: '请选择所属档口' }] }
            ]"
            placeholder="请选择所属档口"
          >
            <a-select-option :value="item.windowName" v-for="item in stallList" :key="item.id">{{
              item.windowName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="消费模式" v-bind="formItemLayout" required>
          <a-select
            @change="changeType"
            :disabled="deviceId !== ''"
            v-decorator="[
              'consumerModel',
              { initialValue: deviceInfo.consumerModel, rules: [{ required: true, message: '请选择消费模式' }] }
            ]"
            placeholder="请选择消费模式"
          >
            <a-select-option value="1">定额模式</a-select-option>
            <a-select-option value="2">自由模式</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 15, offset: 3 }">
          <a-button style="margin-right: 50px" @click="cancle">取消</a-button>
          <a-button type="primary" @click="handleSubmit">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import DetailShow from '@c/DetailShow'
export default {
  name: 'SetMachine',
  components: {
    NoData,
    DetailShow
  },
  data() {
    return {
      form: this.$form.createForm(this),
      title: '',
      detailInfo: [],
      infoTitle: '基本信息',
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      deviceId: '',
      deviceInfo: {},
      stallList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.deviceId = this.$route.query.id
    this.showStall()
  },
  methods: {
    ...mapActions('home', ['addConsume', 'getDetailMachine', 'editMachine', 'getStallList', 'getDictList']),
    async consumeDetailGet() {
      const res = await this.getDetailMachine(this.deviceId)
      this.deviceInfo = res.data
      this._getDictList()
      this.deviceInfo.windowName = this.stallList.filter((ele) => {
        return ele.id === this.deviceInfo.windowId
      })[0].windowName
      console.log(this.deviceInfo.windowName)
    },
    async _getDictList() {
      const res = await this.getDictList({
        pageNum: 1,
        pageSize: 100,
        dictType: 'machine_type'
      })
      const index = res.rows.findIndex((list) => list.dictValue === this.deviceInfo.deviceType)
      if (index !== -1) {
        this.deviceInfo.deviceTypeName = res.rows[index].dictLabel
      }
      this.showMachine()
    },
    async showStall() {
      const req = {
        pageNum: 1,
        pageSize: 9999
      }
      const res = await this.getStallList(req)
      this.stallList = res.rows
      this.consumeDetailGet()
    },
    async showMachine() {
      this.detailInfo = [
        {
          key: '设备类型',
          val: this.deviceInfo.deviceTypeName
        },
        {
          key: '绑定机构',
          val: this.userInfo.schoolName
        },
        {
          key: '网络状态',
          val: this.deviceInfo.status === '2' ? '离线' : '在线'
        },
        {
          key: '序列号',
          val: this.deviceInfo.sn
        },
        {
          key: '固件版本',
          val: this.deviceInfo.firmwareVersion
        },
        {
          key: 'MAC地址',
          val: this.deviceInfo.macAddress
        },
        {
          key: '软件版本',
          val: this.deviceInfo.softVersion
        },
        {
          key: 'IP地址',
          val: this.deviceInfo.ipAddress
        }
      ]
    },
    cancle() {
      const path = '/consumerMachine'
      this.$router.push({ path })
    },
    changeType(val) {
      this.deviceInfo.patternType = val
      this.patternType = val
    },
    // 提交权限组
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.editMachine({
            ...values,
            id: this.deviceId,
            windowId: this.stallList.filter((el) => {
              return el.windowName === values.windowName
            })[0].id
          }).then((res) => {
            this.$message.success('设置成功')
            const path = '/consumerMachine'
            this.$tools.goNext(() => {
              this.$router.push({ path })
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.form-box {
  max-height: calc(100vh - 350px);
  overflow: scroll;
}
.action {
  margin: 5px 0;
}
img {
  width: 24px;
  height: 24px;
  margin: 0 10px;
  cursor: pointer;
}
span {
  margin: 0 5px;
}
.title {
  margin: 20px;
  height: 30px;
  border-bottom: 1px solid #ccc;
  .tip {
    display: inline-block;
    width: 5px;
    height: 18px;
    // margin-top: 8px;
    background-color: #6882da;
  }
}
</style>
