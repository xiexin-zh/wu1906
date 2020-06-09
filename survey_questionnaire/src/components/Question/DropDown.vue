<template>
  <div class="dropdownBox">
    <el-form-item
      label="题目"
      :prop="'topic.' + index + '.question'"
      :rules="{
        required: true, validator: validateTitle, trigger: 'blur'
      }"
    >
      <el-input v-model="topic.question" placeholder="请输入题目内容" />
    </el-form-item>
    <el-form-item label="题目说明">
      <el-input type="textarea" v-model="topic.description" placeholder="请输入题目说明，可以为空" />
    </el-form-item>
    <el-form-item label="">
      <div
        v-for="(option, opIndex) in topic.options"
        :key="opIndex"
        class="option-item"
      >
        <el-row :gutter="22">
          <el-col :span="16">
            <el-form-item
              :label="`选项 ${ opIndex + 1 }`"
              :prop="'topic.' + index + '.options.' + opIndex + '.content'"
              :rules="{
                required: true, message: '选项内容不能为空', trigger: 'blur'
              }"
            >
              <el-input
                v-model="option.content"
                placeholder="请输入选项内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              type="success"
              icon="el-icon-plus"
              size="mini"
              @click="addOption(index)"
            />
            <el-button
              type="warning"
              icon="el-icon-minus"
              size="mini"
              @click="delOption(index, opIndex)"
            />
            <el-button
              type="success"
              icon="el-icon-top"
              size="mini"
              @click="changeOption(index,opIndex,'top')"
            />
            <el-button
              type="warning"
              icon="el-icon-bottom"
              size="mini"
              @click="changeOption(index,opIndex,'bottom')"
            />
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="16">
            <el-form-item label="描述">
              <el-input
                v-model="option.desc"
                type="textarea"
                :autosize="{ minRows: 2,maxRows: 5 }"
                placeholder="请输入选项描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 5px">
          <el-col :span="16">
            <el-form-item label="图片">
              <el-input
                v-model="option.image"
                placeholder="请输入图片地址"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
      </div>
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

  private delOption (index: number, opIndex: number) {
    this.$emit('delOption', {
      index,
      opIndex
    })
  }

  private addOption (index: number) {
    this.$emit('addOption', {
      index
    })
  }

  private changeOption(index: number, opIndex: number, type: string) {
    this.$emit("changeOption", {
      index,
      opIndex,
      type
    });
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

.dropdownBox:hover .tip{
  display: flex;
}
</style>
