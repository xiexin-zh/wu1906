<template>
  <div class="guide-info">
    <div class="guide-title">欢迎使用宿管系统，请按如下步骤进行相关配置：</div>
    <p>第一步：在宿舍管理模块新增宿舍</p>
    <p>第二步：在系统设置 - 设备关联模块进行宿舍与设备的绑定</p>
    <p>第三步：在系统设置 - 时间设置模块根据学校实际情况对默认配置进行修改</p>
    <div>请按照操作指引进行设置</div>
    <div style="text-align:right;margin-top: 20px;">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuideInfo',
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.guide-info {
  line-height: 30px;
  color: #333;
  .guide-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  p {
    font-size: 16px;
    color: @main-color;
  }
}
</style>
