<!-- 消费分析 -->
<template>
  <div style="border:1px solid #E6E6E6">
    <div class="analysis-title" style="padding:10px 10px 0 10px">
      本月入場資訊
    </div>
    <div class="progress-box-border">
      <div class="progress-box" v-for="(item, index) in progressList">
        <Progress
          :progressTitle="item.title"
          :color="item.bgColor"
          :percentage="item.than"
        />
      </div>
    </div>
    <div class="footer" style="padding-bottom:10px;padding-left:10px;">
      <p>當月可禮遇數</p>
      <div class="footer-num">
        <p>0.02</p>
        <div class="footer-unit">
          <p>(萬)</p>
          <p>HKD</p>
        </div>
      </div>
      <p>累計可禮遇數</p>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import Progress from "./Progress";
import { progressList } from "../../../../assets/data/consumptionAnalysis/progress-list";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    Progress
  },
  data() {
    //这里存放数据
    return {
      progressList
    };
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
.analysis-title {
  font-size: 16px;
  // font-weight: bold;
}
.progress-box-border {
  border: 1px solid rgb(230, 230, 230);
  padding-top: 20px;
  margin: 10px 0;
}
.progress-box {
  width: 500px;
  margin: 0 auto;
  .progress {
    margin-bottom: 20px;
  }
}
.footer {
  margin-right: 200px;
  font-size: 16px;
}
.footer,
.footer-num {
  // font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .footer-unit {
    text-align: center;
    font-size: 12px;
  }
  .footer-num p {
    margin-right: 10px;
  }
}
</style>
