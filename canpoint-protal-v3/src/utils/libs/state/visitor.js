/**
 * 访客系统
 */
const visitor = {
  approvalStatus: { 0: '待审批', 1: '同意', 2: '不同意', 3: '撤销', 4: '失效' }, // 审批状态
  visitState: { 0: '待访问', 1: '在访', 2: '签离' } // 访问状态
}

export default visitor
