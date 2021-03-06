<template>
  <create-view :loading="loading"
               :body-style="{ height: '100%'}">
    <flexbox direction="column"
             align="stretch"
             class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;">{{title}}</div>
        <img @click="hidenView"
             class="close"
             src="@/assets/img/task_close.png" />
      </flexbox>
      <div class="crm-create-flex">
        <create-sections title="基本信息">
          <flexbox direction="column"
                   align="stretch">
            <div class="crm-create-body">
              <el-form ref="crmForm"
                       :model="crmForm"
                       label-position="top"
                       class="crm-create-box">
                <el-form-item v-for="(item, index) in this.crmForm.crmFields"
                              :key="item.key"
                              :prop="'crmFields.' + index + '.value'"
                              :class="{ 'crm-create-block-item': item.showblock, 'crm-create-item': !item.showblock }"
                              :style="{'padding-left': getPaddingLeft(item, index), 'padding-right': getPaddingRight(item, index)}">
                  <div slot="label"
                       style="display: inline-block;">
                    <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                      {{item.data.name}}
                      <span style="color:#999;">
                        {{item.data.input_tips ? '（'+item.data.input_tips+'）':''}}
                      </span>
                    </div>
                  </div>
                  <!-- -->
                  <component :is="item.data.form_type | typeToComponentName"
                             :radio="false"
                             :disabled="item.disabled">
                  </component>
                </el-form-item>
              </el-form>
            </div>
          </flexbox>
        </create-sections>
      </div>
    </flexbox>
  </create-view>
</template>
<script type="text/javascript">
import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'
import { customFieldList } from '@/api/systemManagement/SystemCustomer'

import {
  XhInput,
  XhTextarea,
  XhSelect,
  XhMultipleSelect,
  XhDate,
  XhDateTime,
  XhUserCell,
  XhStructureCell,
  XhFiles,
  CrmRelativeCell,
  XhProuctCate,
  XhProduct,
  XhBusinessStatus,
  XhCustomerAddress,
  XhReceivablesPlan // 回款计划期数
} from '@/components/CreateCom'

export default {
  name: 'preview-field-view', // 所有新建效果的view
  components: {
    CreateView,
    CreateSections,
    XhInput,
    XhTextarea,
    XhSelect,
    XhMultipleSelect,
    XhDate,
    XhDateTime,
    XhUserCell,
    XhStructureCell,
    XhFiles,
    CrmRelativeCell,
    XhProuctCate,
    XhProduct,
    XhBusinessStatus,
    XhCustomerAddress,
    XhReceivablesPlan
  },
  computed: {},
  watch: {
    types: function(value) {
      this.crmForm = {
        crmFields: []
      }
      this.getField()
    }
  },
  data() {
    return {
      // 标题展示名称
      title: '預覽',
      loading: false,
      // 自定义字段信息表单
      crmForm: {
        crmFields: []
      }
    }
  },
  filters: {
    /** 根据type 找到组件 */
    typeToComponentName(form_type) {
      if (
        form_type == 'text' ||
        form_type == 'number' ||
        form_type == 'floatnumber' ||
        form_type == 'mobile' ||
        form_type == 'email'
      ) {
        return 'XhInput'
      } else if (form_type == 'textarea') {
        return 'XhTextarea'
      } else if (form_type == 'select' || form_type == 'business_status') {
        return 'XhSelect'
      } else if (form_type == 'checkbox') {
        return 'XhMultipleSelect'
      } else if (form_type == 'date') {
        return 'XhDate'
      } else if (form_type == 'datetime') {
        return 'XhDateTime'
      } else if (form_type == 'user') {
        return 'XhUserCell'
      } else if (form_type == 'structure') {
        return 'XhStructureCell'
      } else if (form_type == 'file') {
        return 'XhFiles'
      } else if (
        form_type == 'contacts' ||
        form_type == 'customer' ||
        form_type == 'contract' ||
        form_type == 'business'
      ) {
        return 'CrmRelativeCell'
      } else if (form_type == 'category') {
        // 产品类别
        return 'XhProuctCate'
      } else if (form_type == 'business_type') {
        // 商机类别
        return 'XhBusinessStatus'
      } else if (form_type == 'product') {
        return 'XhProduct'
      } else if (form_type == 'map_address') {
        return 'XhCustomerAddress'
      } else if (form_type == 'receivables_plan') {
        return 'XhReceivablesPlan'
      }
    }
  },
  props: {
    // 类型
    types: {
      type: String,
      default: ''
    },
    types_id: {
      type: [String, Number],
      default: ''
    }
  },
  mounted() {
    // 获取title展示名称
    document.body.appendChild(this.$el)
    this.getField()
  },
  methods: {
    // 获取自定义字段
    getField() {
      this.loading = true
      // 获取自定义字段的更新时间
      var params = {}
      params.types = this.types
      if (this.types == 'oa_examine') {
        params.types_id = this.types_id
      }

      customFieldList(params)
        .then(res => {
          this.getcrmRulesAndModel(res.data)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 根据自定义字段获取自定义字段规则
    getcrmRulesAndModel(list) {
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        var params = {}
        params['value'] = item.value
        params['key'] = item.field
        params['data'] = item
        params['disabled'] = true // 是否可交互
        this.crmForm.crmFields.push(params)
      }
    },
    hidenView() {
      this.$emit('hiden-view')
    },
    // 获取左边padding
    getPaddingLeft(item, index) {
      if (item.showblock && item.showblock == true) {
        return '0'
      }
      return index % 2 == 0 ? '0' : '25px'
    },
    // 获取左边padding
    getPaddingRight(item, index) {
      if (item.showblock && item.showblock == true) {
        return '0'
      }

      return index % 2 == 0 ? '25px' : '0'
    }
  },
  destroyed() {
    // remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>
<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-flex {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    width: 40px;
    height: 40px;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
}

.crm-create-body {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

/** 将其改变为flex布局 */
.crm-create-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
}

.crm-create-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  // overflow: hidden;
  padding-bottom: 10px;
}

// 占用一整行
.crm-create-block-item {
  flex: 0 0 100%;
  flex-shrink: 0;
  padding-bottom: 10px;
}

.el-form-item /deep/ .el-form-item__label {
  line-height: normal;
  font-size: 13px;
  color: #333333;
  position: relative;
  padding-left: 8px;
  padding-bottom: 0;
}

.el-form /deep/ .el-form-item {
  margin-bottom: 0px;
}

.el-form /deep/ .el-form-item.is-required .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
  position: absolute;
  left: 0;
  top: 5px;
}
</style>
