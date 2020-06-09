import React, { Fragment } from 'react';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import queryString from 'query-string';
import { message } from 'antd';
import { Link, withRouter } from 'dva/router';
import { connect } from 'dva';
import styles from './SearchBox.scss';
import { getCurrentUserId } from '../../../models/session/selectors';
import { searchPost } from '../../../models/search/services';
import PostItem from '../../common/PostItem';
import FilterType from './FilterType';
import LoadingIcon from '../../common/LoadingIcon';
const SIZE = 10;
const Loading = () => {
  return (
    <div className={styles.loading}>
      <LoadingIcon />
    </div>
  );
};

class SearchPost extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      postList: [],
      query: queryString.parse(props.location.search).q,
      loading: true,
    };
    this.scrollTop = 0;
  }

  componentDidMount() {
    this.fetchData();
    // const { initialShowCount } = this.props;
    // if (!initialShowCount && this.searchBoxElement) {
    //   this.searchBoxElement.addEventListener('scroll', this.handleScroll);
    // }
  }
  // componentWillUnmount() {
  // this.searchBoxElement.removeEventListener('scroll', this.handleScroll);
  // }

  componentDidUpdate(prevProps) {
    const { query } = this.state;

    if (query !== this.query) {
      this.fetchData(true);
    }
  }
  // 改变filter的类型
  changeFilter = (item, index) => {
    const {
      history: { push },
    } = this.props;
    const { filterIndex } = this.state;
    if (filterIndex === index) {
      this.setState({
        filterIndex: null,
      });
      push(`/search?q=${this.query}`);
    } else {
      this.setState({
        filterIndex: index,
      });
    }
  };

  get query() {
    const { location } = this.props;
    const queryParam = queryString.parse(location.search);
    const { q = '' } = queryParam;

    return q;
  }

  async fetchData(needLatestNews) {
    const { userId, saveSearchNum } = this.props;
    const { postList } = this.state;
    const idSet = postList.reduce((idSet, post) => {
      return idSet.add(post.data.postId || post.data.voteId);
    }, new Set([]));
    try {
      const response = await searchPost({
        userId,
        page: Math.floor(postList.length / SIZE) + 1,
        size: SIZE,
        query: this.query,
      });
      let newPostList = response.data.postAndVoteList || [];
      if (!needLatestNews) {
        newPostList = newPostList.filter(
          (post) => !idSet.has(post.data.postId || post.data.voteId)
        );
      }
      this.setState({
        postList: needLatestNews ? newPostList : postList.concat(newPostList),
        query: this.query,
        loading: false,
      });
      if (newPostList.length) {
        saveSearchNum(newPostList.length);
        return message.success('加載成功', 2.5);
      }
      return message.warning('沒有更多數據', 2.5);
    } catch (error) {
      return message.error('錯誤', 2.5);
    }
  }

  handleScroll = throttle((e) => {
    const clientHeight = this.searchBoxElement.clientHeight;
    const scrollTop = this.searchBoxElement.scrollTop;
    const scrollHeight = this.searchBoxElement.scrollHeight;
    if (
      this.scrollTop < scrollTop &&
      scrollTop + clientHeight + 30 > scrollHeight
    ) {
      this.fetchData();
    }
    this.scrollTop = scrollTop;
  }, 500);

  fetchPost = () => {};

  updatePostLike = (data) => {
    const { id, type, like, likeCount, likeIconType } = data;
    const { postList } = this.state;
    this.setState({
      postList: postList.map((post) => {
        const isSamePost = type === 0 && post.data.postId === id;
        const isSameVote = type === 2 && post.data.voteId === id;
        if (isSamePost || isSameVote) {
          return {
            ...post,
            data: {
              ...post.data,
              like,
              likeCount,
              likeIconType,
            },
          };
        }
        return post;
      }),
    });
  };

  addCommentCount = (data = {}) => {
    const { postId, voteId, commentCount } = data;
    const { postList } = this.state;
    this.setState({
      postList: postList.map((post) => {
        const isSamePost = post.data.postId === postId;
        const isSameVote = post.data.voteId === voteId;
        // FIXME  传入的 postData 没有可供判断帖子/投票类型的字段，所以这样处理
        if (isSamePost && isSameVote) {
          return {
            ...post,
            data: {
              ...post.data,
              commentCount: commentCount + 1,
            },
          };
        }
        return post;
      }),
    });
  };
  deleteCommentCount = (data = {}, count = 0) => {
    const { postId, voteId, commentCount } = data;
    const { postList } = this.state;
    this.setState({
      postList: postList.map((post) => {
        const isSamePost = post.data.postId === postId;
        const isSameVote = post.data.voteId === voteId;
        // FIXME  传入的 postData 没有可供判断帖子/投票类型的字段，所以这样处理
        if (isSamePost && isSameVote) {
          return {
            ...post,
            data: {
              ...post.data,
              commentCount: commentCount - 1 - count,
            },
          };
        }
        return post;
      }),
    });
  };

  deletePost = (postId) => {
    const { postList } = this.state;
    this.setState({
      postList: postList.filter((post) => {
        return post.data.postId !== postId && post.data.voteId !== postId;
      }),
    });
  };

  updatePost = (newPost) => {
    const { postList } = this.state;
    this.setState({
      postList: postList.map((post) => {
        if (get(post, 'data.postId') === get(newPost, 'data.postId')) {
          message.info('編輯成功');
          return newPost;
        }
        return post;
      }),
    });
  };

  addShareCount = (data = {}) => {
    const { postId, voteId, shareCount } = data;
    const { postList } = this.state;
    this.setState({
      postList: postList.map((post) => {
        const isSamePost = post.data.postId === postId;
        const isSameVote = post.data.voteId === voteId;
        // FIXME  传入的 postData 没有可供判断帖子/投票类型的字段，所以这样处理
        if (isSamePost && isSameVote) {
          return {
            ...post,
            data: {
              ...post.data,
              shareCount: shareCount + 1,
            },
          };
        }
        return post;
      }),
    });
  };

  render() {
    const { initialShowCount } = this.props;
    const { postList, loading } = this.state;
    return (
      <>
        <FilterType query={this.query} isShow={'post'} />
        {loading ? (
          Loading()
        ) : (
          <Fragment>
            <header className={`${styles.header} ${styles.splitLine}`}>
              <span>貼文</span>
              {initialShowCount && (
                <Link
                  to={`/search/post${
                    this.query ? `?q=${this.query.replace('#', '%23')}` : ''
                  }`}
                >
                  查看全部
                </Link>
              )}
            </header>
            <div
              className={!initialShowCount ? styles.searchBox : ''}
              onScroll={this.handleScroll}
              ref={(node) => (this.searchBoxElement = node)}
            >
              {postList.map((post, i) => {
                if (i >= initialShowCount) {
                  return null;
                }
                const { type, data, createTs } = post;
                const { postId, voteId, userId, followName } = data;
                const id = type === 'post' ? postId : voteId;
                return (
                  <PostItem
                    userId={userId}
                    followName={followName}
                    key={id}
                    createTs={createTs}
                    postData={data}
                    postId={id}
                    targetType={type}
                    searchDeletePost={this.deletePost}
                    searchUpdatePost={this.updatePost}
                    openComment={false}
                    searchUpdatePostLike={this.updatePostLike}
                    searchAddCommentCount={this.addCommentCount}
                    searchAddShareCount={this.addShareCount}
                    searchDeleteCommentCount={this.deleteCommentCount}
                    query={this.query}
                    history={this.props.history}
                  />
                );
              })}
            </div>
          </Fragment>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: getCurrentUserId(state),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    searchGroup: (query, userId) => {
      dispatch({
        type: 'search/getSearchGroup',
        payload: {
          query,
          userId,
        },
      });
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
  )(SearchPost)
);
