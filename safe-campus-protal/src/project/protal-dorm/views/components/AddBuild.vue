<template>
  <div class="add-build">
    <a-modal title="添加楼栋" :visible="addBuildVisible" :footer="null" @cancel="addBuildCancel">
      <!--
      @ok="addBuildHandle"-->
      <a-form :form="addBuildForm" @submit="addBuildHandle">
        <a-form-item label="宿舍楼栋名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="[
              'buildingName',
              {rules: [{ required: true, message: '请输入宿舍楼栋名称' }]}
            ]"
          />
        </a-form-item>
        <a-form-item label="宿舍楼层数量" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input-number
            :min="1"
            :max="20"
            v-decorator="[
              'floorNum',
              {rules: [{ required: true, message: '请输入宿舍楼层数量' }]}
            ]"
          />
        </a-form-item>
        <a-form-item label="楼层房间数量" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input-number
            :min="1"
            :max="12"
            v-decorator="[
              'roomNum',
              {rules: [{ required: true, message: '请输入房间数量' }]}
            ]"
          />
        </a-form-item>
        <a-form-item label="房间床位数量" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input-number
            :min="1"
            :max="20"
            v-decorator="[
              'bedNum',
              {rules: [{ required: true, message: '请输入房间床位数' }]}
            ]"
          />
        </a-form-item>
        <a-form-item label="房间前缀" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['roomPrefix']" />
        </a-form-item>
        <a-form-item style="margin-top:24px">
          <div :style="{ textAlign: 'right' }">
            <a-button @click="addBuildCancel" style="margin-right:10px">取消</a-button>
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
      addBuildForm: this.$form.createForm(this),
      addBuildVisible: false,
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  props: {
    refBuildList: {
      type: Object,
      default: function() {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions('roomManage', ['addBuildSubmit']),
    // 添加楼栋
    addBuild() {
      this.addBuildVisible = true
      this.addBuildForm.resetFields()
    },
    addBuildCancel() {
      this.addBuildVisible = false
    },
    addBuildHandle(e) {
      e.preventDefault()
      this.state.loginBtn = true
      this.addBuildForm.validateFields((err, value) => {
        if (!err) {
          value.roomPrefix = value.roomPrefix ? value.roomPrefix : ''
          value.schoolCode = sessionStorage.getItem('schoolScheme')
          this.addBuildSubmit(value)
            .then(res => {
              this.$message.success('添加成功')
              this.state.loginBtn = false
              this.addBuildVisible = false
              setTimeout(() => {
                this.refBuildList.getBuildList()
              }, 1000)
            })
            .catch(() => {
              setTimeout(() => {
                this.state.loginBtn = false
              }, 1000)
            })
        } else {
          setTimeout(() => {
            this.state.loginBtn = false
          }, 1000)
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
