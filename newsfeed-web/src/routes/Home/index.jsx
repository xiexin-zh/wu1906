import React from 'react';
// import { connect } from 'dva';
import Popup from './Popup';
import styles from './Home.css';

import Header from './Header';
import Main from '../../components/Main';
import ExploreCreateGroup from '../../components/common/ExploreCreateGroup';
import NoticeDetailsPopup from '../../components/common/NoticeDetailsPopup';
import SharePage from '../../components/common/SharePage';
import ApplyConfirm from '../../components/common/AllNotice/ApplyConfirm';

function Home(props) {
  return (
    <div className={styles.wrapper}>
      <Header />
      <Main />
      <Popup />
      {/* 創建/探索群組組件 */}
      <ExploreCreateGroup />
      {/* 通知中 post/vote 详情*/}
      <NoticeDetailsPopup />
      {/* 分享到 sp/im 的弹出层 */}
      <SharePage />
      {/* 通知中 同意/拒絕如群申請 */}
      <ApplyConfirm />
    </div>
  );
}
export default Home;
