import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Link, withRouter } from 'dva/router';
import { connect } from 'dva';
import get from 'lodash/get';
import headerStyles from '../SearchBox.scss';
import styles from './SearchGroup.scss';
import { getCurrentUserId } from '../../../../models/session/selectors';
import { searchGroup } from '../../../../models/search/services';
import Group from './Group';
import { getGroupDetails } from '../../../../models/groupInfo/actions';
import FilterType from '../FilterType';
import LoadingIcon from '../../../common/LoadingIcon';

function SearchGroup(props) {
  const {
    initialShowCount,
    userId,
    location,
    groupMap,
    getGroupDetail,
    toGroupDetail,
    saveSearchNum,
  } = props;
  const Loading = () => {
    return (
      <div className={styles.loading}>
        <LoadingIcon />
      </div>
    );
  };
  const queryParam = queryString.parse(location.search);
  const { q: query = '' } = queryParam;
  const [publicGroups, setPublicGroup] = useState([]);
  const [secretGroups, setSecretGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (query) {
      getData();
    }
    async function getData() {
      const response = await searchGroup({ query, userId });
      const publicGroupList = get(response, 'data.publicGroupList', []);
      const secretGroupList = get(response, 'data.secretGroupList', []);

      setPublicGroup(publicGroupList);
      setSecretGroup(secretGroupList);
      const num = [...publicGroupList].concat([...secretGroupList]);
      // console.log(num);
      // 得到群组搜索结果
      saveSearchNum(num.length);

      [...publicGroupList, ...secretGroupList].forEach((group) => {
        if (!groupMap.get(group.groupId)) {
          getGroupDetail(group.groupId);
        }
      });
      setLoading(false);
    }
  }, [userId, query]);

  async function updateData() {
    const response = await searchGroup({ query, userId });
    const publicGroupList = get(response, 'data.publicGroupList', []);
    const secretGroupList = get(response, 'data.secretGroupList', []);

    setPublicGroup(publicGroupList);
    setSecretGroup(secretGroupList);
    const num = [...publicGroupList].concat([...secretGroupList]);
    // 得到群组搜索结果
    saveSearchNum(num.length);

    [...publicGroupList, ...secretGroupList].forEach((group) => {
      if (!groupMap.get(group.groupId)) {
        getGroupDetail(group.groupId);
      }
    });
    setLoading(false);
  }

  return (
    <div>
      <FilterType query={query} isShow={'group'} />
      {loading ? (
        Loading()
      ) : (
        <Fragment>
          <header className={headerStyles.header}>
            <span>
              群組 (共 {publicGroups.length + secretGroups.length} 個）
            </span>
            {initialShowCount && (
              <Link
                to={`/search/group${
                  query ? `?q=${query.replace('#', '%23')}` : ''
                }`}
              >
                查看全部
              </Link>
            )}
          </header>
          <section>
            <header className={styles.header}>
              公開群組 （共 {publicGroups.length} 個）{' '}
            </header>
            <div className={styles.groupWrapper}>
              {publicGroups.slice(0, initialShowCount).map((item, i) => {
                const group = groupMap.get(item.groupId);
                if (!group) {
                  return null;
                }
                return (
                  <Group
                    onClick={toGroupDetail}
                    key={group.groupId}
                    group={group}
                    isPublic={true}
                    updateData={updateData}
                  />
                );
              })}
            </div>
          </section>
          {secretGroups.length > 0 && (
            <section>
              <header className={styles.header}>
                非公開群組 （共 {secretGroups.length} 個）{' '}
              </header>
              <div className={styles.groupWrapper}>
                {secretGroups.slice(0, initialShowCount).map((item, i) => {
                  const group = groupMap.get(item.groupId);
                  if (!group) {
                    return null;
                  }
                  return (
                    <Group
                      onClick={toGroupDetail}
                      key={group.groupId}
                      group={group}
                      isPublic={false}
                      updateData={updateData}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </Fragment>
      )}
    </div>
  );
}

SearchGroup.propTypes = {
  userId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  initialShowCount: PropTypes.number,
};

function mapStateToProps(state) {
  return {
    userId: getCurrentUserId(state),
    groupMap: state.groupInfo.get('groupMap'),
  };
}

function mapDispatchToProps(dispatch, props) {
  const {
    history: { push },
  } = props;
  return {
    getGroupDetail: (groupId) => getGroupDetails(groupId),
    toGroupDetail: (groupId) => {
      push(`/groups/${groupId}`);
    },
    saveSearchNum: (num) => {
      dispatch({
        type: 'search/saveSearchNum',
        payload: num,
      });
    },
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchGroup)
);
