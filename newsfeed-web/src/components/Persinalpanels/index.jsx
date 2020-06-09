import React from 'react';
import { connect } from 'dva';
import get from 'lodash/get';
import { Popover, Button, message } from 'antd';
import styles from './index.css';
// import animationStyle from '../../animation.css';

import ExploreCreateGroupButton from '../common/ExploreCreateGroupButton';
import SendPost from '../common/SendPost';
import FansFollow from '../common/FansFollow';
import UpdateCheckProfile from 'components/common/UpdateCheckProfile';
import PostList from '../common/PostList';
import Album from '../common/Album';
import AlbumDetails from '../common/AlbumDetails';
import { getCurrentUserId } from '../../models/session/selectors';
import { getUserData, followUser } from '../../models/users/actions';
import {
  getUserDataFromStore,
  getFollowListFromStore,
} from '../../models/users/selectors';
import { getUserAvatar } from '../../models/members/selectors';
import FollowBtn from '../common/Contacts/FollowBtn';
import { setFollowUserNotice } from '../../models/notification/actions.ts';
import closeNotice from './images/icons/icnNotificationBlueCopy@3x.png';
import openNotice from './images/icons/icnNotificationBlueCopy_2@3x.png';
import ModalLoading from '../common/UpdateCheckProfile/ModalLoading';

