import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { connect } from 'dva';
import styles from './MemberAndFans.scss';
import { identitySet } from '../../../models/defines/GroupDetails';
import AddressBook from '../../common/Address/AddressBook';

const { TabPane } = Tabs;

function MemberAndFans(props) {
  const { group, memberList, fansList, onClick } = props;
  const { isPublic, groupFollowCount, groupMemberCount } = group;
  return (
    <div className={`${styles.modalContent} ${isPublic ? '' : styles.hideNav}`}>
      <Tabs type="card">
        <TabPane tab={`${groupMemberCount} 位成員`} key="1">
          <div className={styles.userBox}>
            <AddressBook
              showList={memberList.map((item) => item.userId)}
              onClick={onClick}
            />
          </div>
        </TabPane>
        {isPublic && (
          <TabPane tab={`${groupFollowCount} 位粉絲`} key="2">
            <div className={styles.userBox}>
              <AddressBook showList={fansList} onClick={onClick} />
            </div>
          </TabPane>
        )}
      </Tabs>
    </div>
  );
}

MemberAndFans.propTypes = {
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
    memberList: state.groupInfo.getIn(['groupMember', groupId]),
    fansList: state.groupInfo.getIn(['groupFans', groupId]),
  };
}

export default connect(mapStateToProps)(MemberAndFans);
