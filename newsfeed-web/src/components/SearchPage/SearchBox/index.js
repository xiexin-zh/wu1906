import React from 'react';
// import PropTypes from 'prop-types';
import SearchGroup from './SearchGroup';
import SearchMember from './SearchMember';
import SearchPost from './SearchPost';
// import { connect } from 'dva';
import styles from './SearchBox.scss';
import FilterType from './FilterType';
import queryString from 'query-string';
import { connect } from 'dva';

const initialPostCount = 3;
const initialGroupCount = 6;
const initialMemberCount = 6;

class SearchBox extends React.PureComponent {
  get query() {
    const { location } = this.props;
    const queryParam = queryString.parse(location.search);
    const { q = '' } = queryParam;
    return q;
  }
  render() {
    const { location, isSearchContent, searchNum } = this.props;
    return (
      <>
        <FilterType query={this.query} isShow={'search'} />
        {isSearchContent && (
          <div className={searchNum > 0 ? styles.show : styles.hidden}>
            <section className={styles.section}>
              <SearchPost
                initialShowCount={initialPostCount}
                location={location}
              />
            </section>
            <section className={styles.section}>
              <SearchGroup
                initialShowCount={initialGroupCount}
                location={location}
              />
            </section>
            <section className={styles.section}>
              <SearchMember
                initialShowCount={initialMemberCount}
                location={location}
              />
            </section>
          </div>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSearchContent: state.search.isSearchContent,
    searchNum: state.search.searchNum,
  };
}
export default connect(mapStateToProps)(SearchBox);
