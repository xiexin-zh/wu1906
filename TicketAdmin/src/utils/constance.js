const stream = ['new', 'ing', 'wait', 'finish'];

const defaultDispatchList = ['new']; // 默认展示工单分配

const groupIdToRole = {
  2: 'centerGroup',
  3: 'department',
  4: 'leaderGroup',
  5: 'organize',
};
const cancelList = ['剔除', '挂帐'];

const getLoginGroup = () =>
  groupIdToRole[JSON.parse(localStorage.getItem('currentUserInfo') || '').group_id];

export { stream, defaultDispatchList, groupIdToRole, getLoginGroup, cancelList };
