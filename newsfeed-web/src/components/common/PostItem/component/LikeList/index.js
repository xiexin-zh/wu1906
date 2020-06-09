import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import PropTypes from 'prop-types';
import { Modal, Pagination } from 'antd';
import UserAvatar from '../../../UserAvatar';
import FollowBtn from '../../../Contacts/FollowBtn';
import { getCurrentUserId } from '../../../../../models/session/selectors';

import styles from './index.scss';

class LikeList extends PureComponent {
  constructor() {
    super();
    this.state = {
      userLists: [],
      currentPage: 1, //點贊當前頁碼
      totalData: 0, //點贊數據總數
      pageSize: 8, //每頁顯示條數
    };
  }

  //關閉列表
  handleCancel = () => {
    const { cancelList } = this.props;
    cancelList();
  };

  //翻頁
  changPage = (page) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getLikeList();
      }
    );
  };

  //獲取點贊列表
  getLikeList = async () => {
    const { targetId, type, dispatch, likeCount } = this.props;
    this.setState({
      totalData: likeCount,
    });
    const { currentPage, pageSize } = this.state;
    let likeData = {
      targetId,
      type,
      page: currentPage,
      rows: pageSize,
    };

    const likeUserList = await dispatch({
      type: 'share/getLikeUser',
      payload: {
        ...likeData,
      },
    });

    if (likeUserList.code === '200') {
      const { NfUserList } = likeUserList.data;
      this.setState({
        userLists: NfUserList,
      });
    }
  };

  componentDidMount() {
    this.getLikeList();
  }

  render() {
    const { isOpenList, followedUsers, history, selfUserId } = this.props;
    const { currentPage, totalData, pageSize, userLists } = this.state;
    return (
      <Modal
        className={styles.userModal}
        title={'說讚列表'}
        visible={isOpenList}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        maskStyle={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        footer={null}
      >
        <div className={styles.userListsBox}>
          {userLists.length > 0 &&
            userLists.map((item) => {
              const { displayName, userId } = item;
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
                    <span>{item.displayName}</span>
                  </div>
                  <div className={styles.followDetail}>
                    {!(userId === selfUserId) && (
                      <FollowBtn
                        followed={follow}
                        name={displayName}
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
        <div className={styles.footerPage}>
          <Pagination
            simple
            defaultCurrent={currentPage}
            total={totalData}
            pageSize={pageSize}
            onChange={(page) => this.changPage(page)}
          />
        </div>
      </Modal>
    );
  }
}

LikeList.propTypes = {
  isOpenList: PropTypes.bool,
  cancelList: PropTypes.func,
  targetId: PropTypes.string,
  type: PropTypes.number,
  likeCount: PropTypes.number,
};

function mapStateToProps(state) {
  let userLists = state.share.get('userLists').toJS();
  return {
    userLists,
    followedUsers: state.users.get('ownFollowUserList'),
    selfUserId: getCurrentUserId(state),
  };
}

export default connect(mapStateToProps)(withRouter(LikeList));
