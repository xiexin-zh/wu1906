import React from 'react';
import styles from './index.scss';
import { Link } from 'dva/router';
import { getUrl } from 'utils/utils';
import { connect } from 'dva';
import { Icon, Avatar } from 'antd';
import UserList from './UserList';

import {
  getHistory,
  delHistory,
  clearAllSearchHistory,
} from '../../../utils/searchHistory.js';

class HistoryBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
    };
  }

  getHistory = async () => {
    const history = await getHistory();
    this.setState({
      history,
    });
  };

  searchItem = (value) => {
    const { history } = this.props;
    history.push(`/search?q=${value}`);
  };

  delHistory = async (index) => {
    const history = await delHistory(index);
    this.setState({
      history,
    });
  };

  clearAll = () => {
    const history = clearAllSearchHistory();
    this.setState({
      history,
    });
  };

  getInterestGroup = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'search/getInterestGroup',
    });
  };

  getInterestUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'search/getInterestUser',
      payload: {
        page: 1,
        rows: 20,
      },
    });
  };

  showMember = () => {
    this.props.history.push(`/search/instrestmember`);
  };
  showGroup = () => {
    this.props.history.push(`/search/instrestgroup`);
  };

  componentDidMount() {
    this.getHistory();
    this.getInterestGroup();
    this.getInterestUser();
  }

  render() {
    const { history } = this.state;
    const { interestGroups, interestUsers } = this.props;
    return (
      <div className={styles.searchHistory}>
        {history.length > 0 && (
          <div className={styles.historyBox}>
            <div className={styles.title}>
              <span className={styles.tip}>近期搜尋紀錄</span>
              <span className={styles.clear} onClick={this.clearAll}>
                清空
              </span>
            </div>
            <div className={styles.historyList}>
              {history.length > 0 &&
                history.slice(0, 5).map((item, index) => {
                  return (
                    <div className={styles.historyItem} key={item.key}>
                      <div className={styles.itemImg}>
                        <Icon type="search" />
                      </div>
                      <div
                        className={styles.itemTitle}
                        onClick={() => this.searchItem(item.title)}
                      >
                        {item.title}
                      </div>
                      <span
                        className={styles.itemClose}
                        onClick={() => this.delHistory(index)}
                      >
                        <Icon type="close" />
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        <div className={styles.interestGroup}>
          <div className={styles.title}>
            <span className={styles.tip}>你可能感興趣的群組</span>
            <span className={styles.clear} onClick={this.showGroup}>
              查看全部
            </span>
          </div>
          <div className={styles.groupList}>
            {interestGroups &&
              interestGroups.length > 0 &&
              interestGroups.slice(0, 5).map((item) => {
                const { avatarUrl, groupName, groupId, indexSymbol } = item;
                return (
                  <Link key={groupId} to={`/groups/${item.groupId}`}>
                    <Avatar
                      alt=""
                      size={110}
                      shape="square"
                      src={getUrl(avatarUrl)}
                    >
                      {avatarUrl ? '' : indexSymbol}
                    </Avatar>
                    <span className={styles.groupName}>{groupName.trim()}</span>
                  </Link>
                );
              })}
          </div>
        </div>
        <div className={styles.interestUser}>
          <div className={styles.title}>
            <span className={styles.tip}>你可能感興趣的人</span>
            <span className={styles.clear} onClick={this.showMember}>
              查看全部
            </span>
          </div>
          <UserList userList={interestUsers.slice(0, 6)} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    interestGroups: state.search.interestGroups,
    interestUsers: state.search.interestUsers,
  };
}
export default connect(mapStateToProps)(HistoryBox);
