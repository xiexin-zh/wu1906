import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Skeleton, Empty } from 'antd';
import throttle from 'lodash/throttle';
import PostItem from '../PostItem';
import styles from './PostList.css';
import { getAllPost } from '../../../models/posts/actions';
import ReactDom from 'react-dom';
const postListBoxStyle = {
  allGroup: styles.panelMain,
  all: styles.panelMain,
  group: styles.personalMain,
  user: styles.personalMainUser,
};

class PostList extends React.PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    openComment: PropTypes.bool,
  };

  static defualtProps = {
    openComment: true,
    scrollPage: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      postList: [],
      videoIndex: 0,
    };
    this.scrollTop = 0;
  }

  componentDidMount() {
    const { backgroundAndHeadAnmiation, emptyPostListData } = this.props;
    emptyPostListData();
    backgroundAndHeadAnmiation(false);
    this.fetchData();
    this.panelMain.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    this.panelMain.removeEventListener('scroll', this.handleScroll);
  }

  async fetchData() {
    const { getAllPost } = this.props;
    await getAllPost();
  }

  winScroll = () => {
    let { videoIndex } = this.state; // 设置一个初始值，来获取div盒子
    let clientData = window.innerHeight; // 获取可视区的大小
    const DOMobj = ReactDom.findDOMNode(this.refs[`item_${videoIndex}`]);
    if (DOMobj) {
      let viedos = DOMobj.getElementsByTagName('video'); // 获取盒子下的video标签
      let cliHeight = (clientData - DOMobj.offsetHeight) / 2; // 这里的cliHeight 是设置一个滑动的范围
      let arr = DOMobj.offsetTop - this.panelMain.scrollTop - 125 - 164; //用来保存获取到盒子距离顶部的距离
      // 判断当前盒子是否含有video
      if (viedos.length === 1) {
        // 当有资源下载的时候才能执行
        if (viedos[0].networkState === 1) {
          // 滑动到此范围内播放，滑出暂停
          if (arr <= cliHeight && -arr <= DOMobj.offsetHeight / 2) {
            viedos[0].play();
          } else {
            viedos[0].pause();
          }
        }
      }
      this.changeVideoIndex(DOMobj); // 获取下一个盒子的方法
    }
  };

  changeVideoIndex = (DOMobj) => {
    let { videoIndex } = this.state;
    let arr = DOMobj.offsetTop - this.panelMain.scrollTop - 125 - 164;
    if (-arr > DOMobj.offsetHeight / 2 - 100) {
      this.setState({
        videoIndex: (videoIndex += 1),
      });
    } else if (-arr < 0) {
      if (videoIndex > 0) {
        this.setState({
          videoIndex: (videoIndex -= 1),
        });
      }
    }
  };

  handleScroll = throttle(() => {
    const { backgroundAndHeadAnmiation, type: routeType, showBg } = this.props;
    const windowHeight = this.panelMain.clientHeight;
    const scrollTop = this.panelMain.scrollTop;
    const scrollHeight = this.panelMain.scrollHeight;
    // console.log(scrollTop)
    this.winScroll();
    // console.log(this.getElementViewTop(ReactDom.findDOMNode(this.refs.item_1)));
    // 动画
    const performAnimation =
      scrollTop === 0 && (routeType === 'user' || routeType === 'group');
    if (performAnimation) {
      backgroundAndHeadAnmiation(false);
    } else {
      backgroundAndHeadAnmiation(true);
    }
    if (
      this.scrollTop < scrollTop &&
      scrollTop + windowHeight + 30 > scrollHeight
    ) {
      this.fetchData();
    }
    if (scrollTop === 0 && showBg) {
      showBg();
    }
    this.scrollTop = scrollTop;
  }, 200);

  render() {
    const {
      userData,
      openComment,
      followedUsers,
      type: routeType,
      postListHeader,
      models_postList_data,
      scrollState,
      albumSet,
      pageType,
    } = this.props;
    if (!userData) {
      return null;
    }
    return (
      <div
        id="postList"
        style={Boolean(scrollState) ? {} : { overflow: 'hidden' }}
        className={postListBoxStyle[routeType]}
        ref={(node) => {
          this.panelMain = node;
        }}
      >
        {postListHeader}
        {albumSet}
        <div className={styles.postWrapper}>
          {models_postList_data.length ? (
            models_postList_data.map((item, index) => {
              const { type, data, createTs, commentListResultBean } = item;
              const { postId, voteId, userId, followName } = data;
              const id = type === 'post' ? postId : voteId;
              if (pageType && pageType === 'user' && type === 'vote') {
                return '';
              }

              return userId ? (
                <PostItem
                  ref={`item_${index}`}
                  userId={userId}
                  followName={followName}
                  key={id}
                  createTs={createTs}
                  postData={data}
                  postId={id}
                  targetType={type}
                  followedUsers={followedUsers}
                  setSyncTs={this.props.setSyncTs}
                  openComment={Boolean(data.openComment || openComment)}
                  fetchData={this.fetchData}
                  routeType={routeType}
                  commentListResultBean={commentListResultBean}
                />
              ) : (
                <Skeleton loading={true} avatar paragraph={{ rows: 4 }} />
              );
            })
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  <FormattedMessage
                    id="Post.NoDynamic"
                    defaultMessage="暫未有最新動態"
                  />
                </span>
              }
            />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let followedUsers = state.users.get('ownFollowUserList').toJS();
  // models postList
  let models_postList_data = state.posts.get('postList').toJS();
  return {
    // startAnimation: state.posts.get('startAnimation'),
    userData: state.users.get('ownInfo'),
    followedUsers,
    models_postList_data,
    avatarState: state.posts.get('avatarState'),
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { type, groupId, userId } = ownProps;
  return {
    getAllPost: () => {
      return dispatch(
        getAllPost({
          type,
          groupId,
          userId,
        })
      );
    },
    backgroundAndHeadAnmiation: (startAnimation) => {
      dispatch({
        type: 'posts/backgroundAndHeadAnmiation',
        payload: startAnimation,
      });
    },
    emptyPostListData: () => {
      dispatch({ type: 'posts/emptyPostListData' });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostList);
