<template>
  <!-- 新建和编辑 -->
  <el-dialog title="編輯密碼"
             :visible.sync="showDialog"
             width="500px"
             v-loading="loading"
             :before-close="hiddenView">
    <el-form :model="ruleForm"
             :rules="rules"
             ref="ruleForm"
             label-width="80px"
             label-position="top">
      <el-form-item label="原密碼"
                    prop="old_pwd">
        <el-input v-model="ruleForm.old_pwd"></el-input>
      </el-form-item>
      <el-form-item label="新密碼"
                    prop="new_pwd">
        <el-input v-model="ruleForm.new_pwd"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="save">保 存</el-button>
      <el-button @click="hiddenView">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/javascript">
import { mapGetters } from 'vuex'
import { adminUsersResetPassword } from '@/api/personCenter/personCenter'
import { removeAuth } from '@/utils/auth'

export default {
  name: 'edit-password', // 编辑个人密码
  components: {},
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    show: {
      handler(val) {
        this.showDialog = val
        this.ruleForm.id = this.userInfo.id
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      rules: {
        old_pwd: [
          { required: true, message: '請輸入原密碼', trigger: 'blur' },
          { min: 6, max: 12, message: '長度在 6 到 12 個字符', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, message: '請輸入新密碼', trigger: 'blur' },
          { min: 6, max: 12, message: '長度在 6 到 12 個字符', trigger: 'blur' }
        ]
      },
      ruleForm: {
        id: '',
        old_pwd: '',
        new_pwd: ''
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  methods: {
    hiddenView() {
      this.$emit('close')
    },
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          adminUsersResetPassword(this.ruleForm)
            .then(res => {
              this.loading = false
              removeAuth().then(() => {
                this.$confirm('修改成功, 請重新登錄', '提示', {
                  confirmButtonText: '確定',
                  showCancelButton: false,
                  type: 'warning'
                })
                  .then(() => {
                    this.$router.push('/login')
                  })
                  .catch(() => {})
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
