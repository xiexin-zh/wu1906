import React from 'react';
import { connect } from 'dva';
import ShareSp from '../PostItem/component/ShareToSp';
import ShareIm from '../PostItem/component/ShareToIm';
function SharePage(props) {
  const { shareTo, shareVisible, detailsInfo, dispatch } = props;

  const handleShareFalse = () => {
    dispatch({
      type: 'postsPopup/handleShareFalse',
    });
  };
  const addShareCount = () => {
    dispatch({
      type: 'postsPopup/addShareCount',
    });
  };
  return (
    <>
      {shareVisible &&
        {
          sp: (
            <ShareSp
              shareVisible={shareVisible}
              followName={detailsInfo.data.followName}
              handleShareFalse={handleShareFalse}
              userId={detailsInfo.data.userId}
              postId={detailsInfo.data.postId}
              top={detailsInfo.data.top}
              groupId={detailsInfo.data.groupId}
              seccessCallback={addShareCount}
              postData={detailsInfo.data}
            />
          ),
          im: (
            <ShareIm
              shareVisible={shareVisible}
              userId={detailsInfo.data.userId}
              postId={detailsInfo.data.postId}
              targetType={detailsInfo.type}
              handleShareFalse={handleShareFalse}
              seccessCallback={addShareCount}
              postData={detailsInfo.data}
            />
          ),
        }[shareTo]}
    </>
  );
}
SharePage.propTypes = {};
function mapStateToProps(state) {
  return {
    shareTo: state.postsPopup.get('shareTo'),
    shareVisible: state.postsPopup.get('shareVisible'),
    detailsInfo: state.postsPopup.get('detailsInfo'),
  };
}
export default connect(mapStateToProps)(SharePage);
