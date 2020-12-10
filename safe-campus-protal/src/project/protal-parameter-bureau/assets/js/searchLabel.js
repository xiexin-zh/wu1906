/*
 * @Author: your name
 * @Date: 2020-11-03 14:14:52
 * @LastEditTime: 2020-11-07 16:23:43
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \new-protal-base\src\project\protal-parameter-bureau\assets\js\searchLabel.js
 */
// import Tools from '@u/tools'
// 安全教育
// 安全知识
export const knowledgeSearchLabel = [
  {
    value: 'fileType', // 表单属性
    type: 'select', // 表单类型
    label: '文件类型', // 表单label值
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '看一看'
      },
      {
        key: '2',
        val: '玩一玩'
      },
      {
        key: '3',
        val: '读一读'
      },
      {
        key: '4',
        val: '听一听'
      }
    ]
  },
  {
    value: 'resourceName', // 表单属性
    type: 'input', // 表单类型
    label: '资源名称', // 表单label值
    placeholder: '请输入资源名称' // 表单默认值(非必选字段)
  }
]
