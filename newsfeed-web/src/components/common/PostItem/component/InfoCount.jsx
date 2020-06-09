import React, { PureComponent } from 'react';
import { Modal, Pagination } from 'antd';
import { withRouter } from 'dva/router';
import styles from './index.scss';
import { connect } from 'dva';
import FollowBtn from '../../Contacts/FollowBtn';
import UserAvatar from '../../UserAvatar';
import LikeEmojiList from './LikeEmojiList';

class InfoCount extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      commentVisible: false,
      fnVal: '',
      userLists: [],
      currentPage: 1, //點贊當前頁碼
      totalData: 0, //點贊數據總數
      pageSize: 8, //每頁顯示條數
      openLikeModal: false,
    };
  }

  //點擊留言人數
  showComments = () => {
    const { handleInputShow } = this.props;
    handleInputShow();
  };

  // commentCancel = () => {
  //   this.setState({
  //     commentVisible: false,
  //   });
  // };

  //點擊分享人數
  getUserList = (val) => {
    const { shareCount } = this.props;
    if (val === '分享') {
      this.setState(
        {
          totalData: shareCount ? shareCount : 1,
          visible: true,
          fnVal: val,
          currentPage: 1,
        },
        () => {
          this.getShareUser();
        }
      );
    }
  };

  //打开一级点赞modal
  openLikeEmojiList = () => {
    this.setState({
      openLikeModal: true,
    });
  };
  //关闭一级点赞modal
  closeEmojiList = () => {
    this.setState({
      openLikeModal: false,
    });
  };

  //獲取點贊用戶列表
  getLikeUser = async () => {
    const { pageSize, currentPage } = this.state;
    const { dispatch, targetType, postId } = this.props;
    let type = 0;
    if (targetType === 'post') {
      type = 0;
    } else if (targetType === 'vote') {
      type = 2;
    } else {
      type = 0;
    }

    let likeData = {
      targetId: postId,
      type,
      page: currentPage,
      rows: pageSize,
    };

    await dispatch({
      type: 'share/getLikeUser',
      payload: {
        ...likeData,
      },
    });
    const { NfUserList } = this.props;

    this.setState({
      userLists: NfUserList,
    });
  };

  //獲取分享用戶列表
  getShareUser = async () => {
    const { pageSize, currentPage } = this.state;
    const { dispatch, postId } = this.props;
    let shareData = {
      postId: postId,
      page: currentPage,
      rows: pageSize,
    };

    await dispatch({
      type: 'share/getShareUser',
      payload: {
        ...shareData,
      },
    });

    const { NfUserList } = this.props;
    this.setState({
      userLists: NfUserList,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
      userLists: [],
      currentPage: 1,
    });
  };

  //改變頁數
  changPage = (page, pageSize, fnVal) => {
    if (fnVal === '說讚') {
      this.setState(
        {
          currentPage: page,
        },
        () => {
          this.getLikeUser();
        }
      );
    }
    if (fnVal === '分享') {
      this.setState(
        {
          currentPage: page,
        },
        () => {
          this.getShareUser();
        }
      );
    }
  };

  render() {
    const { history } = this.props;
    const {
      visible,
      fnVal,
      currentPage,
      totalData,
      pageSize,
      userLists,
      // commentVisible,
      openLikeModal,
    } = this.state;
    const {
      userData,
      followedUsers,
      targetType,
      likeCount,
      shareCount,
      commentCount,
      ableToShare,
      postId,
    } = this.props;
    const { userId } = userData.toJS();

    return (
      <div className={styles.infoCountContainer}>
        <div>
          {/* <svg
            style={{ margin: '0 10px' }}
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
          >
            <path
              fill="#36485E"
              fillRule="evenodd"
              d="M0 11.973h2.129V4.81H0v7.163zM7.44 4.19h.35c1.012 0 2.023-.002 3.034 0 .675.003 1.063.377 1.147 1.124.067.602.026 1.187-.208 1.757a329.13 329.13 0 0 0-1.648 4.105c-.22.554-.583.82-1.136.816-1.506-.01-3.014-.025-4.52.007-.696.014-1.22-.567-1.208-1.344.033-1.971.016-3.944.008-5.916a1.358 1.358 0 0 1 .364-.974A562.077 562.077 0 0 0 6.92.126c.135-.15.239-.156.4-.069.69.372.96.978.757 1.793-.164.658-.358 1.308-.538 1.962-.03.11-.057.219-.099.379z"
            />
          </svg> */}
          <img
            className={styles.likeTitleIcon}
            src={require('../../../../assets/images/icon/praise.gif')}
            alt=""
          />
          <img
            className={styles.likeTitleIcon}
            src={require('../../../../assets/images/icon/laugh.gif')}
            alt=""
          />
          <img
            className={styles.likeTitleIcon}
            src={require('../../../../assets/images/icon/tongue.gif')}
            alt=""
          />
          <span
            className={styles.peopleCount}
            onClick={() => this.openLikeEmojiList()}
          >
            ···{likeCount || 0}個人說讚
          </span>
          {openLikeModal && (
            <LikeEmojiList
              openLikeModal={openLikeModal}
              postId={postId}
              targetType={targetType}
              likeCount={likeCount}
              closeEmojiList={this.closeEmojiList}
            />
          )}
        </div>
        <div>
          <span className={styles.peopleCount} onClick={this.showComments}>
            {commentCount || 0}個留言
          </span>
          {targetType === 'post' && ableToShare ? (
            <span
              className={styles.peopleCount}
              onClick={() => this.getUserList('分享')}
            >
              {' | '}
              {shareCount || 0}
              次分享
            </span>
          ) : (
            ''
          )}
        </div>
        {
          <Modal
            className={styles.userModal}
            title={fnVal + '列表'}
            visible={visible}
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
              {userLists.map((item) => {
                const { displayName } = item;
                const follow = followedUsers.has(item.userId);
                return (
                  <div
                    key={item.onlyKey}
                    className={styles.userDetail}
                    onClick={() => {
                      history.push(`/user/${item.userId}`);
                    }}
                  >
                    <div className={styles.userAvatar}>
                      <div className={styles.avatar}>
                        {/* <div className={styles.indexSymbol}>
                          {item.indexSymbol}
                        </div> */}
                        <UserAvatar size={36} userId={item.userId} />
                      </div>
                    </div>
                    <div className={styles.userName}>
                      <span>{item.displayName}</span>
                    </div>
                    <div className={styles.followDetail}>
                      {!(item.userId === userId) && (
                        <FollowBtn
                          followed={follow}
                          name={displayName}
                          type="user"
                          userId={item.userId}
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
                onChange={(page, pageSize) =>
                  this.changPage(page, pageSize, fnVal)
                }
              />
            </div>
          </Modal>
        }
        {
          // <Modal
          //   className={styles.userModal}
          //   title={'留言列表'}
          //   visible={commentVisible}
          //   onCancel={this.commentCancel}
          //   destroyOnClose={true}
          //   maskStyle={{
          //     WebkitBackdropFilter: 'blur(10px)',
          //     backdropFilter: 'blur(10px)',
          //     backgroundColor: 'rgba(255, 255, 255, 0.8)',
          //   }}
          //   footer={null}
          // >
          //   <div className={styles.userCommentBox}>
          //     <div className={styles.commentList}>
          //     </div>
          //   </div>
          //   <div className={styles.footerPage}></div>
          // </Modal>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  let userLists = state.share.get('userLists').toJS();
  return {
    NfUserList: userLists,
    followedUsers: state.users.get('ownFollowUserList'),
  };
}

export default connect(mapStateToProps)(withRouter(InfoCount));
