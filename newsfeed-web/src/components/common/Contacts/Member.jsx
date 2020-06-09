import React, { useRef } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'dva';
import { withRouter } from 'dva/router';

import styles from './index.css';
import Checkbox from '../Checkbox';
import FollowBtn from './FollowBtn';
import InviteButton from './InviteButton';
import UserAvatar from '../UserAvatar';
import classnames from 'classnames';
/**
 *
 * @param {object} props
 * @param {string} props.type
 * @param {string} props.name 核取方塊錶單名
 * @param {string} props.id 核取方塊錶value值
 * @param {boolean} props.checked
 * @param {number} props.avatarSize
 * @param {number} props.itemHeight 整個組件高度
 * @param {Function} props.onChange checkbok handle
 * @param {boolean} props.followed 是否追蹤對方
 */
function Member(props) {
  const {
    checkbox_name,
    id,
    checked,
    onChange,
    avatarSize,
    itemHeight,

    member: { username, full_name, title },
    followed,
    inviting,
    groupId,
    buttonClassName,
    history,
    memberType,
  } = props;

  const refDom = useRef(null);
  // 标注人名 点击行 选中
  const lineSelected = () => {
    if (!refDom.current || !refDom.current.click) {
      return false;
    }
    refDom.current.click();
  };
  // 搜索 点击行跳转
  const lineJump = () => {
    history.push(`/user/${id}`);
  };
  return (
    <div className={styles.groups} style={{ height: `${itemHeight}px` }}>
      {!!onChange && (
        <span className={styles.checkboxWrapper}>
          <Checkbox
            name={checkbox_name}
            checked={checked}
            onChange={onChange}
            value={id}
            refDom={refDom}
          />
        </span>
      )}
      <div className={styles.avatar}>
        <UserAvatar size={avatarSize} userId={id} />
      </div>

      <div
        className={classnames({
          [styles.memberInfo]: true && memberType !== 'group',
          [styles.groupStyle]: memberType === 'group',
        })}
        onClick={!onChange ? lineJump : lineSelected}
      >
        <span className={styles.nickname}>
          {username.length >= 20 ? username.substring(0, 20) + '...' : username}
        </span>
        <span className={styles.nameAndPosition}>
          {full_name && <span>{full_name}</span>}
          {title && <span>{title}</span>}
        </span>
        {followed !== null && (
          <FollowBtn
            type="user"
            buttonClassName={buttonClassName}
            followed={followed}
            name={username}
            userId={id}
          />
        )}
        {// FIXME: del
        inviting !== null && (
          <InviteButton
            inviting={inviting}
            name={username}
            groupId={groupId}
            userId={id}
          />
        )}
      </div>
    </div>
  );
}
Member.defaultProps = {
  member: {
    index_symbol: '#',
  },
  checkbox_name: 'member',
  id: '',
  checked: false,
  onChange: null,
  itemHeight: 50,
  avatarSize: 30,
  followed: null,
  inviting: null,
};
Member.propTypes = {
  avatarSize: PropTypes.number,
  member: PropTypes.shape({
    username: PropTypes.string,
    avatar_url: PropTypes.string,
    index_symbol: PropTypes.string,
  }),
  itemHeight: PropTypes.number,
  id: PropTypes.string.isRequired,
  checkbox_name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  followed: PropTypes.bool,
  inviting: PropTypes.bool,
};

export default withRouter(Member);
