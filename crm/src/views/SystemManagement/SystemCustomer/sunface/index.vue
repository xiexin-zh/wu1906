<template>
  <div class="system-customer">
    <div class="title">人臉識別規則管理</div>
    <div class="customer-content"
         v-loading="loading">
      <!-- 客户保护规则设置 -->
      <div class="system-view-table">
        <div class="content-title">
          <span>人臉識別規則設置</span>
          <el-button type="primary"
                     class="rt"
                     size="medium"
                     style="background: #005DF7"
                     @click="customerSettingSave">保存</el-button>
        </div>
        <div class="customer-setting">
          <!-- <label>人脸识别规则设置</label> -->
          <div class="customer-radio">
             <span style="font-size:14px; line-height:66px; margin-bottom:20px">人臉識別系統啟用：</span>  <br />
            <el-radio-group v-model="customerData.face_open">
              <el-radio :label="0">不啟用</el-radio>
              <el-radio :label="1">啟用</el-radio>
            </el-radio-group>
            <br />
             <span style="font-size:14px; line-height:66px; margin-bottom:20px">人臉識別系統地址：</span>
            <el-input v-model="customerData.face_url"
                          ></el-input>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  crmSettingConfig, // 客户保护规则
  crmSettingConfigData // 客户详情
} from '@/api/systemManagement/SystemCustomer'

export default {
  name: 'sunface', // 客户设置

  components: {},

  data() {
    return {
      loading: false, // 展示加载中效果
      // 客户掉报规则设置
      customerData: {
        face_open: 0,
        face_url: ""


      }
    }
  },

  created() {
    this.customerSettingData()
  },

  methods: {
    /**
     * 客户保护规则
     */
    customerSettingData() {
      this.loading = true
      crmSettingConfigData()
        .then(res => {
          this.loading = false
          res.data.face_open = parseInt(res.data.face_open)
          this.customerData = res.data
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 设置保存
     */
    customerSettingSave() {
      this.loading = true
      crmSettingConfig(this.customerData)
        .then(res => {
          this.loading = false
          this.$message.success(res.data)
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.system-customer {
  /* padding: 0 20px 20px; */
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.title {
  font-size: 18px;
  height: 40px;
  padding: 0 20px;
  line-height: 40px;
  margin: 10px 0;
  color: #333;
}
.customer-content {
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
}

.system-view-table {
  flex: 1;
  border: 1px solid #e6e6e6;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}

.content-title {
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
}
.content-title > span {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  margin-left: 20px;
}
.customer-setting {
  padding-left: 20px;
}
.customer-radio {
  display: inline-block;
  vertical-align: top;
}
.customer-setting > label {
  padding-right: 30px;
}
.customer-radio > .el-radio-group {
  margin-bottom: 30px;
}
</style>
