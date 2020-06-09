import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import queryString from 'query-string';
import styles from './index.scss';

import { withRouter } from 'dva/router';

import { refreshPost } from '../../../models/posts/actions';
import { getCurrentUserId } from '../../../models/session/selectors';
import { clearAllSearchHistory } from '../../../utils/searchHistory';

function SliderLink({ history, ...props }) {
  //判斷是否是接受邀請頁面
  function isInvitePage() {
    return queryString.parse(props.location.search).inviteId ? true : false;
  }

  //以下頁面增加刷新按鈕
  function isAddRefresh() {
    return (
      getPageType() === '/' ||
      getPageType() === '/groups' ||
      getPageType() === '/user' ||
      (getPageType().includes('/groups/') && !isInvitePage()) ||
      getPageType().includes('/user/')
    );
  }

  //獲取URL參數
  function getPageType() {
    const { location } = props;
    const currentPage = location.pathname;
    return currentPage;
  }
  //根據URL請求加載數據
  function refreshData() {
    const { refreshPost, userId } = props;
    const currentPageUrl = getPageType();
    if (currentPageUrl === '/') {
      refreshPost({});
    } else if (currentPageUrl === '/groups') {
      refreshPost({
        type: 'allGroup',
      });
    } else if (currentPageUrl === '/user') {
      refreshPost({
        type: 'user',
        userId,
      });
    } else if (currentPageUrl.includes('/groups/') && !isInvitePage()) {
      refreshPost({
        type: 'group',
        groupId: currentPageUrl.split('/')[2],
      });
    } else if (currentPageUrl.includes('/user/')) {
      refreshPost({
        type: 'user',
        userId: currentPageUrl.split('/')[2],
      });
    } else {
      window.location.reload(true);
    }
  }

  //返回上一頁
  function cancelPage() {
    window.history.go(-1);
  }

  //登出
  function signOut() {
    const { signOut } = props;
    clearAllSearchHistory();
    signOut();
  }

  const { loadingStatus } = props;

  if (loadingStatus) {
    return (
      <div className={styles.wrapperSlide}>
        {/* 增加返回/刷新按鈕 */}
        {isAddRefresh() && (
          <div className={styles.operateAside}>
            <div className={styles.cancel} onClick={cancelPage}>
              <Icon type="arrow-left" style={{ fontSize: 16 }} />
              <span>返回</span>
            </div>
            <div className={styles.refresh} onClick={refreshData}>
              <Icon type="sync" style={{ fontSize: 16 }} />
              <span>刷新</span>
            </div>
            <div className={styles.signOut} onClick={signOut}>
              <Icon type="export" style={{ fontSize: 16 }} />
              <span>登出</span>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
}
function mapStateToProps(state) {
  return {
    userId: getCurrentUserId(state),
    loadingStatus: state.posts.get('loadingStatus'),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    refreshPost: (refreshData) => {
      dispatch(refreshPost(refreshData));
    },
    signOut: () => {
      dispatch({
        type: 'session/signOut',
      });
      sessionStorage.setItem('hasDraft', '');
    },
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SliderLink)
);
