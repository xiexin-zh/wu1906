import React from 'react';
// import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'dva';
import headerStyles from '../SearchBox.scss';
import styles from './SearchMember.scss';
import { Link } from 'dva/router';
import AddressBook from '../../../common/Address/AddressBook';
import FilterType from '../FilterType';
class SearchMember extends React.PureComponent {
  // followUser = () => {
  //   const { userId, followUser } = this.props;
  // };

  render() {
    const {
      initialShowCount,
      location,
      followedUsers,
      saveSearchNum,
    } = this.props;
    const queryParam = queryString.parse(location.search);
    const { q: query = '' } = queryParam;
    const header = (count) => {
      return (
        <header className={headerStyles.header}>
          {/* {saveSearchNum(count)} */}
          <span>用戶 (共 {count} 位）</span>
          {initialShowCount && (
            <Link
              to={`/search/member${
                query ? `?q=${query.replace('#', '%23')}` : ''
              }`}
            >
              查看全部
            </Link>
          )}
        </header>
      );
    };
    return (
      <div className={styles.memberBox}>
        <FilterType query={query} isShow={'member'} />
        <div className={styles.content}>
          <AddressBook
            ref="AddressBook"
            searchValue={query.replace('#', '')}
            showCount={initialShowCount}
            followUserMap={followedUsers}
            renderHeader={(count) => {
              return (
                saveSearchNum(count),
                header(count)
                // // saveSearchNum(count)
              );
            }}
            buttonClassName={styles.btn}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    followedUsers: state.users.get('ownFollowUserList'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveSearchNum: (num) => {
      dispatch({
        type: 'search/saveSearchNum',
        payload: num,
      });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchMember);
