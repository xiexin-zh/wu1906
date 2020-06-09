import React, { useState } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import ExploreGroup from '../ExploreGroup';
import styles from './ExploreCreateGroupButton.css';

// 通過參數 type 判斷當前展示的按鈕式在哪個頁面，控制樣式的不同
const btnStyles = {
  group: styles.groupBtn, //群組中的樣式
  personal: styles.personalBtn, //個人中的樣式
};

function ExploreCreateGroupButton(props) {
  const { type, dispatch } = props;
  const personalPageBtn = Object.is(type, 'personal');
  let [isOpen, setIsOpen] = useState(false);

  function openExploreGroup() {
    setIsOpen(true);
  }
  function cancelExploreGroup() {
    setIsOpen(false);
  }
  const createExplorationGroupFun = (title) => {
    dispatch({
      type: 'updatePersonalGroupInfo/showExploreCreateGroupActive',
      payload: title,
    });
  };

  return (
    <>
      {personalPageBtn && (
        <p className={styles.trackingGroup}>
          <FormattedMessage
            id="Group.TrackingGroup"
            defaultMessage="追蹤群組"
          />
        </p>
      )}
      <div
        className={type === 'personal' ? styles.personalBtnBox : styles.btnBox}
      >
        <button
          className={`${styles.button} ${btnStyles[type]}`}
          onClick={() => createExplorationGroupFun('Group.CreateGroup')}
        >
          <FormattedMessage id="Group.CreateGroup" />
        </button>
        <button
          className={`${styles.button} ${btnStyles[type]}`}
          onClick={openExploreGroup}
        >
          <FormattedMessage id="Group.ExplorationGroup" />
        </button>
        {isOpen && (
          <ExploreGroup isOpen={isOpen} onCancel={cancelExploreGroup} />
        )}
      </div>
    </>
  );
}
ExploreCreateGroupButton.propTypes = {};
function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(ExploreCreateGroupButton);
