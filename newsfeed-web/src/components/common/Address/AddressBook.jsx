import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import { connect } from 'dva';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import memoize from 'memoize-one';
import throttle from 'lodash/throttle';
import isFunction from 'lodash/isFunction';
import { Icon } from 'antd';

import styles from './AddressBook.css';
import adapter from 'utils/membersAdapter';
import Member from 'components/common/Contacts/Member';
import LoadingIcon from 'components/common/LoadingIcon';
import { isShow } from './utils';

const INITIAL_SIZE = 50;
const LOAD_SIZE = 50;

class AddressBook extends React.PureComponent {
  static propTypes = {
    // name: PropTypes.string,
    intl: intlShape.isRequired,
    memberList: PropTypes.arrayOf(PropTypes.object),
    searchValue: PropTypes.string,

    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    checkedList: PropTypes.arrayOf(PropTypes.string),

    onClick: PropTypes.func,
    checkedItemId: PropTypes.string,

    showList: PropTypes.object,
    followUserMap: PropTypes.object,

    renderItem: PropTypes.func,
    renderHeader: PropTypes.func,
    showCount: PropTypes.number,
    disableTip: PropTypes.bool,
  };
  static defaultProps = {
    multiple: true,
    checkedList: [], // 選擇中成員 ID list 用於多選
    checkedItemId: '', // 選擇中成員 ID 用於單選
    onChange: null,
    searchValue: null,
    showList: null,
    renderItem: null,
    renderHeader: null,
    showCount: null,
    disableTip: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { searchValue: propSearch } = props;
    const { searchValue: stateSearch } = state;
    if (propSearch !== null && propSearch !== stateSearch) {
      return {
        ...state,
        searchValue: propSearch,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { searchValue } = props;
    this.state = {
      showMemberNum: INITIAL_SIZE,
      loadMoreSize: LOAD_SIZE,
      searchValue: searchValue || '',
      showTip: false,
    };
    this.loadMore = this.loadMore.bind(this);
    this.itemClick = this.itemClick.bind(this);
    this.addressSearchChange = throttle(
      this.addressSearchChange.bind(this),
      300
    );
    this.onScroll = throttle(this.onScroll.bind(this), 300);
    this.scrollTop = 0;
  }

  componentDidUpdate() {
    const { newInitScrollTop } = this.state;
    if (newInitScrollTop) {
      const scrollBox = this.scrollBox;
      scrollBox.scrollTop = 0;
    }
  }

  // 根據搜索字元 filterText 返回過濾後的 memberList
  filter = memoize((members, filterText, showList) => {
    if (Immutable.Map.isMap(members)) {
      members = [...members.values()];
    }
    if (showList && Immutable.Set.isSet(showList)) {
      members = members.filter((member) => showList.has(member.id));
    } else if (showList && Immutable.Map.isMap(showList)) {
      members = members.filter((member) => showList.has(member.id));
    }
    return members.filter(isShow(filterText));
  });

  classificationHandle = memoize((memberList) => {
    if (Immutable.Map.isMap(memberList)) {
      return adapter([...memberList.values()]);
    }
    return adapter(memberList);
  });

  addressSearchChange() {
    const newSearchValue = this.addressSearch.value;
    const scrollBox = this.scrollBox;
    const { searchValue } = this.state;
    if (searchValue !== newSearchValue) {
      scrollBox.scrollTop = 0;
      this.setState({
        searchValue: newSearchValue,
        showMemberNum: INITIAL_SIZE,
      });
    }
  }

  onScroll() {
    const scrollBox = this.scrollBox;
    if (
      scrollBox.scrollHeight - scrollBox.clientHeight - scrollBox.scrollTop <
        100 &&
      this.scrollTop < scrollBox.scrollTop
    ) {
      this.loadMore();
    }
    this.scrollTop = scrollBox.scrollTop;
  }

  loadMore() {
    const { showMemberNum, loadMoreSize, showTip } = this.state;
    this.setState({ showMemberNum: showMemberNum + loadMoreSize });
    if (showMemberNum > 300 && !showTip) {
      this.setState({
        showTip: true,
      });
      setTimeout(() => {
        this.setState({
          showTip: false,
        });
      }, 5000);
    }
  }

  itemClick(e, memberItem) {
    const { onClick } = this.props;
    const { sendMessage } = this.props;
    if (!!sendMessage) {
      sendMessage(memberItem);
    } else {
      const id = e.currentTarget.dataset.id;
      if (isFunction(onClick)) {
        onClick(id);
      }
    }
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  render() {
    const {
      checkedList = [],
      multiple,
      onClick,
      onChange,
      checkedItemId,
      intl,
      memberList: propMemberList,
      searchValue: propSearchValue,
      memberMap,
      loading,
      showList,
      followUserMap,
      // sendMessage,
      renderItem,
      renderHeader,
      showCount,
      buttonClassName,
      disableTip,
    } = this.props;
    if (loading || memberMap.size === 0) {
      return (
        <div className={styles.loadingBox}>
          <LoadingIcon />
        </div>
      );
    }
    const { searchValue, showMemberNum, showTip } = this.state;
    let renderNum = 0;

    const memberList = this.filter(
      propMemberList || memberMap,
      searchValue,
      showList
    );
    const address_list = this.classificationHandle(memberList);
    const placeholderSearch = intl.formatMessage({ id: 'Address.Search' });
    return (
      <div className={styles.addressBox} id="addressBox">
        {renderHeader && renderHeader(memberList.length)}
        {propSearchValue === null && (
          <div className={styles.searchBg}>
            <label htmlFor="addressSearch" className={styles.searchImg}>
              <Icon type="search" className={styles.searchIcon} />
              <input
                type="text"
                id="addressSearch"
                className={styles.searchIput}
                placeholder={placeholderSearch}
                ref={(node) => (this.addressSearch = node)}
                onChange={this.addressSearchChange}
                defaultValue={searchValue}
              />
            </label>
          </div>
        )}
        <div
          className={styles.scrollBox}
          ref={(node) => (this.scrollBox = node)}
          onScroll={this.onScroll}
        >
          {address_list &&
            address_list.map((item) => {
              if (
                renderNum >= showMemberNum ||
                (showCount !== null && renderNum >= showCount)
              ) {
                return null;
              }
              return (
                <dl key={item.index_symbol} className={styles.addressPart}>
                  <dt className={styles.index}>{item.index_symbol}</dt>
                  {item.list &&
                    item.list.map((memberItem) => {
                      const memberId = memberItem.id;
                      const member = memberMap[memberId] || memberItem;
                      if (
                        renderNum >= showMemberNum ||
                        (showCount !== null && renderNum >= showCount)
                      ) {
                        return null;
                      }
                      const item_class = classnames({
                        [styles.addressItem]: true,
                        [styles.itemActive]: checkedItemId === memberId,
                        'cursor-pointer': !!onClick,
                      });
                      renderNum += 1;

                      return (
                        <dd
                          role="presentation"
                          key={memberId}
                          className={item_class}
                          onClick={(e) => this.itemClick(e, memberItem)}
                          data-id={memberId}
                        >
                          {renderItem ? (
                            renderItem(member)
                          ) : (
                            <Member
                              checked={checkedList.includes(memberId)}
                              id={memberId}
                              itemHeight={42}
                              avatarSize={30}
                              member={member}
                              onChange={multiple ? onChange : null}
                              buttonClassName={buttonClassName}
                              followed={
                                followUserMap
                                  ? followUserMap.has(memberId)
                                  : null
                              }
                            />
                          )}

                          {memberList.length === renderNum &&
                            this.noMoreWrapper &&
                            !disableTip &&
                            ReactDOM.createPortal(
                              <div onClick={this.stopPropagation}>
                                <FormattedMessage id="Address.NoMoreAddress" />
                              </div>,
                              this.noMoreWrapper
                            )}
                        </dd>
                      );
                    })}
                </dl>
              );
            })}
          <div
            className={styles.noMore}
            ref={(node) => (this.noMoreWrapper = node)}
          ></div>
        </div>
        {showTip && !disableTip && (
          <div className={styles.tip}>
            <p>
              <FormattedMessage id="Address.ShowAddressMore" />
            </p>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    memberMap: state.members.get('memberMap'),
    loading: state.members.get('membersLoading'),
  };
}

export default connect(mapStateToProps)(injectIntl(AddressBook));
