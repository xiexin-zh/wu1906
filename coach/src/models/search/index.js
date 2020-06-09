import { setSoundStatus } from "./service";

export default {
  namespace: "search",

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
