import React, { PureComponent } from 'react';
import { Input, message } from 'antd';
import queryString from 'query-string';
import { withRouter } from 'dva/router';
import styles from './index.scss';
import { connect } from 'dva';
import { setHistory } from '../../../utils/searchHistory';

const { Search } = Input;

class SearchBox extends PureComponent {
  static getDeriveStateFromProps(props) {
    if (props.query === null) {
      return {
        value: '',
      };
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.query,
    };
  }

  isSearchPage = () => {
    const { location } = this.props;
    if (
      location.pathname === '/search/post' ||
      location.pathname === '/search' ||
      location.pathname === '/search/member' ||
      location.pathname === '/search/group' ||
      location.pathname === '/search/instrestmember' ||
      location.pathname === '/search/instrestgroup'
    ) {
      return true;
    }
    return false;
  };

  onChange = (e) => {
    const { history } = this.props;
    // const queryParam = queryString.parse(location.search);
    // const { q: query = '' } = queryParam;
    this.setState({
      value: e.target.value,
    });
    if (e.target.value === '' && this.isSearchPage()) {
      // history.push('/');
      history.push(`/search/history`);
      // hideSearchContent();
    }
  };

  focusInput = (e) => {
    const { history, location } = this.props;
    if (
      e.target.value === '' &&
      (location.pathname === '/search/instrestmember' ||
        location.pathname === '/search/instrestgroup')
    ) {
      history.push(`/search/history`);
    }
  };

  onPressEnter = (e) => {
    const { history, location, ShowSearchContent, reSearchNum } = this.props;
    const queryParam = queryString.parse(location.search);
    const { q: query = '' } = queryParam;
    let { value } = this.state;
    // console.log(value);

    if (value) {
      ShowSearchContent();
    }

    value = value || '';
    value = value.trim();
    if (!value) {
      message.warn('請輸入搜索內容');
      return;
    }
    if (value === query) {
      return false;
    }
    value = value.replace('#', '%23');
    setHistory(value, 'normal');
    history.push(`/search?q=${value}`);
    // 搜索时重置搜索结果
    reSearchNum();
    // if (/^\/search/.test(location.pathname)) {
    //   history.push(`${location.pathname}?q=${encodeURIComponent(value)}`);
    // } else {
    //   history.push(`/search?q=${value}`);
    // }
  };

  render() {
    const { value } = this.state;

    return (
      <div className={styles.searchBox}>
        <img
          className={styles.content}
          src={require('assets/images/icon/search.svg')}
          alt=""
        />
        {/* <input placeholder="搜索" type="text" /> */}
        <Search
          enterButton="搜尋"
          placeholder="搜索"
          value={value}
          onChange={this.onChange}
          onSearch={this.onPressEnter}
          className={styles.search}
          onFocus={this.focusInput}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    ShowSearchContent: () => {
      dispatch({
        type: 'search/ShowSearchContent',
      });
    },
    hideSearchContent: () => {
      dispatch({
        type: 'search/hideSearchContent',
      });
    },
    reSearchNum: () => {
      dispatch({
        type: 'search/enSearchNum',
      });
    },
  };
}
export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(SearchBox)
);
