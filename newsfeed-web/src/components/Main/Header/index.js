import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { withRouter, Router, Route } from 'dva/router';
import queryString from 'query-string';
import Item from './Item';
import styles from './Header.css';
import layoutStyles from '../index.scss';
import Search from '../../common/Search';
import AllNotice from '../../common/AllNotice';
// import Popover from 'antd/lib/popover';
// import Button from 'antd/lib/button';
// import { getCurrentUserId } from '../../../models/session/selectors';
import { Popover, Badge } from 'antd';
import { clearNewNoticeCount } from '../../../models/notification/actions';

export const panels = {
  ALL: 'all',
  GROUP: 'group',
  PERSONAL: 'personal',
};

const Header = ({
  // selfUserId,
  history,
  newNoticeCount,
  clearNewNoticeCount,
}) => {
  const [noticeState, setState] = useState(false);
  useEffect(() => {
    if (noticeState && newNoticeCount !== 0) {
      clearNewNoticeCount();
    }
  }, [newNoticeCount, noticeState]);
  return (
    // <div className={styles.header}>
    <div className={`${layoutStyles.contentWrapper} ${styles.header}`}>
      <Router history={history}>
        {/* <ul className={styles.sidePanelHeader}> */}
        <ul className={`${layoutStyles.asideLeft} ${styles.sidePanelHeader}`}>
          <Route
            path={'/'}
            children={({ match }) => {
              const active = match && match.isExact;
              return (
                <Item type={panels.ALL} active={active} to="/">
                  <span>全部</span>
                </Item>
              );
            }}
          />
          <Route
            path={'/groups'}
            children={({ match }) => {
              return (
                <Item type={panels.GROUP} active={Boolean(match)} to="/groups">
                  <span>群組</span>
                </Item>
              );
            }}
          />
          <Route
            path={'/user'}
            children={({ match }) => {
              return (
                <Item type={panels.PERSONAL} active={Boolean(match)} to="/user">
                  <span>個人</span>
                </Item>
              );
            }}
          />
        </ul>
      </Router>
      <div className={layoutStyles.contentBody}>
        <Route
          path={'/search'}
          children={({ match, location }) => {
            const queryParam = queryString.parse(location.search);
            const { q: query = '' } = queryParam;
            return <Search key={query} query={match ? query : null} />;
          }}
        />
      </div>
      {/* <Popover placement="bottom" content={<AllNotice />} trigger="click"> */}
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', height: '100%' }}
        className={layoutStyles.asideRight}
      >
        {/* {noticeState && <AllNotice />} */}
        <Popover
          content={<AllNotice setVisible={setState} />}
          // title="Title"
          trigger="click"
          placement="bottomRight"
          visible={noticeState}
          arrowPointAtCenter
          onVisibleChange={() => setState((noticeShow) => !noticeShow)}
        >
          <div
            className={styles.notiflyContainer}
            style={{
              backgroundColor: `${noticeState ? '#0c293a' : '#475f77'}`,
            }}
            onClick={clearNewNoticeCount}
          >
            <Badge count={noticeState ? 0 : newNoticeCount} overflowCount={99}>
              <i className={`${styles.icon} ${styles.combinedShape}`}></i>
            </Badge>
          </div>
        </Popover>
      </div>
      {/* </Popover> */}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    // selfUserId: getCurrentUserId(state),
    newNoticeCount: state.notification.get('newNoticeCount'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearNewNoticeCount: () => dispatch(clearNewNoticeCount()),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
