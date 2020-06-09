<template>
  <div class="singleText">
    <el-form-item
      label="题目"
      :prop="'topic.' + index + '.question'"
      :rules="{
        required: true, message: '题目内容不能为空', trigger: 'blur'
      }"
    >
      <el-input v-model="topic.question" placeholder="请输入题目内容" />
    </el-form-item>
    <el-form-item label="题目说明">
      <el-input type="textarea" v-model="topic.description" placeholder="请输入题目说明，可以为空" />
    </el-form-item>
    <el-form-item
      label="必填项"
      :prop="'topic.' + index + '.isRequired'"
      :rules="{
        type: 'boolean', required: true, message: '请选择是否为必填项', trigger: 'change'
      }"
    >
      <div class="option-addtion">
        <el-switch
          v-model="topic.isRequired"
          active-text="有"
          inactive-text="否"
        />
        <!-- <div class="tip">
          <div class="tip1">
            <span>在此题后插入新题</span>
          </div>
          <div class="tip2">
            <el-button size="mini">复制</el-button>
            <el-button size="mini">删除</el-button>
            <el-button size="mini">上移</el-button>
            <el-button size="mini">下移</el-button>
            <el-button size="mini">最前</el-button>
            <el-button size="mini">最后</el-button>
          </div>
        </div> -->
      </div>
    </el-form-item>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop } from 'vue-property-decorator'
import {
  getLength,
  regTel,
  regNumber,
  regClass,
  regBirthday,
  regIdCard,
  regCode
} from "@/utils/transform";

@Component
export default class extends Vue {
  @Prop({ required: true }) private topic!: Questionnaire.IQuestionItem
  @Prop({ required: true }) private index!: number

  private validateTitle(rule: any, value: any, callback: any) {
    if (value === "") {
      callback(new Error("请输入题目名称"));
    } else if (getLength(value) > 100) {
      callback(new Error("长度:中文50个字，英文100个字母"));
    } else {
      callback();
    }
  }
}
</script>

<style lang="scss" scoped>
.option-addtion {
  position: relative;
}
.tip {
  width: 80%;
  height: 40px;
  position: absolute;
  bottom: -15px;
  right: 0;
  justify-content: space-between;
  display: none;
}
.tip1 {
  font-size: 14px;
  color: blue;
}
.tip1 span{
  cursor: pointer;
}

.singleText:hover .tip{
  display: flex;
}
</style>
