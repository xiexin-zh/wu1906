<template>
  <a-modal
    :title="title"
    v-model="addVisible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="940px"
    @ok="addSubmit"
    :okButtonProps="{ props: { disabled: isLoad } }"
    :cancel-button-props="{ props: { disabled: isView } }"
  >
    <a-form :form="form">
      <a-form-item label="看板名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-input
          maxlength="10"
          v-decorator="[
            'name',
            {
              initialValue: appForm.name,
              rules: [{ required: true, message: '请填写看板名称' }]
            }
          ]"
          placeholder="请填写看板名称"
        />
      </a-form-item>
      <a-form-item label="选择设备" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" required>
        <div>
          <template v-for="tag in groupList">
            <a-tag color="blue" :key="tag.id">{{ tag.deviceName }}</a-tag>
          </template>
          <a-tag @click="addTag()" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus" />绑定设备
          </a-tag>
        </div>
      </a-form-item>
    </a-form>
    <choose-control
      ref="chooseUser"
      is-check
      v-show="userTag"
      v-model="userTag"
      :chooseType="chooseType"
      :schoolCode="userInfo.schoolCode"
      @submit="chooseUser"
      title="添加设备"
      :groupList="groupList"
    ></choose-control>
  </a-modal>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import ChooseControl from '@c/ChooseControl'
export default {
  name: 'AddView',
  components: {
    ChooseControl
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userTag: false,
      groupList: [],
      pageList: {
        page: 1,
        size: 20
      },

      isLoad: false,
      addVisible: false,
      form: this.$form.createForm(this),
      appForm: {
        name: '',
        id: ''
      },
      isView: false,
      labelList: [],
      value: [],
      getList: [],
      chooseType: 'visitorGroup'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['addBoard']),
    chooseUser(value) {
      this.userTag = false
      this.groupList = []
      this.$refs.chooseUser.reset()
      value.forEach(ele => {
        this.groupList.push({
          deviceIp: ele.deviceIp,
          deviceName: ele.deviceName,
          deviceSn: ele.deviceSn,
          deviceType: ele.deviceType,
          inOrOut: ele.inOrOut,
          snapSite: ele.snapSite,
          id: ele.id
        })
      })
    },
    addTag() {
      this.userTag = true
    },
    addSubmit(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          if (this.groupList.length === 0) {
            this.$message.warning('请选择绑定设备!')
            return
          }
          this.isLoad = true
          const req = {
            boradName: values.name,
            deviceSns: this.groupList.map(ele => {
              return ele.deviceSn
            }),
            schoolCode: this.userInfo.schoolCode,
            schoolName: this.userInfo.schoolName,
            id: '' ? undefined : this.appForm.id
          }
          this.addBoard(req)
            .then(res => {
              this.addVisible = false
              this.isLoad = false
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.$emit('update')
              })
            })
            .catch(res => {
              this.isLoad = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
