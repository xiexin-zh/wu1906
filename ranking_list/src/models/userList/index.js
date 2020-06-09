import { setSoundStatus } from "./service";

export default {
  namespace: "userList",

  state: {
  },

  subscriptions: {},

  effects: {
    *setSoundStatus({ payload }, { put, call }) {
      let res = yield call(setSoundStatus, {
        payload,
      });
      return res;
    },
  },

  reducers: {
  },
};
