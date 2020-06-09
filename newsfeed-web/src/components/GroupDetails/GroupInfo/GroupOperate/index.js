import React from 'react';
// import PropTypes from 'prop-types';

import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { Menu, Dropdown, Button, message } from 'antd';
import styles from './index.scss';
import FollowBtn from '../../../common/Contacts/FollowBtn';
import { applyJoinOrCancelGroup } from '../../../../models/groupOption/action';
import { getGroupDetail } from '../../../../models/groupInfo/selectors';

class GroupOperate extends React.Component {
  clickJoin = async () => {
    const { groupId, dispatch, groupDetails } = this.props;
    const { applicantStatus } = groupDetails;
    let res = await dispatch(
      applyJoinOrCancelGroup({
        groupId,
        cancelOrJoin: applicantStatus === 1 ? false : true,
      })
    );
    if (res) {
      message.success(applicantStatus === 1 ? '取消成功' : '申請成功');
    }
  };

  renderContent = () => {
    const {
      followed,
      groupId,
      name,
      isGroupDetails,
      getGroupDetails,
      // currentGroupInfo,
      groupDetails,
    } = this.props;
    const { applicantStatus, isPublic } = groupDetails;
    if (isPublic) {
      return (
        <Menu>
          <Menu.Item>
            <FollowBtn
              followed={followed}
              groupId={groupId}
              name={name}
              isGroupDetails={isGroupDetails}
              getGroupDetails={getGroupDetails}
              followAndJoin={true}
              type="group"
            />
          </Menu.Item>
          <Menu.Item>
            <span onClick={this.clickJoin}>
              {applicantStatus === 1 ? '取消申請' : '申請加入'}
            </span>
          </Menu.Item>
        </Menu>
      );
    } else {
      return (
        <Menu>
          <Menu.Item></Menu.Item>
        </Menu>
      );
    }
  };

  render() {
    return (
      <Dropdown
        className={styles.options}
        overlay={this.renderContent()}
        trigger={['click']}
        placement="bottomCenter"
        getPopupContainer={() => findDOMNode(this.dropdown)}
      >
        <Button
          ref={(element) => {
            this.dropdown = element;
          }}
        >
          追蹤/加入
        </Button>
      </Dropdown>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { groupId } = ownProps;
  return {
    groupDetails: getGroupDetail(state, groupId),
  };
}

export default connect(mapStateToProps)(GroupOperate);
