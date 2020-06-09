import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { injectIntl } from 'react-intl';
import styles from './ExploreCreateGroup.scss';
import CreateGroup from './CreateGroup'; //創建群組
import LoadMore from '../LoadMore'; //查看更多
// import ExploreGroup from '../ExploreGroup'; //探索群組

const renderCreateORExploreGroup = (activePage) => {
  return (
    <>
      {
        {
          'Group.CreateGroup': <CreateGroup />,
          'Group.YouGroup': <LoadMore />,
          // 'Group.ExploreGroup': <ExploreGroup />,
        }[activePage]
      }
    </>
  );
};

function ExploreCreateGroup(props) {
  const {
    showExploreCreateGroup,
    dispatch,
    exploreCreateGroupTitle,
    intl,
  } = props;

  // 建立/探索 群組 title
  const title = intl.formatMessage({ id: exploreCreateGroupTitle });

  const hideModal = () => {
    dispatch({
      type: 'updatePersonalGroupInfo/hideExploreCreateGroupActive',
    });
  };
  return (
    <Modal
      className={styles.createpost}
      title={title}
      visible={showExploreCreateGroup}
      // visible={true}
      destroyOnClose={true}
      maskStyle={{
        WebkitBackdropFilter: 'blur(10px)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      }}
      confirmLoading={false}
      footer={null}
      onCancel={hideModal}
    >
      {renderCreateORExploreGroup(exploreCreateGroupTitle)}
    </Modal>
  );
}
ExploreCreateGroup.propTypes = {};
function mapStateToProps(state) {
  return {
    showExploreCreateGroup: state.updatePersonalGroupInfo.get(
      'showExploreCreateGroup'
    ),
    exploreCreateGroupTitle: state.updatePersonalGroupInfo.get(
      'exploreCreateGroupTitle'
    ),
  };
}
export default connect(mapStateToProps)(injectIntl(ExploreCreateGroup));
