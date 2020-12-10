<template>
  <a-modal
    :width="width"
    :height="height"
    :title="title"
    v-model="status"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <slot></slot>
    <template slot="footer">
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">{{ onText }}</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'ShowDialog',
  props: {
    width: {
      type: String,
      default: '500px'
    },
    height: {
      type: String,
      default: '500px'
    },
    onText: {
      type: String,
      default: '确定'
    },
    title: {
      type: String,
      default: '详情'
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleOk() {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="less"></style>
