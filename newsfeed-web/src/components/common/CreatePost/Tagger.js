import React from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import styles from './CreatePost.scss';

function Tagger(props) {
  const { taggers, memberMap } = props;
  if (!taggers.length || !memberMap.size) {
    return null;
  }
  const firstMember = memberMap.get(taggers[0], { username: '' });
  const name = firstMember.username || '';
  return (
    <>
      {' - '}
      <FormattedMessage id="Post.And">{(text) => text}</FormattedMessage>
      <span className={styles.avatarName}>
        {name.length > 20 ? name.slice(0, 20) + '...' : name}
      </span>
      {taggers.length > 1 && (
        <>
          <FormattedMessage id="Post.And2">{(text) => text}</FormattedMessage>
          <span className={styles.avatarName}>
            <FormattedMessage
              id="Post.OtherPeople"
              values={{ count: taggers.length - 1 }}
            >
              {(text) => text}
            </FormattedMessage>
          </span>
        </>
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    memberMap: state.members.get('memberMap'),
  };
}

export default connect(mapStateToProps)(Tagger);
