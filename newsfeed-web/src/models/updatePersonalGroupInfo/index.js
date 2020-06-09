import { fromJS } from 'immutable';
import { namespace } from './constants';
import {
  upload,
  create_group,
  // edit_user,
  edit_group,
  // getFile,
  // uploadAvatar,
  user_album,
  get_group_album,
} from './service';
import { getCurrentUserId } from './selectors';
import { getUrl, getImgSize } from '../../utils/utils';
// import { uploadFile } from '../../utils/headUpdate';
// import { getUserDataFromStore } from '../users/selectors';
import { getGroupDetail } from '../groupInfo/selectors';
import { transformImage } from '../../utils/file';

const initialState = fromJS({
  showExploreCreateGroup: false,
  exploreCreateGroupTitle: 'Group.CreateGroup',
  loading: false,
  albumVisible: false,
});

export default {
  namespace,
  state: initialState,
  effects: {
    // 上傳圖片檔案介面公共調用
    *uploadImagesData({ payload }, { select, call, put }) {
      const currentUserId = yield select(getCurrentUserId);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const uploadGroupHeadRes = yield call(upload, {
        userId: currentUserId,
        fileIndex: 0,
        type: 1,
        file: payload,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      return uploadGroupHeadRes;
    },
    //上傳圖片需要的 原始 url/width/height/size
    *uploadImagesUrlDate(
      {
        payload: { fileObj },
      },
      { put, call, all }
    ) {
      const { fileWidthHeight, uploadGroupHeadRes } = yield all({
        fileWidthHeight: call(getImgSize, fileObj), // 獲取檔案的 寬高
        uploadGroupHeadRes: put.resolve({
          // 調用上傳接口，需要使用返回的 URL 再次上傳修改
          type: 'uploadImagesData',
          payload: fileObj,
        }),
      });
      // 拼接 修改 背景或者頭像的 avatarUrl 或者 cover 上傳的 JSON
      const urlDate = {
        url: uploadGroupHeadRes.data.originUrl,
        size: fileObj.size,
        width: fileWidthHeight.width,
        height: fileWidthHeight.height,
      };
      return urlDate;
    },
    // 群組頭像上傳 並返回可用的 URL 做展示
    *uploadGroupHead({ payload }, { put }) {
      const uploadGroupHeadRes = yield put.resolve({
        type: 'uploadImagesData',
        payload,
      });
      const showUrl = getUrl(uploadGroupHeadRes.data.originUrl);

      return {
        showUrl,
        backSaveUrl: uploadGroupHeadRes.data,
      };
    },
    // 建立群組
    *createGroup({ payload }, { select, call }) {
      const userId = yield select(getCurrentUserId);
      const createGroupSuccessful = yield call(create_group, {
        userId,
        ...payload,
      });
      console.log('建立群組成功', createGroupSuccessful);
    },
    *editGroup({ payload }, { call, select, put }) {
      const {
        currentGroupInfo: { groupId },
        groupName,
        isPublic,
        description,
        fileObj,
      } = payload;

      // 獲取當前登入用戶的 id
      const userId = yield select(getCurrentUserId);
      // 之前的群組數據
      const originalGroupData = yield select((state) =>
        getGroupDetail(state, groupId)
      );
      // URl data
      let uploadImagesUrlDate = null;

      if (fileObj) {
        const file = yield call(transformImage, fileObj);
        uploadImagesUrlDate = yield put.resolve({
          type: 'uploadImagesUrlDate',
          payload: { fileObj: file },
        });
      }
      // 請求修改群組資訊編輯的介面
      const editGroupSuccessful = yield call(edit_group, {
        userId,
        groupId,
        groupName,
        isPublic,
        description,
        avatarUrl: uploadImagesUrlDate,
        cover: null,
      });
      // 同步群組數據
      yield put({
        type: 'groupInfo/saveGroupDetails',
        payload: {
          ...originalGroupData.toJS(), //之前的數據
          ...editGroupSuccessful.data, //新數據
        },
      });
    },
    // 个人相册获取数据
    *getAlbumInfo({ payload }, { call, select }) {
      // 獲取當前登入用戶的 id
      const currentUserId = yield select(getCurrentUserId);
      return yield call(user_album, {
        currentUserId,
        ...payload,
      });
    },
    // 群组相册获取数据
    *getGroupAlbumInfo({ payload }, { call, select }) {
      // 獲取當前登入用戶的 id
      const userId = yield select(getCurrentUserId);
      return yield call(get_group_album, {
        userId,
        ...payload,
      });
    },
  },
  reducers: {
    // 顯示 創建/探索 群組
    showExploreCreateGroupActive(state, { payload }) {
      return state
        .set('showExploreCreateGroup', fromJS(true))
        .set('exploreCreateGroupTitle', fromJS(payload));
    },
    // 隱藏 創建/探索 群組
    hideExploreCreateGroupActive(state) {
      return state.set('showExploreCreateGroup', fromJS(false));
    },
    changeLoading(state, { payload }) {
      return state.set('loading', fromJS(payload));
    },
    controlAlbumDetails(state, { payload }) {
      return state.set('albumVisible', fromJS(payload));
    },
  },
};
