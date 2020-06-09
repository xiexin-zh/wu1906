export const getCurrentUserId = (state) =>
  state['session'].getIn(['user', 'id']);
