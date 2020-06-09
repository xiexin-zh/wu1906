import React from 'react';
import { connect } from 'dva';
import styles from './AllNotice.css';
import NoticeInfo from './NoticeInfo';
import { Empty, Icon } from 'antd';
import { getNoticesInfo } from '../../../models/notification/actions';

class AllNotice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.scrollElement.addEventListener('wheel', this.stopRolling);
  }

  componentWillUnmount() {
    this.scrollElement.removeEventListener('wheel', this.stopRolling);
  }

  stopRolling = (event) => {
    const { disableScroll } = this.state;
    if (disableScroll) {
      event.preventDefault();
    }
  };

  setScrollSwitch = (disableScroll) => {
    this.setState({
      disableScroll,
    });
  };

  addMoreNotice = (type) => {
    const {
      dispatch,
      inviteNoticeList,
      otherNoticeList,
      inviteNoticeRows,
      otherNoticeRows,
    } = this.props;
    let page = 1;
    if (type === 1) {
      page = parseInt(inviteNoticeList.size / inviteNoticeRows, 10) + 1;
    } else {
      page = parseInt(otherNoticeList.size / otherNoticeRows, 10) + 1;
    }
    dispatch(
      getNoticesInfo({
        type,
        page,
      })
    );
  };

  render() {
    const {
      inviteNoticeList,
      otherNoticeList,
      setVisible,
      inviteNoticeCount,
      otherNoticeCount,
    } = this.props;

    return (
      <div className={styles.wrapper} ref={(el) => (this.scrollElement = el)}>
        {inviteNoticeList.size + otherNoticeList.size ? (
          <div className={styles.triangle}>
            {!!inviteNoticeList.size && (
              <header className={styles.noticeHeader}>通知</header>
            )}
            <div className={styles.allNoticeBox}>
              {[...inviteNoticeList.values()].map((noticeItem) => {
                const { noticeId } = noticeItem;
                return (
                  <NoticeInfo
                    noticeData={noticeItem}
                    setVisible={setVisible}
                    key={noticeId}
                    setScrollSwitch={this.setScrollSwitch}
                  />
                );
              })}
              {!!inviteNoticeList.size &&
                inviteNoticeList.size < inviteNoticeCount && (
                  <div
                    onClick={() => this.addMoreNotice(1)}
                    className={styles.addMore}
                  >
                    <span>加載更多</span>
                    <Icon type="down" />
                  </div>
                )}
            </div>
            {!!otherNoticeList.size && (
              <header className={styles.noticeHeader}>其他通知</header>
            )}
            <div className={styles.allNoticeBox}>
              {[...otherNoticeList.values()].map((noticeItem) => {
                const { noticeId } = noticeItem;
                return (
                  <NoticeInfo
                    noticeData={noticeItem}
                    setVisible={setVisible}
                    key={noticeId}
                    setScrollSwitch={this.setScrollSwitch}
                  />
                );
              })}
              {!!otherNoticeList.size &&
                otherNoticeList.size < otherNoticeCount && (
                  <div
                    onClick={() => this.addMoreNotice(2)}
                    className={styles.addMore}
                  >
                    <span>加載更多</span>
                    <Icon type="down" />
                  </div>
                )}
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </div>
    );
  }
}

AllNotice.propTypes = {};

function mapStateToProps(state) {
  return {
    inviteNoticeList: state.notification.get('inviteNoticeList'),
    otherNoticeList: state.notification.get('otherNoticeList'),
    inviteNoticeCount: state.notification.get('inviteNoticeCount'),
    otherNoticeCount: state.notification.get('otherNoticeCount'),
    inviteNoticeRows: state.notification.get('inviteNoticeRows'),
    otherNoticeRows: state.notification.get('otherNoticeRows'),
  };
}
export default connect(mapStateToProps)(AllNotice);
