import React from 'react';
import { connect } from 'dva';
import { Set } from 'immutable';
import { FormattedMessage } from 'react-intl';

import Address from 'components/common/Address';
import styles from './PeopleTagger.css';
import { getGroupMembers } from '../../../models/groupInfo/actions';
import { getCurrentUserId } from '../../../models/session/selectors';
import { message, Spin } from 'antd';

class PeopleTagger extends React.Component {
  constructor(props) {
    super(props);
    const defaultCheckedList = props.defaultCheckedList;
    this.state = {
      checkedList: defaultCheckedList || [],
      defaultCheckedList: defaultCheckedList || [],
      checkedItemId: '',
      loading: false,
    };
    this.saveTagger = this.saveTagger.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  componentDidMount() {
    const { groupId, getGroupMembers } = this.props;
    if (groupId) {
      this.setState({
        loading: true,
      });
      getGroupMembers(groupId).then((result) => {
        if (result) {
          this.setState({
            loading: false,
          });
        } else {
          message.warn('群組成員數據獲取失敗，請關閉彈窗重新嘗試');
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { groupId, getGroupMembers, show } = this.props;
    if (groupId !== prevProps.groupId || (show && !prevProps.show)) {
      this.setState({
        checkedList: [],
      });
      if (groupId) {
        this.setState({
          loading: true,
        });
        getGroupMembers(groupId).then((result) => {
          if (result) {
            this.setState({
              loading: false,
            });
          } else {
            message.warn('群組成員數據獲取失敗，請關閉彈窗重新嘗試');
          }
        });
      }
    }
  }

  saveTagger() {
    const { checkedList } = this.state;
    const { onCancel, saveTagger } = this.props;
    // TODO
    saveTagger(checkedList);
    onCancel();
  }

  selectItem(e) {
    const target = e.target;
    const checked = target.checked;
    const id = target.value;
    const { checkedList } = this.state;
    const newCheckedList = checked
      ? checkedList.concat(id)
      : checkedList.filter((item) => item !== id);
    if (newCheckedList.length > 50) {
      message.info('最多標註49人!');
      return;
    }
    this.setState({
      checkedList: newCheckedList,
    });
  }

  render() {
    const {
      // filter,
      groupId,
      groupMemberIds,
      followedUsers,
      onCancel,
      // currentUserId,
      isEditPost,
      defaultCheckedList,
    } = this.props;
    const { loading, checkedList } = this.state;
    // 需求要群组里面可以标记自己
    const filterdGroupMemberIds = groupMemberIds;
    //创建帖子是否选择了标记人名
    const createHasTagger = !isEditPost && checkedList.length > 0;
    //编辑帖子是否选择了标记人名
    const editHasTagger =
      (isEditPost && defaultCheckedList.length > 0) || checkedList.length > 0;
    // .filter(
    //   (id) => id !== currentUserId
    // );
    if (loading) {
      return (
        <div className={`${styles.dialogueBox}`}>
          <div className="loading-wrapper">
            <Spin tip="Loading..."></Spin>
          </div>
        </div>
      );
    }
    return (
      <div className={`${styles.dialogueBox}`}>
        <div className={styles.determine}>
          <span onClick={onCancel}>
            <FormattedMessage id="Dialogue.Cancel" />
          </span>
          {isEditPost ? (
            <span
              onClick={editHasTagger ? this.saveTagger : null}
              className={editHasTagger ? '' : styles.okBtn}
            >
              <FormattedMessage id="Dialogue.Finish" />
            </span>
          ) : (
            <span
              onClick={createHasTagger ? this.saveTagger : null}
              className={createHasTagger ? '' : styles.okBtn}
            >
              <FormattedMessage id="Dialogue.Finish" />
            </span>
          )}
        </div>
        <div className={styles.scrollBoxs}>
          {/* <Address
            multiple={false}
            onClick={(id) => this.setState({ checkedItemId: id })}
            checkedItemId={this.state.checkedItemId}
          /> */}
          <Address
            key={groupId}
            showList={groupId ? filterdGroupMemberIds : followedUsers}
            onChange={this.selectItem}
            checkedList={this.state.checkedList}
          />
        </div>
      </div>
    );
  }
}

PeopleTagger.propTypes = {};

function mapStateToProps(state, { groupId }) {
  return {
    // memberMap: state.members.get('memberMap'),
    followedUsers: state.users.get('ownFollowUserList'),
    groupMemberIds: state.groupInfo.getIn(['groupMember', groupId], Set([])),
    currentUserId: getCurrentUserId(state),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getGroupMembers: (groupId) => dispatch(getGroupMembers(groupId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PeopleTagger);
