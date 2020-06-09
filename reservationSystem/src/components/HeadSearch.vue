<template>
  <div class="header">
    <div class="content">
      <el-select @change="selectChange" v-model="value" placeholder="搜索类别">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input v-model="serchinput" placeholder="请输入内容"></el-input>
      <el-button @click="clickSerchBtn(serchinput)" class="btn">搜索</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      serchinput: ""
    };
  },
  props: {
    options: Array,
    clickSerchBtn: Function,
    selectChange:Function,
  },
  components: {},
  mounted(){
    console.log(this.options);
  },
  methods: {
    // selectChange(val) {
    //   console.log(val);
    // }
  }
};
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: flex-end;
  .content {
    display: flex;
    .btn {
      width: 71px;
      height: 32px;
      background: rgba(68, 92, 115, 1);
      border-radius: 4px;
      color: white;
    }
  }
}
</style>
