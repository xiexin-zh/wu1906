<template>
  <div class="edit-room">
    <a-modal title="修改房间" :visible="editRoomVisible" @cancel="editRoomCancel" :footer="null">
      <a-form :form="editRoomForm">
        <a-form-item label="房间名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="[
              'roomName',
              {rules: [{ required: true, message: 'Please input your note!' }]}
            ]"
          />
        </a-form-item>
        <a-form-item label="房间床位数量" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input-number
            :min="1"
            :max="20"
            v-decorator="[
              'specifications',
              {rules: [{ required: true, message: 'Please input your note!' }]}
            ]"
          />
        </a-form-item>
        <a-form-item style="margin-top:24px">
          <div :style="{ textAlign: 'right' }">
            <a-button @click="editRoomCancel" style="margin-right:10px">取消</a-button>
            <a-button
              type="primary"
              html-type="submit"
              :loading="state.loginBtn"
              :disabled="state.loginBtn"
              @click="editRoomHandle"
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
      editRoomForm: this.$form.createForm(this),
      editRoomVisible: false,
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
    ...mapActions('roomManage', ['editBuild']),
    // 房间编辑
    editRoomClick(name, code, specifications, id) {
      this.editRoomVisible = true
      this.$nextTick(() => {
        this.editRoomForm.setFieldsValue({
          roomName: name,
          specifications: specifications
        })
      })
      this.roomId = id
    },
    editRoomHandle() {
      this.state.loginBtn = true
      this.editRoomForm.validateFields((err, values) => {
        if (!err) {
          const req = {
            schoolCode: sessionStorage.getItem('schoolScheme'),
            id: this.roomId,
            categoryType: '4',
            categoryName: values.roomName,
            specifications: values.specifications
          }
          this.editBuild(req)
            .then(res => {
              this.state.loginBtn = false
              this.$message.success('修改成功')
              this.editRoomVisible = false
              this.$tools.goNext(() => {
                this.$emit('get-room', this.floorCode)
              })
            })
            .catch(err => {
              setTimeout(() => {
                this.state.loginBtn = false
              }, 600)
              this.$message.error(err.message)
            })
        } else {
          setTimeout(() => {
            this.state.loginBtn = false
          }, 600)
        }
      })
    },
    editRoomCancel() {
      this.editRoomVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.ant-input-number {
  width: 100%;
}
</style>
