/**
 * 題目类型
 */

export enum questionType {
  SINGLE_CHOICE = '单选题',
  MULTIPLE_CHOICE = '多选题',
  SINGLE_TEXT = '单行文本',
  DROP_DOWN = '下拉框',
  TEXT_MUILTIPLE = '多行文本',
  DATE_PICKER = '日期时间'
}

export type questionTypeText = '单选题' | '多选题' | '单行文本' | '下拉框' | '多行文本' | '日期时间'
