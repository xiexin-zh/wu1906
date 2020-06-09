import React, { Component } from 'react';
import { Modal, Input } from 'antd';
import { connect } from 'dva';
import propType from 'prop-types';
import styles from './index.scss';
import UserAvatar from '../../../../common/UserAvatar';
const { confirm } = Modal;
class RemoveMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setValue: '',
    };
  }
  delCheckbox = (member) => {
    const {
      removeGroupMember,
      groupDetails: { groupId },
      delGroupMember,
    } = this.props;
    const { username, id } = member;

    confirm({
      content: `是否移除${username}？`,
      okText: '是',
      cancelText: '否',
      title: '是否移除成員？',
      onOk: () => {
        removeGroupMember({
          groupId: groupId,
          memberUserId: id,
        }).then((res) => {
          delGroupMember(id, groupId);
        });
      },
    });
  };

  getList = () => {
    const { groupMemberIds, memberMap } = this.props;
    const { setValue } = this.state;
    let list = groupMemberIds;
    if (setValue) {
      list = groupMemberIds.filter((id) => {
        const member = memberMap.get(id);
        if (!member) {
          return false;
        }
        const searchIndexes = member.getSearchIndexes();
        return searchIndexes.some((value) => {
          return value.includes(setValue);
        });
      });
    }

    return list;
  };
  onChange = (e) => {
    this.setState({
      setValue: e.target.value,
    });
  };

  afterClose = () => {
    this.setState({
      setValue: '',
    });
  };

  render() {
    const { isshow, memberMap, onCancelRemove } = this.props;
    const { setValue } = this.state;
    // console.log(typeof memberMap );
    return (
      <Modal
        title={'移除成員'}
        visible={isshow}
        footer={null}
        onCancel={() => onCancelRemove()}
        className={styles.remove}
        afterClose={this.afterClose}
      >
        <div className={styles.wrapper}>
          <Input
            onChange={this.onChange}
            value={setValue}
            className={styles.search}
            placeholder="搜索"
          ></Input>

          {this.getList() &&
            this.getList().map((item) => {
              const member = memberMap.get(item);
              if (!member) {
                return null;
              }
              return (
                <div key={member.id} className={styles.removeList}>
                  <div className={styles.removeItem}>
                    <div>
                      <UserAvatar size={42} userId={member.id} />
                    </div>
                    <span className={styles.name}>
                      {member.username} {member.full_name}
                    </span>
                  </div>
                  <img
                    onClick={() => this.delCheckbox(member)}
                    className={styles.rec}
                    src={require('assets/images/icon/rec.png')}
                    alt=""
                  />
                </div>
              );
            })}
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const groupId = ownProps.groupDetails.groupId;
  return {
    groupMemberIds: state.groupInfo.getIn(['groupMember', groupId]),
    memberMap: state.members.get('memberMap'),
    groupMember: state.groupInfo.get('groupMember'),
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    removeGroupMember: ({ groupId, memberUserId }) => {
      return dispatch({
        type: 'groupOption/removeGroupMember',
        payload: {
          groupId,
          memberUserId,
        },
      });
    },
    delGroupMember: (memberUserId, groupId) => {
      return dispatch({
        type: 'groupInfo/delGroupMember',
        payload: {
          groupId,
          memberUserId,
        },
      });
    },
  };
}

RemoveMember.propType = {
  isshow: propType.bool.isRequired,
  onCancelRemove: propType.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveMember);
