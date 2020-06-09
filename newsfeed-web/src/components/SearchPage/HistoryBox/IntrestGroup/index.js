import React from 'react';
import styles from './index.scss';
import { connect } from 'dva';
import GroupAvatar from '../../../common/GroupAvatar';
import { followGroup } from '../../../../models/groupInfo/actions';
import { Modal } from 'antd';
const { confirm } = Modal;

class IntrestGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  followClick = (groupId, follow) => {
    if (follow) {
      confirm({
        title: '取消追蹤?',
        okText: '確定',
        cancelText: '取消',
        onOk: () => {
          this.changeFollow(groupId, false);
        },
      });
    } else {
      this.changeFollow(groupId, true);
    }
  };

  changeFollow = async (groupId, follow) => {
    const { dispatch } = this.props;
    const res = await dispatch(followGroup(groupId, follow));
    if (res) {
      dispatch({
        type: 'search/changeGroupFollow',
        payload: {
          groupId,
          follow,
        },
      });
    }
  };

  clickItem = (groupId) => {
    this.props.history.push(`/groups/${groupId}`);
  };

  getInterestGroup = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'search/getInterestGroup',
    });
  };

  componentDidMount() {
    this.getInterestGroup();
  }

  render() {
    const { interestGroups } = this.props;
    return (
      <div className={styles.interestGroup}>
        <div className={styles.title}>
          <span className={styles.tip}>你可能感興趣的群</span>
        </div>
        <div className={styles.groupList}>
          {interestGroups &&
            interestGroups.length > 0 &&
            interestGroups.slice(0, 20).map((item) => {
              const { groupId, groupName, follow } = item;
              return (
                <div className={styles.groupItem} key={groupId}>
                  <div className={styles.groupAvatar}>
                    <GroupAvatar size={36} groupId={groupId}></GroupAvatar>
                  </div>
                  <div
                    className={styles.groupName}
                    onClick={() => this.clickItem(groupId)}
                  >
                    <span className={styles.givenName}>
                      {groupName
                        ? groupName.length > 50
                          ? groupName.slice(0, 50) + '...'
                          : groupName
                        : ''}
                    </span>
                  </div>
                  <div className={styles.followBtn}>
                    <span
                      className={follow ? styles.followed : styles.nofollow}
                      onClick={() => this.followClick(groupId, follow)}
                    >
                      {follow ? '追踪中' : '追踪'}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    interestGroups: state.search.interestGroups,
  };
}
export default connect(mapStateToProps)(IntrestGroup);
