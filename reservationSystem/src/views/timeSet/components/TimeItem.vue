<template>
  <div class="timeItme">
    <span class="num">{{index+1}}.</span>
    <el-time-select
      @change="startchange($event,index)"
      placeholder="起始时间"
      v-model="startTime"
      :picker-options="{
                step: '00:15',
                 maxTime:endTime
                        }"
    ></el-time-select>
    <span style="margin:0 16px">至</span>
    <el-time-select
      @change="endchange($event,index)"
      placeholder="结束时间"
      v-model="endTime"
      :picker-options="{
                step: '00:15',
                minTime:startTime
            }"
    ></el-time-select>
    <label class="numbertx">，可预约量</label>
    <input class="inputItem" @change="getNum(num,index)" v-model="num" placeholder="请输入预约量" />

    <i @click="click(index)" class="el-icon-delete"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startTime: "",
      endTime: "",
      id: "",
      num: ""
    };
  },
  props: ["dataItem", "index", "startchange", "endchange", "getNum", "click"],
  components: {},
  mounted() {
    const { rf_start, rf_end, rf_id, rf_setnum } = this.dataItem;

    this.startTime = rf_start;
    this.endTime = rf_end;
    this.id = rf_id;
    this.num = rf_setnum;
  },
  methods: {}
};
</script>

<style scoped lang="less">
.timeItme {
  margin-top: 20px;
}
.numbertx{
  margin: 0 20px;
}
.inputItem {
  width: 220px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.14);
}
</style>
