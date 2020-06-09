import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'dva/router';

import styles from './index.css';
import Form from './LoginForm'; //form表單組件
import Load from './LoginResponse'; //登入響應組件
//語言
import sunPHorizontal from 'assets/images/sun-people-horizontal.png';

import { loginState } from '../../utils/session';

const LoginWrapper = ({ loginStatus, history, errorMsg }) => {
  if (loginStatus === loginState.LOGIN_PENDING) {
    return <Load />;
  }
  return (
    <>
      <Form history={history} />
      {loginStatus === loginState.LOGIN_FAILURE && errorMsg && (
        <p className={styles.LoginError}>
          {/* <FormattedMessage id="LoginPage.LoginPrompt" /> */}
          {errorMsg}
        </p>
      )}
    </>
  );
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { session, history, logged } = this.props;
    if (logged) {
      return <Redirect to="/" />;
    }
    const loginStatus = session.get('loginStatus');
    const errorMsg = session.get('errorMsg');
    return (
      <div className={styles.Login}>
        <div className={styles.LoginBox}>
          <img src={sunPHorizontal} alt="" className={styles.sunhorizontal} />
          <LoginWrapper
            loginStatus={loginStatus}
            history={history}
            errorMsg={errorMsg}
          />
        </div>
      </div>
    );
  }
}

Login.propTypes = {};

function mapStateToProps(state) {
  return {
    session: state.session,
    // tips: state.tips,
    // evenmore: state.evenmore,
    logged: state.session.get('loginStatus') === loginState.LOGIN_SUCCESS,
  };
}

export default connect(mapStateToProps)(Login);
