import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { getGroupDetail } from '../../../models/groupInfo/selectors';

// import styles from './GroupAvatar.css';

class GroupAvatar extends React.PureComponent {
  static propTypes = {
    groupId: PropTypes.string.isRequired,
    disable: PropTypes.bool,
  };

  static defaultProps = {
    disable: false,
  };

  render() {
    const { groupId, dispatch, disable, group = {}, ...options } = this.props;
    const { avatarUrl: src, indexSymbol = '#' } = group;
    const symbol = (indexSymbol || '').toUpperCase();
    if (disable) {
      return (
        <Avatar {...options} src={src}>
          {symbol}
        </Avatar>
      );
    }
    return (
      <Link to={`/groups/${groupId}`}>
        <Avatar {...options} src={src}>
          {symbol}
        </Avatar>
      </Link>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { groupId } = ownProps;
  return {
    group: getGroupDetail(state, groupId),
  };
}

export default connect(mapStateToProps)(GroupAvatar);
