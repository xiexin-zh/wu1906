import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import styles from './NoticeInfo.css';
import FormattedDate from '../../FormattedDate';
import UserAvatar from '../../UserAvatar';
import { Popover, Avatar } from 'antd';
import { followGroup } from '../../../../models/groupInfo/actions';
import { followUser } from '../../../../models/users/actions';

import { Modal } from 'antd';
import {
  noticeClickHandler,
  setReadStatus,
  changeFollow,
} from '../../../../models/notification/actions';
import MDLink from '../../MDLink';
import {
  getFollowListFromStore,
  getFollowGroupFromStore,
} from '../../../../models/users/selectors';
import { getCurrentUserId } from '../../../../models/session/selectors';
const { confirm } = Modal;

class NoticeInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  get isFollowed() {
    const { followGroup, followUser, noticeData } = this.props;
    const { groupId, userId, followType } = noticeData;
    if (followType === 'group' && followGroup.get(groupId)) {
      return true;
    } else if (followType === 'user' && followUser.get(userId)) {
      return true;
    }
    return false;
  }

  onVisibleChange = (visible) => {
    this.setState(
      {
        visible,
      },
      () => {
        const { setScrollSwitch } = this.props;
        setScrollSwitch(visible);
      }
    );
  };

  onClick = () => {
    const { noticeData, clickHandler, setVisible, setReadStatus } = this.props;
    clickHandler(noticeData);
    setVisible(false);
    const { noticeId, readStatus } = noticeData;
    if (!readStatus) {
      setReadStatus(noticeId, 1); // 標記已讀
    }
  };

  followHandler = (e) => {
    e.stopPropagation();
    const { noticeData, followHandler } = this.props;
    const { name, groupId, userId, noticeId } = noticeData;
    const params = {
      followed: this.isFollowed,
      groupId,
      userId,
      type: noticeData.followType,
      noticeId,
    };
    if (this.isFollowed) {
      confirm({
        title: '取消追蹤',
        content: `確認取消追蹤 ${name} 嗎？`,
        okText: '取消追蹤',
        cancelText: '取消',
        onOk() {
          followHandler(params);
        },
        onCancel() {
          console.info('Cancel');
        },
      });
    } else {
      followHandler(params);
    }
    this.onVisibleChange(false);
  };

  setReadStatus = (e) => {
    e.stopPropagation();
    const { noticeData, setReadStatus } = this.props;
    const { noticeId, readStatus } = noticeData;
    setReadStatus(noticeId, readStatus ? 0 : 1);
    this.onVisibleChange(false);
  };

  renderHeader = () => {
    const {
      noticeData,
      noticeData: {
        //  id,
        userId,
        avatarUrl,
        indexSymbol,
      },
    } = this.props;
    return (
      <div className={styles.avatarIconBox}>
        {noticeData.followType === 'group' ? (
          <Avatar src={avatarUrl} size={42}>
            {indexSymbol}
          </Avatar>
        ) : (
          <UserAvatar userId={userId} disable size={42} />
        )}
        {this.renderHeaderMark()}
      </div>
    );
  };

  renderContent = () => {
    const {
      noticeData,
      noticeData: { createTs, content },
    } = this.props;
    let { title, messageType } = noticeData;
    let newTitle = title;
    let type = '';
    let likeImg = '';
    if (title && messageType === 'like') {
      if (title.indexOf('心碎') > -1) {
        type = 'cry';
      } else if (title.indexOf('讚') > -1) {
        type = 'praise';
      } else if (title.indexOf('笑趴') > -1) {
        type = 'laugh';
      } else if (title.indexOf('哇') > -1) {
        type = 'shock';
      } else if (title.indexOf('大愛') > -1) {
        type = 'tongue';
      } else if (title.indexOf('怒') > -1) {
        type = 'anger';
      }

      newTitle = title
        .replace('心碎', '')
        .replace('讚', '')
        .replace('笑趴', '')
        .replace('哇', '')
        .replace('大愛', '')
        .replace('怒', '');
    }
    if (title && messageType === 'leave_message_like_notice') {
      if (title.indexOf('「心碎」') > -1) {
        type = 'cry';
      } else if (title.indexOf('「讚」') > -1) {
        type = 'praise';
      } else if (title.indexOf('「笑趴」') > -1) {
        type = 'laugh';
      } else if (title.indexOf('「哇」') > -1) {
        type = 'shock';
      } else if (title.indexOf('「大愛」') > -1) {
        type = 'tongue';
      } else if (title.indexOf('「怒」') > -1) {
        type = 'anger';
      }
      newTitle = title
        .replace('「心碎」', '')
        .replace('「讚」', '')
        .replace('「笑趴」', '')
        .replace('「哇」', '')
        .replace('「大愛」', '')
        .replace('「怒」', '');
    }
    likeImg = classnames({
      [styles.likeIcon]: true,
      [styles.cry]: type === 'cry',
      [styles.praise]: type === 'praise',
      [styles.laugh]: type === 'laugh',
      [styles.shock]: type === 'shock',
      [styles.tongue]: type === 'tongue',
      [styles.anger]: type === 'anger',
    });
    let showContent = false;
    if (
      messageType === 'reply' ||
      messageType === 'leave_message_share_notice' ||
      messageType === 'leave_message_comment_notice' ||
      messageType === 'like' ||
      messageType === 'leave_message_like_notice' ||
      messageType === 'vote_group_member'
    ) {
      showContent = false;
    } else {
      showContent = true;
    }
    return (
      <div className={styles.noticeContent}>
        <p className={styles.noticeTextBox}>
          {[
            <span className={styles.noticeTitle}>
              <MDLink
                text={newTitle}
                subStrLength={10}
                // 目前是需要调到用户首页就行了
                // disableClick
              />
            </span>,
            messageType === 'like' ||
            messageType === 'leave_message_like_notice' ? (
              <div className={likeImg}></div>
            ) : (
              ''
            ),
            content && showContent ? (
              <span className={styles.noticeMainContent}> : {content}</span>
            ) : null,
          ]}
        </p>
        <p className={styles.timeStyle}>
          <FormattedDate ts={createTs} />
        </p>
      </div>
    );
  };

  renderHeaderMark = () => {
    const { noticeData } = this.props;
    const { messageType } = noticeData;
    const noticeIcon = classnames({
      [styles.eachMarkIcon]: true,
      [styles.groupPost]:
        messageType === 'group_post' || messageType === 'group_invite_user',
      [styles.userPost]:
        messageType === 'personal_post' || messageType === 'follow',
      [styles.like]: messageType === 'like',
      [styles.share]: messageType === 'share',
      [styles.topPost]: messageType === 'group_post_top',
      [styles.reply]: messageType === 'reply',
      [styles.tag]: messageType === 'tag',
      [styles.follow]: ![
        'personal_post',
        'group_post',
        'like',
        'share',
        'reply',
        'tag',
        'group_post_top',
        'group_invite_user',
      ].includes(messageType),
    });
    return <div className={`${noticeIcon}`}></div>;
  };

  renderTootle = () => {
    const { noticeData } = this.props;
    const { readStatus, name } = noticeData;
    return (
      <div className={styles.noticeTool}>
        <div className={styles.tipIcon} onClick={this.setReadStatus}>
          <img src={require('../images/combined-shape.svg')} alt="" />
          <div className={styles.noticeButton}>
            {readStatus ? '標記通知' : '取消通知'}
          </div>
        </div>
        <div className={styles.tipIcon} onClick={this.followHandler}>
          <img src={require('../images/fill-1.svg')} alt="" />
          <div className={styles.noticeButton}>
            {this.isFollowed ? '取消追蹤' : '追蹤'}{' '}
            {name.length > 12 ? `${name.substring(0, 12)}...` : name}
          </div>
        </div>
      </div>
    );
  };

  renderExpandFunctionality = () => {
    const { visible } = this.state;
    return (
      <Popover
        content={this.renderTootle()}
        // title="Title"
        trigger="click"
        placement="right"
        visible={visible}
        arrowPointAtCenter
        onVisibleChange={this.onVisibleChange}
      >
        <div
          className={`${styles.moreBlue} ${styles.eachNoticeIcon}`}
          onClick={(e) => e.stopPropagation()}
        ></div>
      </Popover>
    );
  };
  render() {
    const {
      noticeData: { readStatus },
    } = this.props;
    return (
      <div
        className={`${styles.noticeInfoBox} ${readStatus ? '' : styles.unread}`}
        onClick={this.onClick}
      >
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderExpandFunctionality()}
      </div>
    );
  }
}
NoticeInfo.propTypes = {};
function mapStateToProps(state) {
  const userId = getCurrentUserId(state);
  return {
    followGroup: getFollowGroupFromStore(state, userId),
    followUser: getFollowListFromStore(state, userId),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    followHandler: ({ type, groupId, userId, followed, noticeId }) => {
      if (type === 'group') {
        let isNoticeInfo = true;
        return dispatch(followGroup(groupId, !followed, isNoticeInfo)).then(
          (result) => {
            return dispatch(changeFollow(noticeId, !followed));
          }
        );
      } else {
        return dispatch(followUser(userId, !followed)).then((result) => {
          return dispatch(changeFollow(noticeId, !followed));
        });
      }
    },
    setReadStatus: (noticeId, state) => {
      dispatch(setReadStatus(noticeId, state));
    },
    clickHandler: (message) => {
      dispatch(noticeClickHandler(message));
    },
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoticeInfo);
