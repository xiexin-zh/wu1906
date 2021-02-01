<template>
  <a-button
    :size="size"
    :icon="icon"
    :loading="loading"
    :type="type"
    @click.stop="_click"
    :style="{ cursor: disabled ? 'not-allowed' : 'pointer', paddingLeft: type === 'link' ? '0px' : '10px' }"
    :class="getClass()"
  >
    <slot></slot>
  </a-button>
</template>

<script>
export default {
  name: 'UButton',
  props: {
    // 按钮类型
    // primary：高亮
    type: {
      type: String,
      default: 'primary'
    },
    // 按钮图标
    icon: {
      type: String,
      default: ''
    },
    // 按钮是否加载
    loading: {
      type: Boolean,
      default: false
    },
    // 是否是删除功能按钮
    delete: {
      type: Boolean,
      default: false
    },
    // 是否禁用按钮
    disabled: {
      type: Boolean,
      default: false
    },
    // 按钮尺寸
    size: {
      type: String,
      default: 'default'
    },
    // 删除时的提示文字
    content: {
      type: String,
      default: '您确定执行此操作吗?'
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    _click() {
      if (this.disabled) return
      if (this.delete) {
        const _self = this
        this.$confirm({
          title: '温馨提示',
          content: this.content,
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _self.$Modal.destroyAll()
            _self.$emit('click')
          },
          onCancel() {}
        })
        return
      }
      this.$emit('click')
    },
    getClass() {
      if (this.type === 'light') {
        return 'u-button- u-button-light'
      } else if (this.type === 'default') {
        return 'u-button- u-button-default'
      } else if (this.type === 'danger') {
        return 'u-button- u-button-danger'
      } else if (this.type === 'link' && this.delete) {
        return 'u-button- u-button-delete'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.u-button- {
  cursor: pointer;
}
.u-button-primary {
  color: #fff;
  background-color: @u-type-primary;
}
.u-button-light {
  color: @u-type-primary;
  background-color: @u-type-primary-light;
}
.u-button-default {
  color: #999999;
  background-color: #f6f7fb;
}
.u-button-danger {
  border: 1px @u-type-error-light solid;
  color: @u-type-error-dark;
  background-color: @u-type-error-light;
}
.u-button-danger:hover {
  border: 1px @u-type-error-dark solid;
}
.u-button-delete {
  color: @u-type-error;
}
/deep/ .ant-btn-link {
  padding: 0 !important;
}
</style>
