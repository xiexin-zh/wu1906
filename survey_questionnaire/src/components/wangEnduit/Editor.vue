<template>
  <div class="editorBox">
    <div ref="toolbar" class="editToolbar"></div>
    <div ref="editor" class="editText"></div>
  </div>
</template>

<script>
/* eslint-disable */
import E from "wangeditor";
export default {
  name: "editoritem",
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    editValue: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    }
  },
  watch: {
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value);
      }
    }
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.editValue);
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);

      // 配置菜单
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify" // 对齐方式
      ];

      this.editor.customConfig.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.type, this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
    }
  }
};
</script>

<style lang="css">
.editorBox {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.editToolbar {
  border: 1px solid #ccc;
  border-bottom: 0;
  position: relative;
  z-index: 10001;
}
.editText {
  border: 1px solid #ccc;
}
.editToolbar .w-e-droplist .w-e-list {
  width: 100%;
  height: 150px;
  overflow-y: scroll;
}
</style>