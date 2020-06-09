import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import PropTypes from 'prop-types';
import { Modal, Pagination } from 'antd';
import UserAvatar from '../../../UserAvatar';
import FollowBtn from '../../../Contacts/FollowBtn';
import { getCurrentUserId } from '../../../../../models/session/selectors';
import { getEmojiLikeList } from '../../../../../models/share/action';

import styles from './index.scss';

class LikeEmojiList extends PureComponent {
  constructor() {
    super();
    this.state = {
      NfUserList: [],
      currentPage: 1, //點贊當前頁碼
      totalData: 0, //點贊數據總數
      pageSize: 8, //每頁顯示條數
      IconTypeCount: [],
      iconList: [
        {
          iconType: 1,
          icon: require('../../../../../assets/images/icon/praise.gif'),
        },
        {
          iconType: 2,
          icon: require('../../../../../assets/images/icon/laugh.gif'),
        },
        {
          iconType: 3,
          icon: require('../../../../../assets/images/icon/tongue.gif'),
        },
        {
          iconType: 4,
          icon: require('../../../../../assets/images/icon/shock.gif'),
        },
        {
          iconType: 5,
          icon: require('../../../../../assets/images/icon/cry.gif'),
        },
        {
          iconType: 6,
          icon: require('../../../../../assets/images/icon/anger.gif'),
        },
      ],
      tabActive: 0,
    };
  }

  //關閉列表
  handleCancel = () => {
    const { closeEmojiList } = this.props;
    closeEmojiList();
  };

  //翻頁
  changPage = (page) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getLikeUserList({
          iconType: 0,
          page,
        });
      }
    );
  };

  //獲取點贊列表
  getLikeUserList = async ({ iconType, page }) => {
    const { dispatch, postId, targetType } = this.props;
    let type = 0;
    if (targetType === 'post') {
      type = 0;
    }
    if (targetType === 'vote') {
      type = 2;
    }
    let rqData = {
      iconType,
      targetId: postId,
      type,
      page,
      rows: 8,
    };

    let likeUserData = await dispatch(
      getEmojiLikeList({
        ...rqData,
      })
    );
    if (likeUserData.code === '200') {
      const { NfUserList, IconTypeCount, count } = likeUserData.data;
      this.setState({
        NfUserList,
        IconTypeCount,
        totalData: count,
      });
    }
  };

  filterArray = (arr, type) => {
    if (arr.length === 0) {
      return 0;
    }
    const newArr = arr.filter((item) => {
      return item.iconType === type;
    });
    if (newArr.length === 0) {
      return 0;
    }
    return newArr[0].iconCount;
  };

  tabClick = (iconType) => {
    this.setState({
      tabActive: iconType,
      currentPage: 1,
    });
    this.getLikeUserList({
      iconType,
      page: 1,
    });
  };

  componentDidMount() {
    this.getLikeUserList({ iconType: 0, page: 1 });
  }

  render() {
    const {
      openLikeModal,
      followedUsers,
      history,
      selfUserId,
      likeCount,
    } = this.props;
    const {
      currentPage,
      totalData,
      pageSize,
      IconTypeCount,
      iconList,
      tabActive,
      NfUserList,
    } = this.state;
    return (
      <Modal
        className={styles.userModal}
        title={'說讚列表'}
        visible={openLikeModal}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        maskStyle={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        footer={null}
      >
        <div className={styles.emojiLikeBox}>
          <div className={styles.likeTab}>
            <div
              className={styles.tabList}
              style={{ color: tabActive === 0 ? 'blue' : '#778899' }}
              onClick={() => this.tabClick(0)}
            >
              全部 ({likeCount})
            </div>
            {iconList.map((list) => {
              return (
                <div
                  style={{
                    color: tabActive === list.iconType ? 'blue' : '#778899',
                  }}
                  className={styles.tabList}
                  key={list.iconType}
                  onClick={() => this.tabClick(list.iconType)}
                >
                  <img src={list.icon} alt="" />
                  <span>{this.filterArray(IconTypeCount, list.iconType)}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.listBox}>
            {NfUserList.length > 0 &&
              NfUserList.map((item) => {
                const { userId, fullName, givenName } = item;
                const follow = followedUsers.has(userId);
                return (
                  <div
                    key={userId}
                    className={styles.userDetail}
                    onClick={() => {
                      history.push(`/user/${userId}`);
                    }}
                  >
                    <div className={styles.userAvatar}>
                      <div className={styles.avatar}>
                        <UserAvatar size={36} userId={userId} />
                      </div>
                    </div>
                    <div className={styles.userName}>
                      <span>{fullName || ''}</span>
                      <span>{givenName || ''}</span>
                    </div>
                    <div className={styles.followDetail}>
                      {!(userId === selfUserId) && (
                        <FollowBtn
                          followed={follow}
                          name={fullName || givenName}
                          type="user"
                          userId={userId}
                          buttonClassName={
                            follow ? styles.followBtn : styles.followActive
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className={styles.pagination}>
            <Pagination
              simple
              defaultCurrent={currentPage}
              total={totalData}
              pageSize={pageSize}
              onChange={(page) => this.changPage(page)}
              current={totalData === 0 ? 0 : currentPage}
              hideOnSinglePage={true}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

LikeEmojiList.propTypes = {
  openLikeModal: PropTypes.bool,
  closeEmojiList: PropTypes.func,
  postId: PropTypes.string,
  type: PropTypes.number,
  likeCount: PropTypes.number,
};

function mapStateToProps(state) {
  return {
    followedUsers: state.users.get('ownFollowUserList'),
    selfUserId: getCurrentUserId(state),
  };
}

export default connect(mapStateToProps)(withRouter(LikeEmojiList));
