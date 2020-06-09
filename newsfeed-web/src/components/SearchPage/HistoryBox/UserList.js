import React from 'react';
import styles from './index.scss';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import UserAvatar from '../../common/UserAvatar';
import { followUser } from '../../../models/users/actions';
import { Modal } from 'antd';
const { confirm } = Modal;

class UserList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  followClick = (userId, follow) => {
    if (follow) {
      confirm({
        title: '取消追蹤?',
        okText: '確定',
        cancelText: '取消',
        onOk: () => {
          this.changeFollow(userId, false);
        },
      });
    } else {
      this.changeFollow(userId, true);
    }
  };

  changeFollow = async (userId, follow) => {
    const { dispatch } = this.props;
    const res = await dispatch(followUser(userId, follow));
    if (res.code === '200') {
      dispatch({
        type: 'search/changeUserFollow',
        payload: {
          userId,
          follow,
        },
      });
    }
  };

  clickItem = (userId) => {
    this.props.history.push(`/user/${userId}`);
  };

  render() {
    const { userList } = this.props;
    return (
      <div className={styles.userList}>
        {userList &&
          userList.length > 0 &&
          userList.map((item) => {
            const { userId, givenName, fullName, follow } = item;
            return (
              <div className={styles.userItem} key={userId}>
                <div className={styles.userAvatar}>
                  <UserAvatar size={36} userId={userId}></UserAvatar>
                </div>
                <div
                  className={styles.userName}
                  onClick={() => this.clickItem(userId)}
                >
                  <span className={styles.givenName}>{givenName || ''}</span>
                  <span>{fullName || ''}</span>
                </div>
                <div className={styles.followBtn}>
                  <span
                    className={follow ? styles.followed : styles.nofollow}
                    onClick={() => this.followClick(userId, follow)}
                  >
                    {follow ? '追踪中' : '追踪'}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}
export default withRouter(connect(mapStateToProps)(UserList));
