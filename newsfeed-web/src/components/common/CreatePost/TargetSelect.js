import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import FormattedText from '../FormattedText';
import { sortGroupByIndexSymbol } from '../../../utils/sort';
// import { connect } from 'dva';
// import styles from './TargetSelect.css';
const { Option } = Select;

function TargetSelect(props) {
  const {
    groupId,
    typeDisabled,
    groups,
    groupPostType,
    checkedGroup,
    typeChange,
    groupPostTypeChange,
    postTypeDisabled,
    isPublicGroup,
    defaultValue,
    changePostType,
    targetSelectType,
  } = props;

  return (
    <>
      <Select
        value={groupId}
        style={{ width: 107 }}
        onChange={typeChange}
        disabled={typeDisabled}
      >
        {/*
         * 发帖：默认选项是 个人动态
         * 投票：默认选项是 群组
         */}
        <Option value={null}>
          {targetSelectType === 'vote' ? (
            <FormattedText id="Dialogue.groupDynamics" />
          ) : (
            <FormattedText id="Dialogue.personalDynamics" />
          )}
        </Option>
        {[...groups.values()].sort(sortGroupByIndexSymbol).map((group) => {
          return (
            <Option key={group.groupId} value={group.groupId}>
              {group.name}
            </Option>
          );
        })}
      </Select>
      {/*
       * 新增样式：
       * 个人身份和管理员身份选项 disabled 如果只有 没有管理员身份则不能下拉选择并且置灰
       */}
      {groupId && (
        <Select
          value={groupPostType === null ? 1 : groupPostType}
          style={{ width: 107 }}
          onChange={groupPostTypeChange}
          disabled={
            (checkedGroup && !checkedGroup.postByAdmin) || postTypeDisabled
          }
        >
          {/*
           * 发布 post 和 vote 时，接口的参数区分 个人身份 还是 管理员身份发送
           * 所以这里的 个人身份 和 管理员身份 的下拉选项 value 有此判断
           */}
          <Option value={targetSelectType === 'vote' ? 0 : 1}>
            <FormattedText id="Dialogue.personalIdentity" />
          </Option>
          {((checkedGroup && checkedGroup.postByAdmin) || postTypeDisabled) && (
            <Option value={targetSelectType === 'vote' ? 1 : 0}>
              <FormattedText id="Dialogue.adminIdentity" />
            </Option>
          )}
        </Select>
      )}
      {groupId && (
        <Select
          style={{ width: 107 }}
          onChange={changePostType}
          value={defaultValue}
          disabled={!isPublicGroup}
        >
          {!!isPublicGroup && <Option value="public">公開貼文</Option>}
          <Option value="private">私密貼文</Option>
        </Select>
      )}
    </>
  );
}

TargetSelect.propTypes = {
  groupId: PropTypes.string,
  typeDisabled: PropTypes.bool,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      postByAdmin: PropTypes.bool.isRequired,
      groupId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  groupPostType: PropTypes.oneOf([null, 0, 1]),
  checkedGroup: PropTypes.shape({
    postByAdmin: PropTypes.bool.isRequired,
    groupId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default TargetSelect;
