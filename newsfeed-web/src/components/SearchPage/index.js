import React from 'react';
import { connect } from 'dva';
import { withRouter, Switch, Route, Router, Link } from 'dva/router';

import AsideItem from 'components/AllPanels/components/AsideItem.jsx';

import styles from './index.css';
import layoutStyles from '../Main/index.scss';

import GroupFastEntry from '../common/GroupFastEntry';
import SearchBox from './SearchBox';
import SearchPost from './SearchBox/SearchPost';
import SearchGroup from './SearchBox/SearchGroup';
import SearchMember from './SearchBox/SearchMember';
import UserAvatar from '../common/UserAvatar';
import { getCurrentUserId } from '../../models/session/selectors';
import { getUserDetail } from '../../models/members/selectors';
import HistoryBox from './HistoryBox';
import InstrestMember from './HistoryBox/IntrestMember';
import InstrestGroup from './HistoryBox/IntrestGroup';

const SearchPage = (props) => {
  const { user, match, history } = props;
  if (!user) {
    return null;
  }
  const { id, fullName, givenName } = user;
  return (
    <div className={`${styles.panelContainer} ${layoutStyles.contentWrapper}`}>
      <div className={layoutStyles.asideLeft}>
        <div className={styles.avatarBox}>
          <div className={styles.avatar}>
            <UserAvatar size={42} userId={id} />
          </div>
          <div className={styles.avatarName}>
            {fullName && <span>{fullName}</span>}
            {givenName && <span>{givenName}</span>}
          </div>
        </div>

        <div className={styles.tabContainer}>
          <Link to="/">
            <AsideItem
              type={'all'}
              isActive={match.path === '/'}
              itemContent={'全部動態'}
            />
          </Link>

          <Link to={`/groups`}>
            <AsideItem
              type={'group'}
              isActive={match.path === '/groups'}
              itemContent={'群組'}
            />
          </Link>
        </div>
        <div className={styles.groupItemContainer}>
          <GroupFastEntry />
        </div>
      </div>

      <div className={`${styles.panelMain} ${layoutStyles.contentBody}`}>
        <Router history={history}>
          <Switch>
            <Route path="/search/post" component={SearchPost} />
            <Route path="/search/group" component={SearchGroup} />
            <Route path="/search/member" component={SearchMember} />
            <Route path="/search/history" component={HistoryBox} />
            <Route path="/search/instrestmember" component={InstrestMember} />
            <Route path="/search/instrestgroup" component={InstrestGroup} />
            <Route path="/search" component={SearchBox} />
          </Switch>
        </Router>
      </div>
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
export default withRouter(connect(mapStateToProps)(SearchPage));
