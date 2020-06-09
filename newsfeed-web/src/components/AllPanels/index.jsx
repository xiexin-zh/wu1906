import React, { useState } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { injectIntl } from 'react-intl';
import AsideItem from './components/AsideItem';
import GroupFastEntry from '../common/GroupFastEntry';
import PostList from '../common/PostList';

import SendPost from '../common/SendPost';
import styles from './index.css';
import layoutStyles from '../Main/index.scss';
import UserAvatar from '../common/UserAvatar';
import { getCurrentUserId } from '../../models/session/selectors';
import { getUserDetail } from '../../models/members/selectors';

const Allpanel = ({ user, match, intl }) => {
  if (!user) {
    return null;
  }
  const { id, fullName, given_name, givenName, name, full_name } = user;
  const [syncTs, setSyncTs] = useState(Date.now());
  const givenNames =
    given_name || fullName || full_name || name || givenName || name || '';
  return (
    <div className={`${styles.panelContainer} ${layoutStyles.contentWrapper}`}>
      <div className={layoutStyles.asideLeft}>
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
          <Link to={`/`}>
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
        <GroupFastEntry />
      </div>
      <PostList
        scrollState={true}
        syncTs={syncTs}
        type="all"
        setSyncTs={setSyncTs}
        postListHeader={
          <SendPost
            id={id}
            msg_text={intl.formatMessage({
              id: 'Post.thinkingAboutSomething',
              defaultMesasge: '在想些什麼?',
            })}
            head_text={intl.formatMessage({
              id: 'Post.addNew',
              defaultMesasge: '新增動態',
            })}
            setSyncTs={setSyncTs}
          />
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
  };
}
export default injectIntl(connect(mapStateToProps)(Allpanel));
