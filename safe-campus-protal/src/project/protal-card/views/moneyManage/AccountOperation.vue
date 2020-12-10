<template>
  <div class="page-layout qui-fx-ver">
    <a-row>
      <a-col :span="5">姓名：</a-col>
      <a-col :span="19"></a-col>
    </a-row>
    <a-row>
      <a-col :span="5">班级/部门：</a-col>
      <a-col :span="19"></a-col>
    </a-row>
    <a-row>
      <a-col :span="5">身份：</a-col>
      <a-col :span="19"></a-col>
    </a-row>
    <a-row>
      <a-col :span="5">学号/工号：</a-col>
      <a-col :span="19"></a-col>
    </a-row>
    <a-row>
      <a-col :span="5">卡号：</a-col>
      <a-col :span="19"></a-col>
    </a-row>
    <a-row>
      <a-col :span="5">状态：</a-col>
      <a-col :span="19"></a-col>
    </a-row>
    <a-row type="flex" align="middle">
      <a-col :span="5">充值金额：</a-col>
      <a-col :span="19">
        <a-input placeholder="请输入充值金额" />
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: 'AccountOperation',
  components: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="less" scoped></style>
