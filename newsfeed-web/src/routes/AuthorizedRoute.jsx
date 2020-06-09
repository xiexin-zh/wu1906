import React from 'react';
import { Route, Redirect } from 'dva/router';
import { connect } from 'dva';
import { loginState } from 'utils/session';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

// import styles from './AuthorizedRoute.css';

const loadingWrapper = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

class AuthorizedRoute extends React.PureComponent {
  render() {
    const { component: Component, logged, userId, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={() => {
          return logged ? (
            userId ? (
              <Component {...this.props} />
            ) : (
              <div style={loadingWrapper}>
                <Spin tip="Loading..."></Spin>
              </div>
            )
          ) : (
            <Redirect to="/login" />
          );
        }}
      />
    );
  }
}
AuthorizedRoute.propTypes = {
  logged: PropTypes.bool.isRequired,
};

// eslint-disable-line
function mapStateToProps(state) {
  return {
    logged: state.session.get('loginStatus') === loginState.LOGIN_SUCCESS,
    userId: state.session.getIn(['user', 'id']),
  };
}

export default connect(mapStateToProps)(AuthorizedRoute);
