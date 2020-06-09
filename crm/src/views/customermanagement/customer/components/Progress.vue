<!-- 消费分析 -->
<template>
  <div class="progress">
    <h1>{{ progressTitle }}</h1>
    <el-progress
      :text-inside="true"
      :stroke-width="35"
      :percentage="percentage"
      :color="color"
    ></el-progress>
    <div class="progress-unit">
      <p>(萬)</p>
      <p>HKD</p>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {};
  },
  props: {
    progressTitle: {
      type: String,
      default: "進度條"
    },
    color: {
      type: String,
      default: "#20a0ff"
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="scss" scoped>
//@import url(); 引入公共css类
.progress {
  h1 {
    margin: 0;
  }
  display: flex;
  .el-progress {
    width: 100%;
    margin: 0 10px;
  }
  .progress-unit {
    text-align: center;
    font-weight: bold;
  }
}
</style>
