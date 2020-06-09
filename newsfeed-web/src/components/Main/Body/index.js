import React, { useEffect, useRef } from 'react';
import { connect } from 'dva';
import styles from './Body.css';
import Allpanels from '../../AllPanels';
import Persinalpanel from '../../Persinalpanels';

import SearchPage from '../../SearchPage';
import AllGroups from '../../AllGroups';
import { withRouter, Switch, Route, Router } from 'dva/router';
import GroupDetails from '../../GroupDetails';
import get from 'lodash/get';

import { getCurrentUserId } from '../../../models/session/selectors';

function Body({ history, ...props }) {
  const wrapperNode = useRef(null);

  useEffect(() => {
    if (!wrapperNode.current) {
      return false;
    }

    const scrollAnimation = () => {
      const {
        backgroundAndHeadAnmiation,
        //  avatarAnmiation
      } = props;
      if (wrapperNode.current !== 0) {
        backgroundAndHeadAnmiation(true);
      }
      // if (wrapperNode.current.scrollTop >= 428) {
      //   avatarAnmiation(true);
      // } else {
      //   avatarAnmiation(false);
      // }
    };
    wrapperNode.current.addEventListener('scroll', scrollAnimation);
    return () => {
      wrapperNode.current.removeEventListener('scroll', scrollAnimation);
    };
  }, []);

  return (
    <div
      className={styles.wrapper}
      ref={wrapperNode}
      style={{ position: 'relative' }}
    >
      <Router history={history}>
        <Switch>
          <Route
            path="/groups/:groupId"
            // component={GroupDetails}
            children={(props) => {
              const { match } = props;
              if (match) {
                return (
                  <GroupDetails key={get(match, 'params.groupId')} {...props} />
                );
              }
              return null;
            }}
          />
          <Route path="/groups" component={AllGroups} />
          <Route
            path="/user/:id"
            children={(props) => {
              const { match } = props;
              if (match) {
                return (
                  <Persinalpanel key={get(match, 'params.id')} {...props} />
                );
              }
              return null;
            }}
            // component={Persinalpanel}
          />
          <Route path="/user" component={Persinalpanel} />

          <Route path="/search" component={SearchPage} />

          <Route path="/" component={Allpanels} />
        </Switch>
      </Router>
    </div>
  );
}
function mapStateToProps(state) {
  return {
    userId: getCurrentUserId(state),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    backgroundAndHeadAnmiation: (startAnimation) => {
      dispatch({
        type: 'posts/backgroundAndHeadAnmiation',
        payload: startAnimation,
      });
    },
    avatarAnmiation: (avatarState) => {
      dispatch({
        type: 'posts/avatarAnmiation',
        payload: avatarState,
      });
    },
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Body)
);
