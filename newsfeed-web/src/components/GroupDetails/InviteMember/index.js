import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Modal, Button, message } from 'antd';
import { connect } from 'dva';
import { Set } from 'immutable';
import memoize from 'memoize-one';
import styles from './InviteMember.scss';
import { identitySet } from '../../../models/defines/GroupDetails';
import AddressBook from '../../common/Address/AddressBook';
import Member from '../../common/Contacts/Member';
import { inviteUsers } from '../../../models/groupInfo/actions';

const { TabPane } = Tabs;

class InviteMember extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
      activeKey: '1',
      isLoading: false,
    };
  }

  onChange = (activeKey) => {
    this.setState({
      activeKey,
    });
  };

  chengeChecked = (event) => {
    const user_id = event.target.value;
    const checkedList = [...this.state.checkedList];
    const index = checkedList.indexOf(user_id);
    if (index === -1) {
      checkedList.push(user_id);
    } else {
      checkedList.splice(index, 1);
    }
    this.setState({
      checkedList,
    });
  };

  filter = memoize((members, groupMemberList, invitingUserList) => {
    return members.filter(
      (member) =>
        !groupMemberList.has(member.id) && !invitingUserList.has(member.id)
    );
  });

  inviteMember = () => {
    if (this.state.isLoading) {
      return false;
    }
    this.setState({
      isLoading: true,
    });
    const { inviteMember, onCancel } = this.props;
    const { checkedList } = this.state;
    if (checkedList.length === 0) {
      message.error('請選擇要邀請的用戶');
      return;
    }
    inviteMember(checkedList).then(() => {
      onCancel();
    });
  };

  renderSubmitBtn = () => {
    return <Button onClick={this.inviteMember}>完成</Button>;
  };

  //modal销毁后，清空checkedList，不保留已有选项
  modalClose = () => {
    this.setState({
      checkedList: [],
      isLoading: false,
    });
  };

  render() {
    const {
      onClick,
      memberMap,
      groupMemberList,
      invitingUserList,
      group,
      visible,
      onCancel,
    } = this.props;
    const { checkedList, activeKey } = this.state;
    const canInviteList = this.filter(
      memberMap,
      groupMemberList,
      invitingUserList
    );
    return (
      <Modal
        visible={visible}
        footer={activeKey === '2' ? null : this.renderSubmitBtn()}
        onCancel={onCancel}
        className={styles.modalContent}
        title={'邀請成員'}
        destroyOnClose={true}
        // zIndex={1001}
        afterClose={this.modalClose}
      >
        <div className={`${styles.modalContent}`}>
          <Tabs type="card" onChange={this.onChange} activeKey={activeKey}>
            <TabPane tab="待邀請" key="1">
              <div className={styles.userBox}>
                <AddressBook
                  memberList={canInviteList}
                  multiple={true}
                  checkedList={checkedList}
                  onChange={this.chengeChecked}
                  // onClick={onClick}
                />
              </div>
            </TabPane>
            <TabPane tab="已邀請" key="2">
              <div className={styles.userBox}>
                <AddressBook
                  showList={groupMemberList.concat(invitingUserList)}
                  onClick={onClick}
                  renderItem={(item) => {
                    const { id } = item;
                    return (
                      <Member
                        id={id}
                        itemHeight={42}
                        member={item}
                        inviting={invitingUserList.has(id) || null}
                        groupId={group.groupId}
                      />
                    );
                  }}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
InviteMember.propTypes = {
  group: PropTypes.shape({
    follow: PropTypes.bool,
    groupFollowCount: PropTypes.number,
    groupId: PropTypes.string,
    groupMemberCount: PropTypes.number,
    identity: PropTypes.oneOf(identitySet),
    indexSymbol: PropTypes.string,
    isNotice: PropTypes.bool,
    isPreset: PropTypes.bool,
    isPublic: PropTypes.bool,
  }).isRequired,
};

function mapStateToProps(state, ownProps) {
  const {
    group: { groupId },
  } = ownProps;
  return {
    memberMap: state.members.get('memberMap'),
    groupMemberList: state.groupInfo.getIn(['groupMember', groupId], Set([])),
    invitingUserList: state.groupInfo.getIn(['invitingUser', groupId], Set([])),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const {
    group: { groupId },
  } = ownProps;
  return {
    inviteMember: (memberIds) => {
      return dispatch(inviteUsers(groupId, memberIds));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteMember);
