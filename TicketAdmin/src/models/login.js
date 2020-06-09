// import { stringify } from 'querystring';
import { router } from 'umi';
import { message } from 'antd';
import {
  adminLogin,
  adminLogout,
  getFakeCaptcha,
  // fakeAccountLogin,
} from '@/services/login';
import { getTicketOption, getAllCityType, getAllQuesType } from '@/services/basicDataManagement';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    baseData: {},
    cityType: [],
    quesType: [],
  },
  effects: {
    *login({ payload }, { call, put }) {
      const { username, password } = payload;
      if (!username || !password) {
        message.warning('请填写用户名和密码');
        return;
      }
      try {
        const loginResponse = yield call(adminLogin, payload);
        const { state, message: msg, data } = loginResponse;
        if (!state) {
          message.warning(msg);
          return;
        }
        message.success(msg);
        window.console.log(' 👌👌👌 current user info--->>>', data);
        localStorage.setItem('token', btoa(encodeURIComponent(data.token)));
        localStorage.setItem('currentUserInfo', JSON.stringify(data));
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'ok',
            currentAuthority: 'superAdmin',
          },
        });
        yield put({
          type: 'getTicketOption',
        });
        yield put({
          type: 'getAllCityType',
        });
        yield put({
          type: 'getAllQuesType',
        });
        router.replace('/');
      } catch (error) {
        window.console.log(' error', error);
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        const { state, message: msg } = yield call(adminLogout);
        window.console.log(state, msg);
        if (!state) {
          message.warning(msg);
          return;
        }
        message.success(msg);
        localStorage.clear();
        router.replace({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        });
      }
    },

    *getTicketOption(_, { call, put, all }) {
      const [source, tel_subject, task_type, type, city_type, ques_type] = yield all([
        call(getTicketOption, { category: 'source' }),
        call(getTicketOption, { category: 'tel_subject' }),
        call(getTicketOption, { category: 'task_type' }),
        call(getTicketOption, { category: 'type' }),
        call(getTicketOption, { category: 'city_type' }),
        call(getTicketOption, { category: 'ques_type' }),
      ]);
      const baseData = {
        source: source?.data || [],
        tel_subject: tel_subject?.data || [],
        task_type: task_type?.data || [],
        type: type?.data || [],
        city_type: city_type?.data || [],
        ques_type: ques_type?.data || [],
      };

      yield put({
        type: 'setBaseData',
        payload: baseData,
      });
    },

    *getAllCityType(_, { call, put }) {
      const res = yield call(getAllCityType);
      if (res.state) {
        yield put({
          type: 'setCityType',
          payload: res.data,
        });
      }
    },
    *getAllQuesType(_, { call, put }) {
      const res = yield call(getAllQuesType);
      if (res.state) {
        yield put({
          type: 'setQuesType',
          payload: res.data,
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
    setBaseData(state, { payload }) {
      return {
        ...state,
        baseData: payload,
      };
    },
    setCityType(state, { payload }) {
      return {
        ...state,
        cityType: payload,
      };
    },
    setQuesType(state, { payload }) {
      return {
        ...state,
        quesType: payload,
      };
    },
  },
};
export default Model;
