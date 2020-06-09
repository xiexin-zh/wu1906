import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'dva/router';
import { loginState } from 'utils/session';
import styles from './IndexPage.css';

function IndexPage({ logged, login }) {
  if (logged) {
    return <Redirect to="/" />;
  }
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to dva!</h1>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>
          To get started, edit <code>src/index.js</code> and save to reload.
        </li>
        <li>
          <a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">
            Getting Started
          </a>
        </li>
      </ul>
      <button onClick={login}>login</button>
    </div>
  );
}

IndexPage.propTypes = {};

function mapStateToProps(state) {
  return {
    logged: state.session.get('loginStatus') === loginState.LOGIN_SUCCESS,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: () => {
      dispatch({
        type: 'session/signIn',
        payload: {
          identity: 'cfruit.zy01',
          password: 'Aa123456',
          remember_me: false,
        },
      });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage);
