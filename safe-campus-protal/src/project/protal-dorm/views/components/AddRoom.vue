<template>
  <div class="add-room">
    <a-modal title="添加房间" :visible="addRoomVisible" :footer="null" @cancel="addRoomCancel">
      <a-form :form="addRoomForm" @submit="addRoomHandle">
        <a-form-item label="房间名称前缀" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="[ 'roomPrefix']" />
        </a-form-item>
        <a-form-item label="创建房间数量" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input-number
            :min="1"
            :max="20"
            v-decorator="[
              'roomNum',
              {rules: [{ required: true, message: '请填写楼层房间数量' }]}
            ]"
          />
        </a-form-item>
        <a-form-item label="每个房间床位数量" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input-number
            :min="1"
            :max="20"
            v-decorator="[
              'bedNum',
              {rules: [{ required: true, message: '请填写每个房间床位数量' }]}
            ]"
          />
        </a-form-item>
        <a-form-item style="margin-top:24px">
          <div :style="{ textAlign: 'right' }">
            <a-button @click="addRoomCancel" style="margin-right:10px">取消</a-button>
            <a-button
              type="primary"
              html-type="submit"
              :loading="state.loginBtn"
              :disabled="state.loginBtn"
            >确定</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      addRoomForm: this.$form.createForm(this),
      addRoomVisible: false,
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  props: {
    floorCode: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions('roomManage', ['addRoomSubmit']),
    addRoomCancel() {
      this.addRoomVisible = false
    },
    addRoomClick(buildList) {
      if (buildList.buildList.length === 0) {
        this.$message.warning('请先创建楼栋')
      } else {
        this.addRoomForm.resetFields()
        this.addRoomVisible = true
      }
    },
    addRoomHandle(e) {
      e.preventDefault()
      this.state.loginBtn = true
      this.addRoomForm.validateFields((err, value) => {
        if (!err) {
          value.schoolCode = sessionStorage.getItem('schoolScheme')
          value.categoryCode = this.floorCode
          value.categoryType = '3'
          value.roomPrefix = value.roomPrefix ? value.roomPrefix : ''
          this.addRoomSubmit(value)
            .then(res => {
              this.$message.success('添加成功')
              this.state.loginBtn = false
              this.addRoomVisible = false
              this.$tools.goNext(() => {
                this.$emit('get-room', this.floorCode)
              })
            })
            .catch(() => {
              this.$tools.goNext(() => {
                this.state.loginBtn = false
              })
            })
        } else {
          this.$tools.goNext(() => {
            this.state.loginBtn = false
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.ant-input-number {
  width: 100%;
}
</style>
