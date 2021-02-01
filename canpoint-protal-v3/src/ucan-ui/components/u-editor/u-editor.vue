<template>
  <div :style="{ height: height + 'px' }">
    <quill-editor
      :style="{ width: '100%', height: height - 50 + 'px' }"
      v-model="value"
      ref="myQuillEditor1"
      :options="quillOption"
      @change="onEditorChange($event, 'content1')"
    ></quill-editor>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import quillConfig from '../../libs/quiill-config'
export default {
  name: 'UEditor',
  components: {
    quillEditor
  },
  props: {
    // 文本区域内容
    value: {
      type: String,
      default: ''
    },
    // 文本区域高度
    height: {
      type: Number,
      default: 400
    }
  },
  data() {
    return { quillOption: quillConfig }
  },
  mounted() {},
  methods: {
    // 获得焦点事件
    onEditorChange(data) {
      this.$emit('input', data.html)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ql-toolbar.ql-snow {
  border: 1px solid #e8e8e8;
}
/deep/ .ql-container.ql-snow {
  border: 1px solid #e8e8e8;
}
</style>
