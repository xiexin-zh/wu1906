import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'dva';
import styles from './index.css';
import InfoCount from './component/InfoCount';
import { Popover, Select } from 'antd';
import classnames from 'classnames';
import CommentItem from './component/CommentItem';
// import ImgContainer from './component/ImgContainer';
import UserAvatar from '../UserAvatar';
import GroupAvatar from '../GroupAvatar';
import Mention from '../Mention/Mention';

import HotComment from './component/HotComment';

const { Option } = Select;

function FeedStory(props) {
  const {
    likeCount,
    commentCount,
    shareCount,
    isLike,
    isInputShow,
    // avatarUrl,
    // inputVal,
    postId,
    commentList,
    handleLike,
    handleInputShow,
    // handleInputChange,
    handleEnter,
    noMore,
    getComment,
    handleShare,
    targetType,
    // currentUser,
    userData,
    openComment,
    popoverPlacement,
    selfUserId,
    postData,
    ableToShare,
    ownPost,
    updateCommentState,
    deleteCommentOfOne,
    identityOptions,
    commentIdentity,
    changeCommentIdentity,
    isGroupPostAdmin,
    secondCommentIdentity,
    changeSecondCommentIdentity,
    connectList,
    // getMentionList,
    getChildState,
    commentListResultBean,
    getPostConnect,
    emojiKeyType,
    getCommentAttached,
    removerFileList,
    isCanComment,
    absolute,
    fileList,
    // mentionList,
    // removeMentionList,
    likeEmojiLike,
    likeContent,
    hotCommentShow,
    commentChange,
  } = props;
  let popularCommentId = '';
  if (commentListResultBean) {
    popularCommentId = commentListResultBean.commentId;
  }

  const renderShare = (
    <div className={styles.renderShare}>
      <p
        className={styles.shareMsg}
        onClick={() => handleShare('sp', targetType)}
      >
        分享
      </p>
      <p
        className={styles.shareToSp}
        onClick={() => handleShare('im', targetType)}
      >
        分享至 SunPeople Chat
      </p>
    </div>
  );
  const { groupId } = postData;

  return (
    <div>
      <div>
        <InfoCount
          likeCount={likeCount}
          commentCount={commentCount}
          shareCount={shareCount}
          targetType={targetType}
          postId={postId}
          handleInputShow={handleInputShow}
          userData={userData}
          ableToShare={ableToShare}
        ></InfoCount>
        <div className={styles.postItemBtns}>
          <div
            className={styles.likeEmoji}
            onClick={(e) => handleLike(e, 1, likeEmojiLike[0].pic, true)}
          >
            <div className={styles.emojiList}>
              {likeEmojiLike.map((item) => {
                const { title, type, pic } = item;
                return (
                  <div
                    onClick={(e) => handleLike(e, type, pic, false)}
                    className={styles.emojiIcon}
                    key={type}
                  >
                    <img src={pic} alt="" />
                    <span className={styles.emojiTitle}>{title}</span>
                  </div>
                );
              })}
            </div>
            <span
              className={
                (isLike ? styles.liked : styles.nolike) + ' ' + styles.likeBtn
              }
            >
              <img
                src={
                  isLike ? likeContent : require('./component/icons/nolike.png')
                }
                alt=""
              />
            </span>
            <span>贊</span>
          </div>
          {isCanComment() && (
            <div onClick={handleInputShow}>
              <span className={styles.msgBtn}></span>
              留言
            </div>
          )}
          {ableToShare && (
            <div>
              <Popover
                placement={popoverPlacement}
                content={renderShare}
                trigger="click"
                overlayStyle={{
                  zIndex: popoverPlacement === 'rightTop' ? 998 : 1000,
                }}
              >
                <div className={styles.shareContent}>
                  <span className={styles.shareBtn}></span>
                  分享
                </div>
              </Popover>
            </div>
          )}
        </div>
      </div>
      <div>
        {isCanComment() && (
          <div
            className={classnames({
              [styles.inputContainer]: true,
              [styles.inputContainerNew]: !!groupId && isGroupPostAdmin,
            })}
            style={isInputShow ? { display: 'block' } : { display: 'none' }}
          >
            <div className={styles.flex}>
              <div className={styles.flexL}>
                {commentIdentity === 0 ? (
                  <GroupAvatar size={36} groupId={groupId} />
                ) : (
                  <UserAvatar userId={selfUserId} size={36} />
                )}
              </div>

              <div className={styles.flexR}>
                <div className={styles.flexHarder}>
                  <div style={{ flex: '1' }}>
                    {!!groupId && isGroupPostAdmin && (
                      <div className={styles.identityOptions}>
                        {identityOptions.map((option, index) => {
                          return (
                            <span
                              onClick={() =>
                                changeCommentIdentity(option.identityType)
                              }
                              key={option.identityType}
                              className={classnames({
                                [styles.optionsSelect]: true,
                                [styles.identityActive]:
                                  option.identityType === commentIdentity,
                              })}
                            >
                              {option.identityName}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {/* 一级留言 */}
                <div>
                  <Mention
                    onChange={getChildState}
                    // getMentionList={getMentionList}
                    mentions={connectList}
                    handleEnter={handleEnter}
                    editorType={3}
                    isClearContent={!isInputShow}
                    emojiKey={`${postId}_${emojiKeyType}`}
                    getCommentAttached={getCommentAttached}
                    removerFileList={removerFileList}
                    absolute={absolute}
                    fileList={fileList}
                    messageLevel={1}
                    // mentionList={mentionList}
                    // removeMentionList={removeMentionList}
                  />
                </div>
              </div>
            </div>
            <div className={styles.icon}>{/* <Icon type="smile" /> */}</div>
          </div>
        )}
        {/* 最热评论 */}
        {commentCount !== 0 &&
          !isInputShow &&
          commentListResultBean &&
          hotCommentShow && (
            <HotComment
              commentListResultBean={commentListResultBean}
              connectList={connectList}
              postData={postData}
              targetType={targetType}
              getComment={getComment}
              ownPost={ownPost}
              updateCommentState={updateCommentState}
              deleteCommentOfOne={deleteCommentOfOne}
              identityOptions={identityOptions}
              isGroupPostAdmin={isGroupPostAdmin}
              openComment={openComment}
              details={props.details}
              isInputShow={isInputShow}
              handleInputShow={handleInputShow}
              getPostConnect={getPostConnect}
              targetId={postId}
              changeSecondCommentIdentity={changeSecondCommentIdentity}
              secondCommentIdentity={secondCommentIdentity}
            />
          )}
        {isInputShow && commentChange && (
          <div
            style={
              commentList.length > 0
                ? { display: 'block' }
                : { display: 'none' }
            }
            className={styles.commentSelect}
          >
            <Select
              defaultValue="orderByNew"
              style={{ width: 120 }}
              onChange={commentChange}
            >
              <Option value="orderByNew">由新到舊</Option>
              <Option value="orderByHot">最熱門</Option>
              <Option value="orderByAll">所有評論</Option>
            </Select>
          </div>
        )}
        <div style={isInputShow ? { display: 'block' } : { display: 'none' }}>
          {commentList.map((item, index) => {
            const { replyIdentityType } = item;
            return (
              <CommentItem
                popularCommentId={popularCommentId}
                key={item.commentId}
                openComment={openComment}
                postData={postData}
                targetId={postId}
                commentInfo={item}
                targetType={targetType}
                getComment={getComment}
                ownPost={ownPost}
                updateCommentState={updateCommentState}
                deleteCommentOfOne={deleteCommentOfOne}
                identityOptions={identityOptions}
                isGroupPostAdmin={isGroupPostAdmin}
                secondCommentIdentity={secondCommentIdentity}
                changeSecondCommentIdentity={changeSecondCommentIdentity}
                groupId={groupId}
                firstReplyIdentityType={replyIdentityType}
                details={props.details}
                searchDeleteCommentCount={props.searchDeleteCommentCount}
                searchAddCommentCount={props.searchAddCommentCount}
                isInputShow={isInputShow}
                connectList={connectList}
                handleInputShow={handleInputShow}
                emojiKeyType={emojiKeyType}
                getCommentAttached={getCommentAttached}
                removerFileList={removerFileList}
                absolute={absolute}
              />
            );
          })}
        </div>
        {!noMore && (
          <button
            onClick={getComment}
            className={styles.loadMoreComment}
            style={isInputShow ? { display: 'block' } : { display: 'none' }}
          >
            顯示更多
          </button>
        )}
      </div>
    </div>
  );
}

FeedStory.propTypes = {
  openComment: PropTypes.bool.isRequired,
};

export default FeedStory;
