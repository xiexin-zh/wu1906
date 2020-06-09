import React from 'react';
import { Input, Checkbox, Button } from 'antd';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './style.less';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  submitting = () => {
    const { dispatch } = this.props;
    const { username, password } = this.state;
    dispatch({
      type: 'login/login',
      payload: {
        username,
        password,
      },
    });
  };

  userNameVal = e => {
    this.setState({
      username: e.target.value,
    });
  };

  passWordVal = e => {
    this.setState({
      password: e.target.value,
    });
  };

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.submitting();
    }
  };

  render() {
    return (
      <div className={styles.LoginBox}>
        <div className={styles.main}>
          <i className={styles.login_logo4} />
          <div className={styles.loginForm}>
            <div className={styles.formBox}>
              <h1>登录</h1>
              <div className={styles.inputBox} style={{ marginBottom: '40px' }}>
                <i className={`${styles.inputIcon} ${styles.userInputIcon}`} />
                <Input placeholder="用户名" onChange={e => this.userNameVal(e)} />
              </div>
              <div className={styles.inputBox}>
                <i className={`${styles.inputIcon} ${styles.passInputIcon}`} />
                <Input.Password
                  placeholder="密码"
                  onChange={e => this.passWordVal(e)}
                  onKeyDown={this.onKeyDown}
                />
              </div>
              <div className={styles.checkedBox}>
                <Checkbox>
                  <FormattedMessage id="user-login.login.remember-me" />
                </Checkbox>
                <div
                  style={{
                    float: 'right',
                    color: 'rgba(0, 165, 240, 1)',
                    cursor: 'pointer',
                  }}
                >
                  <FormattedMessage id="user-login.login.forgot-password" />
                </div>
              </div>
              <Button type="primary" block className={styles.priBtn} onClick={this.submitting}>
                <FormattedMessage id="user-login.login.login" />
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <h5 className={styles.logo}>北京北控三兴信息技术有限公司</h5>
          <div>申请试用</div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(Login);
