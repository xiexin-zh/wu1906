import React from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import AsideItem from './AsideItem';
import { Icon } from 'antd';
import styles from './GroupFastEntry.css';
import { Link } from 'dva/router';
// import { getOwnGroup } from '../../../models/groupInfo/selectors';
import { sortGroupByIndexSymbol } from '../../../utils/sort';
import {
  getMemberGroupList,
  getAdminGroupList,
  getFollowGroupList,
} from '../../../models/groupInfo/selectors';

class GroupFastEntry extends React.Component {
  constructor() {
    super();
    this.state = {
      MoadleStata: false,
    };
  }

  openMoadle = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updatePersonalGroupInfo/showExploreCreateGroupActive',
      payload: 'Group.YouGroup',
    });
  };

  render() {
    const { memberGroupList, adminGroupList, followGroupList } = this.props;
    const ownGroupList = [
      ...memberGroupList.values(),
      ...adminGroupList.values(),
      ...followGroupList.values(),
    ];

    return (
      <div className={styles.groupItemContainer}>
        <div className={styles.headerTop}>
          <h4>
            <FormattedMessage id="Group.FastEntry">
              {(text) => text}
            </FormattedMessage>
          </h4>
          {ownGroupList.length !== 0 && (
            <div className={styles.loadMore} onClick={this.openMoadle}>
              <Icon className={styles.downIcon} type="down" />

              <span className={styles.seeMore}>查看更多…</span>
            </div>
          )}
        </div>

        <div>
          {ownGroupList
            .sort(sortGroupByIndexSymbol)
            .slice(0, 5)
            .map((group, index) => {
              const { groupId, name, avatarUrl, indexSymbol } = group;
              return (
                <Link key={index} to={`/groups/${groupId}`}>
                  <AsideItem
                    key={groupId}
                    groupId={groupId}
                    type={'group'}
                    itemContent={name}
                    avatarUrl={avatarUrl}
                    indexSymbol={indexSymbol}
                  ></AsideItem>
                </Link>
              );
            })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    // ownGroupList: getOwnGroup(state),
    memberGroupList: getMemberGroupList(state),
    adminGroupList: getAdminGroupList(state),
    followGroupList: getFollowGroupList(state),
  };
}

export default connect(mapStateToProps)(GroupFastEntry);
