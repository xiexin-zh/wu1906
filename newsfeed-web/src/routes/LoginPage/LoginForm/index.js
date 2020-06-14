import React from 'react';
import { connect } from 'dva';
import styles from './index.css';

import { FormattedMessage } from 'react-intl';
import { message } from 'antd';

export class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //設置初始狀態
      phoneHidden: false,
      chcekTitle: false,
      userValue: '',
      passValue: '',
      subbackground: false, //點擊切換圖片
      textTop: '',
      textFontSize: '',
      passTop: '',
      passFontSize: '',
      inputPadding: '',
      remember_me: false,
    };
    this.maintainLogin = this.maintainLogin.bind(this);
  }
  //改變userinput
  userChange = () => {
    //輸入框發生改變時
    this.setState({ userValue: this.refs.userDom.value.trim() }); //動態獲取 input 中的 value
  };
  //改變passinput
  passChange = () => {
    this.setState({ passValue: this.refs.passDom.value.trim() }); //動態獲取 input 中的 value
  };
  //劃入滑出 忘記密碼
  onMouseEnter = () => {
    //滑鼠移入（不支持事件冒泡）
    this.setState({ phoneHidden: true });
  };
  onMouseLeave = () => {
    //滑鼠移除（不支持事件冒泡）
    this.setState({ phoneHidden: false });
  };

  //劃入滑出 保持登入狀態
  onMouseEnterTitle = () => {
    //滑鼠移入（不支持事件冒泡）
    this.setState({ chcekTitle: true });
  };
  onMouseLeaveTitle = () => {
    //滑鼠移除（不支持事件冒泡）
    this.setState({ chcekTitle: false });
  };
  //點擊按鈕 發起請求
  submit = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    const { userValue, passValue, remember_me } = this.state;
    if (!userValue || !passValue) {
      message.warn('缺少用戶名或密碼');
      return;
    }
    dispatch({
      // type: 'login/signIn',
      type: 'session/signIn',
      payload: {
        identity: userValue,
        password: passValue,
        remember_me: remember_me,
      },
    }).catch((e) => console.log(e));
  };
  mouseDown = () => {
    //點擊切換圖片
    this.setState({ subbackground: true });
  };
  mouseUp = () => {
    this.setState({ subbackground: false });
  };
  //用戶名 獲取/失去 焦點
  blurText() {
    if (this.refs.userDom.value === '') {
      this.setState({
        textTop: '18px',
        textFontSize: '16px',
      });
    } else {
      this.setState({
        textTop: '6px',
        textFontSize: '12px',
      });
    }
  }
  focusText() {
    this.setState({
      textTop: '6px',
      textFontSize: '12px',
      inputPadding: '26px',
    });
  }
  //點擊 用戶名 中的 span
  clickUser() {
    this.refs.userDom.focus();
  }
  //密碼 獲取/失去 焦點
  blurPass() {
    const { passTop } = this.state;
    if (this.refs.passDom.value === '') {
      if (passTop !== '18px') {
        this.setState({
          passTop: '18px',
          passFontSize: '16px',
        });
      }
    } else {
      if (passTop !== '6px') {
        this.setState({
          passTop: '6px',
          passFontSize: '12px',
        });
      }
    }
  }
  focusPass() {
    this.setState({
      passTop: '6px',
      passFontSize: '12px',
      inputPadding: '26px',
    });
  }
  //點擊 密碼 中的 span
  clickPass() {
    this.refs.passDom.focus();
  }
  maintainLogin(e) {
    const target = e.target;
    this.setState({
      remember_me: target.checked,
    });
  }

  render() {
    const {
      inputPadding,
      userValue,
      textTop,
      textFontSize,
      passValue,
      passTop,
      passFontSize,
      phoneHidden,
      subbackground,
    } = this.state;

    return (
      <div className={`${styles.formBox} ${styles.clear}`}>
        {/* form表單 */}
        <div className={`${styles.formBox} ${styles.clear}`}>
          <form
            action="#"
            method="post"
            id="loginFrom"
            className={`${styles.form}`}
          >
            <label className={styles.labelUser}>
              <input
                type="text"
                id="username_input"
                className={styles.username}
                ref="userDom"
                style={{ paddingTop: inputPadding }}
                onChange={this.userChange}
                value={userValue}
                onBlur={() => this.blurText()}
                onFocus={() => this.focusText()}
                required="required"
              />
              <span
                id="userText"
                className={styles.user}
                style={{ top: textTop, fontSize: textFontSize }}
                onClick={() => this.clickUser()}
              >
                <FormattedMessage id="Login.UserOrEmail" />
              </span>
            </label>
            <label className={styles.labelPassword}>
              <input
                type="password"
                id="password_input"
                className={styles.password}
                ref="passDom"
                style={{ paddingTop: inputPadding }}
                onChange={this.passChange}
                value={passValue}
                onBlur={() => this.blurPass()}
                onFocus={() => this.focusPass()}
                required="required"
              />
              <span
                id="passText"
                className={styles.pass}
                style={{ top: passTop, fontSize: passFontSize }}
                onClick={() => this.clickPass()}
              >
                <FormattedMessage id="Login.Password" />
              </span>
            </label>
            <div className={styles.submitBox}>
              <button
                className={`${styles.sub} ${
                  subbackground ? styles.sub_background : ''
                }`}
                onClick={this.submit}
                onMouseDown={this.mouseDown}
                onMouseUp={this.mouseUp}
              >
                <FormattedMessage id="Login.Login" />
              </button>
              <i className={styles.login_arrow}></i>
            </div>
            <div className={styles.phoneBox}>
              {phoneHidden && (
                <p
                  className={
                    this.props.language === 'zh'
                      ? styles.Zh_phone
                      : styles.En_phone
                  }
                >
                  <FormattedMessage id="Login.PleaseContact" />
                </p>
              )}
              <p className={styles.forgetPass}>
                <span
                  id="forgetSlip"
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                >
                  <FormattedMessage id="Login.Forget_password" />
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Form.propTypes = {};

export default connect()(Form);
