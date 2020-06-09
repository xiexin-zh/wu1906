import React, { useState } from 'react';
import { connect } from 'dva';
import { injectIntl } from 'react-intl';
import { Link } from 'dva/router';

import AsideItem from 'components/AllPanels/components/AsideItem.jsx';

import PostList from '../common/PostList';

import Yourgroup from './Yourgroup';
import GroupFastEntry from '../common/GroupFastEntry';
import ExploreCreateGroupButton from '../common/ExploreCreateGroupButton';
import styles from './index.css';
import layoutStyles from '../Main/index.scss';

import UserAvatar from '../common/UserAvatar';
import { getCurrentUserId } from '../../models/session/selectors';
import { getUserDetail } from '../../models/members/selectors';

const AllGroups = (props) => {
  const { user, match, intl } = props;
  if (!user) {
    return null;
  }
  const { id, fullName, full_name, name, givenName, given_name } = user;
  const [syncTs, setSyncTs] = useState(Date.now());
  const givenNames =
    givenName || given_name || fullName || full_name || name || '';
  return (
    <div className={`${styles.panelContainer} ${layoutStyles.contentWrapper}`}>
      <div className={`${layoutStyles.asideLeft}`}>
        <div className={styles.avatarBox}>
          <div className={styles.avatar}>
            <UserAvatar userId={id} size={42} />
          </div>
          <div className={styles.avatarName}>
            {fullName && <span>{fullName}</span>}
            {givenNames && <span>{givenNames}</span>}
          </div>
        </div>

        <div className={styles.tabContainer}>
          <Link to="/">
            <AsideItem
              type={'all'}
              isActive={match.path === '/'}
              itemContent={intl.formatMessage({
                id: 'panel.allDynamics',
                defaultMesasge: '全部動態',
              })}
            />
          </Link>
          <Link to={`/groups`}>
            <AsideItem
              type={'group'}
              isActive={match.path === '/groups'}
              itemContent={intl.formatMessage({
                id: 'panel.group',
                defaultMesasge: '群組',
              })}
            />
          </Link>
        </div>
        <div className={styles.groupItemContainer}>
          <GroupFastEntry />
        </div>
      </div>
      {/* 帖子展示清單 */}
      <PostList
        scrollState={true}
        type="allGroup"
        syncTs={syncTs}
        setSyncTs={setSyncTs}
        postListHeader={
          <>
            {/* 建立群組/探索群組 button */}
            <ExploreCreateGroupButton type="group" />
            {/* 你的群組 */}
            <Yourgroup Link={Link} />
          </>
        }
      />
      <div className={layoutStyles.asideRight}></div>
    </div>
  );
};

function mapStateToProps(state) {
  const selfUserId = getCurrentUserId(state);
  return {
    user: getUserDetail(state, selfUserId),
    // groupId: state.groupInfo.get('currentGroupId'),
  };
}
export default injectIntl(connect(mapStateToProps)(AllGroups));
