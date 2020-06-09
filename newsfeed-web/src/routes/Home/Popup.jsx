import React from 'react';
import { connect } from 'dva';

import PeopleTagger from 'components/common/PeopleTagger';

const popupWrapperStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
};

function Popup({ showCreatePostDialog }) {
  return (
    <div style={popupWrapperStyle}>
      {showCreatePostDialog && <PeopleTagger />}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    showCreatePostDialog: state.posts.get('showCreatePostDialog'),
  };
}

export default connect(mapStateToProps)(Popup);
