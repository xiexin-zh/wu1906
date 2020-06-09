import React, { Component } from 'react';
import classnames from 'classnames';
// import queryString from 'query-string';
import styles from './index.scss';
import { withRouter } from 'dva/router';
import propTypes from 'prop-types';
import { connect } from 'dva';

// import memoize from "memoize-one";

const initState = () => {
  return {
    filterType: [
      { name: '貼文', id: 'post' },
      { name: '人物', id: 'member' },
      { name: '社團', id: 'group' },
    ],
    filterIndex: null,
    show: '',
  };
};
class FilterType extends Component {
  constructor() {
    super();
    this.state = initState();
  }
  componentDidMount() {
    const {
      location: { pathname },
    } = this.props;
    let type = pathname.split('/search/')[1];
    let index = null;
    // eslint-disable-next-line default-case
    switch (type) {
      case 'post':
        index = 0;
        break;
      case 'member':
        index = 1;
        break;
      case 'group':
        index = 2;
        break;
    }
    if (!type) {
      type = 'search';
    }
    this.setState({
      show: type,
      filterIndex: index,
    });
  }

  changeFilter = (item, index) => {
    let {
      history: { push },
      query,
      isSearchContent,
      searchNum,
      isShow,
    } = this.props;
    query = query.replace('#', '%23');
    const { filterIndex } = this.state;
    // console.log(object);
    if (!isSearchContent && isShow === 'search') {
      return false;
    }
    if (!searchNum && isShow === 'search') {
      return false;
    }
    if (filterIndex === index) {
      this.setState({
        filterIndex: null,
      });
      push(`/search?q=${query}`);
    } else {
      this.setState({
        filterIndex: index,
      });
      // eslint-disable-next-line default-case
      switch (item.id) {
        case 'post':
          push(`/search/post?q=${query}`);
          break;
        case 'member':
          push(`/search/member?q=${query}`);
          break;
        case 'group':
          push(`/search/group?q=${query}`);
          break;
      }
    }
  };

  render() {
    const { filterType, filterIndex, show } = this.state;
    const { isShow } = this.props;

    return (
      <div>
        {show === isShow && (
          <div className={styles.filterType}>
            {filterType.map((item, index) => {
              return (
                <div
                  key={item.name}
                  onClick={() => this.changeFilter(item, index)}
                  className={classnames({
                    [styles.filterItem]: true,
                    [styles.filterIndex]: filterIndex === index,
                  })}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
FilterType.propTypes = {
  query: propTypes.string.isRequired,
  isShow: propTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    isSearchContent: state.search.isSearchContent,
    searchNum: state.search.searchNum,
  };
}
export default withRouter(connect(mapStateToProps)(FilterType));
