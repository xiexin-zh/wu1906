<template>
  <div class="mt-20 mb-20">
    <el-date-picker v-model="topic.selectContent" type="datetime" placeholder="选择日期时间" value-format="yyyy-M-d H:m"></el-date-picker>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop({ required: true }) private topic!: Questionnaire.IQuestionItem;
  @Prop({ required: true }) private index!: number;
}
</script>

<style lang="scss" scoped>
</style>
