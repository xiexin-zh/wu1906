import { creatVote } from './service';

const initialState = {};

export default {
  namespace: 'sendVote',

  state: initialState,

  effects: {
    *createVote({ payload }, { call, put }) {
      const { code, data } = yield call(creatVote, payload);
      if (Object.is(code, '200')) {
        yield put({
          type: 'posts/createPostUpdatePostList',
          payload: {
            createPostData: data,
          },
        });
        return data;
      }
    },
  },

  reducers: {},
};
