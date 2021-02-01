const primary = ['#0074e0', '#0084ff', '#c2e1ff', '#ebf5ff']
const success = ['#008f53', '#00a35f', '#adffdd', '#ebfff7']
const warning = ['#f46715', '#f5772d', '#fbccb1', '#fef2ec']
const error = ['#ff3333', '#ff5454', '#ffc2c2', '#ffebeb']
const info = ['#f5b111', '#eba70a', '#fbdf9d', '#fef9eb']
const auto = '#999999'
const colorList = {
  是: primary[0],
  否: auto,
  男: primary[0],
  女: warning[0],
  在职: success[0],
  离职: auto,
  进: success[0],
  出: warning[0],
  未知: auto,
  不分进出: info[0],
  省级: primary[0],
  市级: primary[1],
  '区/县级': primary[2],
  老师: primary[0],
  家长: success[0],
  学生: info[0],
  相机: primary[0],
  面板机: info[0],
  班牌: success[0],
  住读: success[0],
  走读: auto,
  幼儿园: primary[0],
  小学: primary[1],
  初中: warning[0],
  高中: warning[1],
  九年制: error[0],
  十二年制: error[1],
  完全中学: info[0],
  中职: success[0],
  高职: success[1],
  成功: success[0],
  失败: auto,
  待访问: primary[0],
  在访: success[0],
  签离: auto,
  待审批: primary[0],
  同意: success[0],
  不同意: error[0],
  撤销: warning[0],
  失效: auto,
  迟到: primary[0],
  早退: primary[1],
  缺卡: warning[0],
  请假: warning[1],
  正常: success[0],
  缺勤: info[0]
}
export default colorList
