import React from 'react';
import ReactDom from 'react-dom';
import { connect } from 'dva';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import styles from './index.css';
import { openCreatePostDialog } from '../../../models/posts/actions';
import { getCurrentUserId } from '../../../models/updatePersonalGroupInfo/selectors';
import { getUserDetail } from '../../../models/members/selectors';
import UserAvatar from '../../../components/common/UserAvatar';
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: '',
      member_id: '',
    };
    this.showCurUserInfo = this.showCurUserInfo.bind(this);
    this.closePopupMenu = this.closePopupMenu.bind(this);
    this.setActive = this.setActive.bind(this);
  }
  componentDidMount() {
    // document.addEventListener('click', this.closePopupMenu);
  }
  componentWillUnmount() {
    // document.removeEventListener('click', this.closePopupMenu);
  }
  closePopupMenu = (e) => {
    const { active } = this.state;
    if (!active) {
      return;
    }
    const node = ReactDom.findDOMNode(this.popup);
    const target = e.target;
    const isInside = node.contains(target);
    const existing = document.body.contains(target);
    if (this.state.active !== '' && existing && !isInside) {
      this.setState({
        active: '',
        member_id: '',
      });
    }
  };
  setActive(active, member_id) {
    this.setState({
      active: active,
      member_id: member_id || '',
    });
  }
  showCurUserInfo(e) {
    e.nativeEvent.stopImmediatePropagation();
    if (this.state.active) {
      this.setState({
        active: '',
      });
    } else {
      this.setState({
        active: 'current_user',
      });
    }
  }

  currentShowPage = (nfImActive) => () => {
    if (Object.is(nfImActive, 'nf')) {
      return false;
    }
    if (nfImActive === 'im') {
      window.location.href = '/';
    }
  };
  // NewsFees/IM Tab
  renderChatNewsFeedTabBtn = () => {
    return (
      <div className={`${styles.tabsWrapper} `}>
        <div className={styles.nfBox} onClick={this.currentShowPage('nf')}>
          <div className={`${styles.nf_im_tab} ${styles.nf}`}></div>
          <span className={styles.dynamic}>
            <img
              src={require('./images/newsfeed.svg')}
              alt=""
              className={styles.dynamic_i}
              width="24px"
            />
            最新動態
          </span>
        </div>
        <div className={styles.imBox} onClick={this.currentShowPage('im')}>
          <div className={`${styles.nf_im_tab} ${styles.im}`}></div>
          <span className={`${styles.chat} ${styles.chatFontColor}`}>
            <img
              src={require('./images/chat.svg')}
              alt=""
              className={styles.chat_i}
              width="24px"
            />
            聊天
          </span>
        </div>
      </div>
    );
  };

  render() {
    let { user, signOut } = this.props;
    const { givenName, full_name, fullName, id, name, given_name } = user;
    const givenNames =
      givenName || given_name || fullName || full_name || name || '';
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          {/* SunPeople Title */}
          <div className={styles.itemName}>
            <span
              className={styles.lastName}
              // onClick={this.props.selectPeopleTagger}
            >
              Sun
            </span>
            <span className={styles.firstName}>People</span>
          </div>
          {/* NewsFees/IM Tab */}
          {this.renderChatNewsFeedTabBtn()}
          {/* 基本資訊以及頭像退出 */}
          <div className={styles.userBox}>
            <div className={styles.userBoxLeft}>
              <div className={styles.avatarName}>
                {fullName && <span>{fullName}</span>}
                {givenNames && <span>{givenNames}</span>}
              </div>
              <div className={styles.signOut} onClick={signOut}>
                <i className={styles.signOutIcon}></i>
                <span className={styles.goOut}>
                  <FormattedMessage id="base.logOut" />
                </span>
              </div>
            </div>

            <div className={`${styles.userBoxRight} cursor-pointer`}>
              <UserAvatar size={42} userId={id} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Header.propTypes = {
  intl: intlShape.isRequired,
};
function mapStateToProps(state) {
  const userId = getCurrentUserId(state);
  return {
    // rtm: state.rtm,
    user: getUserDetail(state, userId) || state.session.get('user'),
    // isOnline: state.session.get('online'),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => {
      dispatch({
        type: 'session/signOut',
      });
      sessionStorage.setItem('hasDraft', '');
      sessionStorage.setItem('historyList', '');
    },
    // FIXME: del
    selectPeopleTagger: () => {
      dispatch(openCreatePostDialog());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Header));
