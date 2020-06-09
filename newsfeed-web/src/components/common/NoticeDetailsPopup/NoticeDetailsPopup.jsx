import React from 'react';
import { connect } from 'dva';
import PostDetails from './PostDetails';
import VoteDetails from './VoteDetails';

function NoticeDetailsPopup(props) {
  const { showPostPopup, detailsInfo } = props;

  const handleCancel = () => {
    const { dispatch } = props;
    dispatch({
      type: 'postsPopup/postModalState',
      payload: {
        showPostPopup: false,
      },
    });

    dispatch({
      type: 'postsPopup/saveFileItem',
      payload: {
        fileItem: {},
        files: [],
      },
    });
  };
  return (
    <>
      {showPostPopup &&
        {
          post: (
            <PostDetails
              detailsInfo={detailsInfo}
              showPostPopup={showPostPopup}
              handleCancel={handleCancel}
            />
          ),
          vote: (
            <VoteDetails
              detailsInfo={detailsInfo}
              showPostPopup={showPostPopup}
              handleCancel={handleCancel}
            />
          ),
        }[detailsInfo.type]}
    </>
  );
}
NoticeDetailsPopup.propTypes = {};
function mapStateToProps(state) {
  return {
    showPostPopup: state.postsPopup.get('showPostPopup'),
    detailsInfo: state.postsPopup.get('detailsInfo'),
  };
}
export default connect(mapStateToProps)(NoticeDetailsPopup);
