import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'dva';
import get from 'lodash/get';
import { injectIntl } from 'react-intl';
import styles from './index.css';
import animationStyle from '../../animation.css';

import SendPost from '../common/SendPost';
import Album from '../common/Album';
import AlbumDetails from '../common/AlbumDetails';

import {
  getGroupDetails,
  closeCurrentGroup,
  joinGroup,
  noAcceptGroupInvite,
  leaveGroup,
} from '../../models/groupInfo/actions';
import GroupInfo from './GroupInfo';
import PostList from '../common/PostList';
import UpdateCheckProfile from '../common/UpdateCheckProfile';
import { Button, message } from 'antd';
import { removeInvite } from '../../models/notification/actions';
import FormattedText from '../common/FormattedText';
import { getGroupDetail } from '../../models/groupInfo/selectors';
import { stringify } from 'querystring';

class GroupDetails extends React.Component {
  static propTypes = {
    groupId: PropTypes.string,
    getGroupDetails: PropTypes.func.isRequired,
    closeCurrentGroup: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      syncTs: Date.now(),
      scrollState: false,
      groupAlbum: [],
      groupAlbumCount: 0,
    };
  }

  async componentDidMount() {
    const {
      getGroupDetails,
      match,
      location,
      closeModle,
      dispatch,
    } = this.props;
    const groupId = get(match, 'params.groupId');
    const queryParam = queryString.parse(location.search);
    getGroupDetails({ groupId, invite: queryParam.inviteId ? 1 : 0 });
    closeModle();

    // 获取群组相册
    const { data } = await dispatch({
      type: 'updatePersonalGroupInfo/getGroupAlbumInfo',
      payload: {
        groupId,
        size: 5,
      },
    });
    this.setState({
      groupAlbum: data.groupAlbum,
      groupAlbumCount: data.count,
    });
  }

  componentDidUpdate(prevProps) {
    const prevGroupId = get(prevProps, 'match.params.groupId');
    const {
      getGroupDetails,
      match,
      otherNoticeList,
      newNoticeCount,
      history,
    } = this.props;
    const groupId = get(match, 'params.groupId');
    if (groupId !== prevGroupId) {
      getGroupDetails({ groupId });
    }
    if (newNoticeCount !== prevProps.newNoticeCount) {
      const cancelInviteUser = otherNoticeList.filter((item) => {
        return item.messageType === 'cancel_invite_user';
      });

      for (const iterator of cancelInviteUser) {
        if (iterator.groupId === groupId) {
          message.info('該群組已取消邀請');
          history.push('/groups');
        }
      }
    }
  }

  componentWillUnmount() {
    const { closeCurrentGroup } = this.props;
    closeCurrentGroup();
  }

  setSyncTs = () => {
    this.setState({
      syncTs: Date.now(),
    });
  };

  joinGroup = async () => {
    const {
      match,
      joinGroup,
      getGroupDetails,
      removeInvite,
      location,
      history,
    } = this.props;
    const groupId = get(match, 'params.groupId');
    const queryParam = queryString.parse(location.search);
    await joinGroup(groupId).then((result) => {
      if (result) {
        getGroupDetails({ groupId });
        removeInvite(queryParam.inviteId);
      }
    });
    history.push(`/groups/${groupId}`);
  };

  leaveGroup = () => {
    const { match, history, leaveGroup } = this.props;
    const groupId = get(match, 'params.groupId');
    leaveGroup(groupId).then((result) => {
      if (result) {
        history.push(`/`);
        message.info('成功退出群組');
      }
    });
  };

  noAcceptGroupInvite = () => {
    const {
      match,
      noAcceptGroupInvite,
      history,
      removeInvite,
      location,
    } = this.props;
    const queryParam = queryString.parse(location.search);
    const groupId = get(match, 'params.groupId');
    noAcceptGroupInvite(groupId);
    history.push('/');
    removeInvite(queryParam.inviteId);
  };
  showPostList = () => {
    const { groupDetails } = this.props;
    if (!groupDetails.isPublic && !groupDetails.isGroupMember) {
      return false;
    }
    return true;
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
      match,
      groupDetails,
      userData,
      intl,
      location,
      startAnimation,
      albumVisible,
    } = this.props;
    const groupId = get(match, 'params.groupId');
    const { syncTs, scrollState, groupAlbum, groupAlbumCount } = this.state;
    const { indexSymbol, userId } = userData.toJS();
    const { avatarUrl: group_avatarUrl, identity } = groupDetails;
    const queryParam = queryString.parse(location.search);
    const inviteId = queryParam.inviteId;
    const isInvited = inviteId && !groupDetails.isGroupMember;
    /**群組
     * /// 用戶在該群組的身份 欄位：identity
     * 1:普通用戶
     * 2:群組粉絲
     * 3:群組普通成員
     * 4:群組管理員
     * 5:群組高級管理員（可將添加群組管理員）
     */
    return (
      <div
        onScroll={this.onScroll}
        className={styles.detailsContent}
        ref={(ref) => (this.scrollDom = ref)}
      >
        {!scrollState && (
          <div
            className={`
                    ${styles.bgContainer}
                    ${
                      startAnimation
                        ? animationStyle.hidePersonalMain
                        : animationStyle.showPersonalMain
                    }
                  `}
          >
            <UpdateCheckProfile
              cover={{ group_avatarUrl }}
              showImageType={'background'}
              isUpdateUrl={Object.is(identity, 4) || Object.is(identity, 5)}
              isGroupOrUser="group"
              currentGroupInfo={groupDetails}
              headId={groupId}
            />
          </div>
        )}

        <div className={styles.personalContainer}>
          <div className={styles.personalAside}>
            {/* 群被刪除後再點擊通知裡面的邀請進入，將看不到GroupInfo面板 */}
            {stringify(groupDetails.toJS()) !== '' && (
              <GroupInfo
                scrollState={scrollState}
                groupDetails={groupDetails}
                groupId={groupId}
                userId={userId}
                isInvited={isInvited}
                leaveGroup={this.leaveGroup}
                getGroupDetails={getGroupDetails}
              />
            )}
          </div>
          <div className={styles.centerBox}>
            {isInvited && (
              <div className={styles.buttonBox}>
                <Button className={styles.button} onClick={this.joinGroup}>
                  <FormattedText
                    id="Group.acceptingInvitation"
                    defaultMessage="接受邀請"
                  />
                </Button>
                <Button
                  className={styles.button}
                  onClick={this.noAcceptGroupInvite}
                >
                  <FormattedText
                    id="Group.refuseInvitation"
                    defaultMessage="不接受邀請"
                  />
                </Button>
              </div>
            )}
            {groupId && this.showPostList() && (
              <PostList
                showBg={this.showBg}
                scrollState={scrollState}
                type="group"
                groupId={groupId}
                syncTs={syncTs}
                openComment={groupDetails.permissionCreateComment}
                setSyncTs={this.setSyncTs}
                postListHeader={
                  <>
                    {groupDetails.permissionCreatePost && (
                      <SendPost
                        groupType={groupId}
                        id={userId}
                        currentGroup={groupDetails}
                        index_symbol={indexSymbol}
                        msg_text={intl.formatMessage({ id: 'Post.leaveWord' })}
                        head_text={intl.formatMessage({ id: 'Post.addNew' })}
                        setSyncTs={this.setSyncTs}
                      />
                    )}
                  </>
                }
                albumSet={
                  groupAlbum.length > 0 && (
                    <Album
                      albumInfo={groupAlbum}
                      albumCount={groupAlbumCount}
                    />
                  )
                }
              />
            )}
          </div>

          <div style={{ flex: '0 0 280px' }}></div>
        </div>
        {// 顯示個人相冊所有圖片組件
        albumVisible && <AlbumDetails groupId={groupId} type="group" />}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { match } = ownProps;
  const groupId = get(match, 'params.groupId');
  return {
    userData: state.users.get('ownInfo'),
    groupDetails: getGroupDetail(state, groupId),
    startAnimation: state.posts.get('startAnimation'),
    otherNoticeList: state.notification.get('otherNoticeList'),
    newNoticeCount: state.notification.get('newNoticeCount'),
    albumVisible: state.updatePersonalGroupInfo.get('albumVisible'),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    dispatch,
    getGroupDetails: ({ invite, noticeId, groupId }) =>
      dispatch(getGroupDetails(groupId, invite, noticeId)),
    closeCurrentGroup: () => dispatch(closeCurrentGroup()),
    joinGroup: (groupId) => dispatch(joinGroup(groupId)),
    noAcceptGroupInvite: (groupId) => dispatch(noAcceptGroupInvite(groupId)),
    removeInvite: (noticeId) => dispatch(removeInvite(noticeId)),
    leaveGroup: (groupId) => {
      return dispatch(leaveGroup(groupId));
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
)(injectIntl(GroupDetails));
