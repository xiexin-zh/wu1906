import { fromJS, Record, List } from 'immutable';
import Base from './Base';
import invariant from 'invariant';
import { getUrl } from '../../utils/utils';
// import ChannelPreference from './ChannelPreference';
// import ChannelAnnouncement from './ChannelAnnouncement';

window.Record = Record;

const fieldMap = {
  avatar_url: 'avatarUrl',
  index_symbol: 'indexSymbol',
  member_count: 'memberCount',
  star_id: 'starId',
  team_id: 'teamId',
  vchannel_id: 'vchannelId',
  media_count: 'mediaCount',
  link_count: 'linkCount',
  file_count: 'fileCount',
  mention_count: 'mentionCount',
  star_count: 'starCount',
  is_member: 'isMember',
  is_channel: 'isChannel',
};

export const ChannelMember = Record({
  uid: null,
  role: null,
});

export class Channel extends Base(
  Record({
    avatarUrl: '',
    created: null,
    description: null,
    general: null,
    id: null,
    inactive: null,
    indexSymbol: '#',
    leavable: null,
    memberCount: 0,
    mode: 'admin_on',
    name: null,
    pinyin: [],
    pinyins: '',
    private: null,
    role: 'admin',
    starId: null,
    teamId: null,
    topic: null,
    uid: null,
    updated: null,
    members: List([]),
    vchannelId: null,
    mediaCount: 0,
    linkCount: 0,
    fileCount: 0,
    mentionCount: 0,
    starCount: 0,
    isMember: false,
    joined: false,
    announcement: null,
    isChannel: true,
  })
) {
  static fromJS(values = {}) {
    const members = values.members || [];
    values.members = List(members.map((member) => ChannelMember(member)));
    Object.entries(fieldMap).forEach(([oldFiled, newFiled]) => {
      if (values[oldFiled]) {
        values[newFiled] = values[oldFiled];
      }
    });
    if (!values.indexSymbol) {
      values.indexSymbol = '#';
    }
    values.avatarUrl = getUrl(values.avatarUrl);

    return fromJS(values);
  }

  constructor(values) {
    invariant(values.id, 'id is required');
    super(Channel.fromJS(values));
  }

  getName() {
    return this.get('name');
  }

  getSearchIndexes() {
    return [this.get('name').toLowerCase()];
  }

  get groupName() {
    return this.get('name') || '';
  }
}
