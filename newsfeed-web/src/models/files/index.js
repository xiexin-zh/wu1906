import { fromJS } from 'immutable';
import { message } from 'antd';
// import { delay } from 'redux-saga';
// import get from 'lodash/get';
import { namespace } from './constants';
import { getUploadUrl, uploadFile, uploadFileByPreview } from './service';
import { getCurrentUserId } from '../updatePersonalGroupInfo/selectors';
import { transformImage } from '../../utils/file';

const initialState = fromJS({
  data: [],
});

export default {
  namespace,
  state: initialState,
  effects: {
    *uploadFile({ payload }, { select, call }) {
      const { fileIndex = 0, type = 1 } = payload;
      let { file } = payload;
      if (type === 1) {
        file = yield call(transformImage, file);
      }
      const userId = yield select(getCurrentUserId);
      const uploadGroupHeadRes = yield call(uploadFile, {
        userId,
        fileIndex,
        type,
        file,
      });
      return uploadGroupHeadRes.data;
    },
    *uploadFileByPreview({ payload }, { call, put, select }) {
      try {
        const {
          fileObj,
          fileObj: { type, name },
          storeType = 'avatar',
        } = payload;
        const file = yield call(transformImage, fileObj);
        const fileResponse = yield call(getUploadUrl, storeType);
        const {
          preview_download_url,
          preview_upload_url,
        } = fileResponse.result;
        yield call(uploadFileByPreview, {
          name,
          mime: type,
          fileObj: file,
          uploadUrl: preview_upload_url,
        });
        return preview_download_url;
      } catch (error) {
        console.info(error);
        message.warn('文件上傳失敗');
        return false;
      }
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return state;
    },
  },
};