const initState = () => {
  return {
    userInfo: {},
    defaultActive: '',
    syncTs: Date.now(),
    isModal: false,
    scrollState: false,
    userAlbum: [],
    userAlbumCount: 0,
  };
};
class Persinalpanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = initState();
  }
  async componentDidMount() {
    const {
      dispatch,
      match,
      hideExploreCreateGroupActive,
      closeModle,
      userId,
      ownId,
    } = this.props;
    const seeUserId = get(match, 'params.id', ownId);
    // 获取个人相册
    const { data } = await dispatch({
      type: 'updatePersonalGroupInfo/getAlbumInfo',
      payload: {
        userId,
        seeUserId,
        rows: 5,
      },
    });
    this.setState({
      userAlbum: data.userAlbum,
      userAlbumCount: data.count,
    });
    hideExploreCreateGroupActive();
    dispatch(getUserData(get(match, 'params.id')));
    closeModle();
  }

  componentDidUpdate(prevProps) {
    const { dispatch, match } = this.props;
    const {
      userData,
      history: { push },
    } = prevProps;
    if (get(match, 'params.id') !== get(prevProps, 'match.params.id')) {
      dispatch(getUserData(get(match, 'params.id')));
    }
    if (userData && userData.inactive) {
      message.error('該用戶已註銷');
      push('/');
    }
  }

  setSyncTs = () => {
    this.setState({
      syncTs: Date.now(),
    });
  };

  openFansFollow = (active) => {
    this.setState({
      defaultActive: active,
      isModal: true,
    });
  };

  closeMoadle = () => {
    this.setState({
      isModal: false,
    });
  };
  //判斷當前登錄用戶對該用戶的追蹤狀態
  isFollowed = () => {
    const { ownFollowUserList, userId } = this.props;
    return ownFollowUserList.has(userId);
  };

  //追蹤/取消追蹤當前用戶
  toFollowUser = (follow) => {
    const { userId, dispatch } = this.props;
    dispatch(followUser(userId, follow));
  };

  //判斷當前登錄用戶與該用戶的相同群組

  //切換通知開關
  checkNotice = async (isNotice) => {
    const { dispatch, userId } = this.props;
    await dispatch(
      setFollowUserNotice({ followUserId: userId, isNotice: !isNotice })
    );
  };
  onScroll = (e) => {
    const scrollDom = this.scrollDom;
    let clientHeight = scrollDom.clientHeight,
      scrollTop = scrollDom.scrollTop,
      scrollHeight = scrollDom.scrollHeight;
    if (clientHeight + scrollTop === scrollHeight) {
      this.setState({
        scrollState: true,
      });
    } else {
      this.setState({
        scrollState: false,
      });
    }
  };
  showBg = () => {
    this.setState(
      {
        scrollState: false,
      },
      () => {
        const scrollDom = this.scrollDom;
        let clientHeight = scrollDom.clientHeight,
          // scrollTop = scrollDom.scrollTop,
          scrollHeight = scrollDom.scrollHeight;
        scrollDom.scrollTop = scrollHeight - clientHeight - 1;
      }
    );
  };

  render() {
    const {
      userId,
      match,
      ownId,
      userData,
      userAvatarUrl,
      loading,
      // startAnimation,
      albumVisible,
    } = this.props;
    const {
      defaultActive,
      syncTs,
      isModal,
      scrollState,
      userAlbum,
      userAlbumCount,
    } = this.state;
    const seeUserId = get(match, 'params.id', ownId);
    let isShow = true;
    if (match.params.id) {
      isShow = match.params.id === ownId ? true : false;
    }
    if (!userData) {
      return null;
    }
    //當前登錄用戶是否追蹤該用戶
    let isFollow = this.isFollowed();

    const {
      fullName,
      username,
      fansCount,
      followCount,
      indexSymbol,
      cover,
      title,
      isNotice,
      givenName,
    } = userData;
    const avatarUrl = userAvatarUrl;

    return (
      <div
        className={styles.Persinalpanels}
        ref={(ref) => (this.scrollDom = ref)}
        onScroll={this.onScroll}
      >
        {!scrollState && (
          <div
            className={`
                  ${styles.bgContainer}

                `}
          >
            {/* ${
                    startAnimation
                      ? animationStyle.hidePersonalMain
                      : animationStyle.showPersonalMain
                  } */}
            {/* 更换个人头像 */}
            <UpdateCheckProfile
              cover={{ group_avatarUrl: get(cover, 'url') }}
              showImageType="background"
              isUpdateUrl={Object.is(userId, ownId)}
              isGroupOrUser="personal"
            />
          </div>
        )}

        <div className={styles.personalContainer}>
          <div className={styles.personalAside}>
            <UpdateCheckProfile
              alt={fullName ? fullName[0] : '#'}
              size={190}
              src={avatarUrl}
              cover={{ group_avatarUrl: avatarUrl }}
              showImageType="head"
              isUpdateUrl={Object.is(userId, ownId)}
              isGroupOrUser="personal"
              headId={userId}
              scrollState={scrollState}
            />
            <div className={styles.InfoBox}>
              <p className={styles.avatarName}>
                {fullName && <span>{fullName}</span>}
                {username && <span>{username}</span>}
              </p>
              {title && <p className={styles.userPosition}>{title}</p>}
              <div className={styles.fansBox}>
                <span onClick={() => this.openFansFollow('fans')}>
                  <p>{fansCount}</p>
                  <p>粉絲人數</p>
                </span>
                <span
                  className={styles.beforeContent}
                  onClick={() => this.openFansFollow('follow')}
                >
                  <p>{followCount}</p>
                  <p>追蹤中</p>
                </span>
              </div>
            </div>
            {/* 追踪 button */}
            {!isShow && (
              <div className={styles.personalFollowBox}>
                <FollowBtn
                  followed={isFollow}
                  name={username}
                  type={'user'}
                  userId={seeUserId}
                ></FollowBtn>
                {/* 通知開關 */}
                <div className={styles.notice}>
                  <Popover
                    placement="bottom"
                    content={
                      <div className={styles.noticeIcon}>
                        <img
                          onClick={() => this.checkNotice(isNotice)}
                          src={isNotice ? openNotice : closeNotice}
                          alt=""
                        />
                      </div>
                    }
                    trigger="click"
                  >
                    <Button className={styles.noticeBtn}>通知</Button>
                  </Popover>
                </div>
              </div>
            )}

            {/* 建立群組/探索群組 button */}
            {isShow && (
              <div className={styles.personalTrackingBox}>
                <ExploreCreateGroupButton type="personal" />
              </div>
            )}
          </div>
          {userId && (
            <PostList
              scrollPage={true}
              scrollState={scrollState}
              showBg={this.showBg}
              pageType="user"
              type="user"
              userId={userId}
              syncTs={syncTs}
              setSyncTs={this.setSyncTs}
              postListHeader={
                <>
                  {
                    // isShow &&
                    <SendPost
                      id={ownId}
                      index_symbol={indexSymbol}
                      msg_text={
                        isShow ? '在想些什麼?' : `對${givenName}說點什麼吧`
                      }
                      head_text={isShow ? '新增動態' : '新增留言'}
                      setSyncTs={this.setSyncTs}
                      userPostType="user"
                      // 不是自己的主页的话就对其他人主页留言
                      leaveMessageUserId={isShow ? '' : userId}
                    />
                  }
                </>
              }
              albumSet={
                userAlbum.length > 0 && (
                  <Album albumInfo={userAlbum} albumCount={userAlbumCount} />
                )
              }
            />
          )}
          <div className={styles.personalAside}></div>
        </div>
        {/* 粉丝人数和追踪中弹出的组件 */}
        {
          <FansFollow
            defaultActive={defaultActive}
            userId={userId}
            seeUserId={seeUserId}
            visible={isModal}
            closeMoadle={this.closeMoadle}
          />
        }

        {// 顯示個人相冊所有圖片組件
        albumVisible && (
          <AlbumDetails userId={userId} seeUserId={seeUserId} type="user" />
        )}
        {loading && <ModalLoading />}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { match } = ownProps;
  const ownId = getCurrentUserId(state);
  const userId = get(match, 'params.id', ownId);
  const ownFollowUserList = getFollowListFromStore(state, ownId);
  return {
    userData: getUserDataFromStore(state, userId),
    userId,
    ownId,
    userAvatarUrl: getUserAvatar(state, userId),
    ownFollowUserList,
    loading: state.updatePersonalGroupInfo.get('loading'),
    startAnimation: state.posts.get('startAnimation'),
    albumVisible: state.updatePersonalGroupInfo.get('albumVisible'),
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    dispatch,
    hideExploreCreateGroupActive: () => {
      dispatch({
        type: 'updatePersonalGroupInfo/hideExploreCreateGroupActive',
      });
    },
    closeModle: () => {
      dispatch({
        type: 'postsPopup/postModalState',
        payload: {
          showPostPopup: false,
        },
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Persinalpanel);
