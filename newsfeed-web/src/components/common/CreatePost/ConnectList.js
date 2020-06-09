import React from 'react';
import PropTypes, { string } from 'prop-types';
import { connect } from 'dva';
import { Input } from 'antd';
import throttle from 'lodash/throttle';
import UserAvatar from '../UserAvatar';
import GroupAvatar from '../GroupAvatar';
import styles from './CreatePost.scss';

class ConnectList extends React.Component {
  static propTypes = {
    clickListItem: PropTypes.func,
    connectList: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      listSize: 10,
      connectList: [],
    };
  }

  onScroll = (event) => {
    const listBoxHeight = this.listBox.clientHeight;
    const listContentHeight = this.listBox.scrollHeight;
    const scrollTop = this.listBox.scrollTop;
    if (listContentHeight - listBoxHeight === scrollTop) {
      this.setState({
        listSize: this.state.listSize + 5,
      });
    }
  };

  changeList = (e) => {
    const { connectList } = this.props;
    const value = e.target.value;
    if (value) {
      let newList = [];
      if (new RegExp('[\\u4E00-\\u9FFF]+', 'g').test(value)) {
        newList = connectList.filter((item) => {
          const name = item.name || item.fullName;
          return name.indexOf(value) != -1;
        });
      } else {
        newList = connectList
          .filter((item) => {
            const name = item.name || item.fullName;
            return name.toUpperCase().indexOf(value.toUpperCase()) != -1;
          })
          .sort((a, b) => {
            return a.name > b.name ? 1 : -1;
          });
      }
      this.setState({
        connectList: newList,
      });
    } else {
      this.setState({
        connectList,
      });
    }
  };

  clickItem = (item) => {
    const { clickListItem, setConnectList } = this.props;

    clickListItem(item);
    setConnectList();
    this.setState({
      listSize: 10,
    });
  };

  render() {
    const { listSize, connectList } = this.state;
    // const { connectList } = this.props;
    return (
      <div className={styles.showList}>
        <p style={{ fontWeight: 400 }}>請輸入或選擇您要@的人或組</p>
        <Input
          onChange={this.changeList}
          style={{ border: '1px solid #ccc' }}
        />
        {connectList.length > 0 && (
          <div
            className={connectList.length > 5 ? styles.selectList : ''}
            onScroll={this.onScroll}
            ref={(el) => (this.listBox = el)}
          >
            {connectList.slice(0, `${listSize}`).map((item) => {
              const { id, name, fullName, type } = item;
              return (
                <div
                  className={styles.listItem}
                  onClick={() => this.clickItem(item)}
                  key={id}
                >
                  <div className={styles.itemAvatar}>
                    {type === 'user' ? (
                      <UserAvatar userId={id} />
                    ) : (
                      <GroupAvatar groupId={id} />
                    )}
                  </div>
                  <div className={styles.itemName}>{name || fullName}</div>
                  <div className={styles.itemIcon}>
                    <img
                      src={
                        type === 'user'
                          ? require('./icon/person.png')
                          : require('./icon/group.png')
                      }
                      alt=""
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ConnectList);
