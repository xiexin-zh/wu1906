import { Record } from 'immutable';
import invariant from 'invariant';

import Base from './Base';
import { toString } from './utils';
import { getUrl } from '../../utils/utils';

const string_fields = [
  'team_id',
  'first_name',
  'last_name',
  'name',
  'full_name',
  'given_name',
  'title',
  'nickname',
  'avatar_url',
];

const fieldMap = {
  avatar_url: 'avatarUrl',
  index_symbol: 'indexSymbol',
  full_name: 'fullName',
  given_name: 'givenName',
};

export class Member extends Base(
  Record({
    id: null,
    vchannel_id: null,
    avatar_url: '',
    index_symbol: null,
    inactive: false,
    hidden: false,
    region: null,
    office: null,
    employee_id: null,
    email: null,

    role: null,
    mobile: null,
    description: null,
    object_guid: null,
    department: null,
    pinyins: null,
    pinyin: null,

    company: null,
    type: null,
    team_id: '',
    first_name: '',
    last_name: '',
    name: '',
    full_name: '',
    given_name: '',
    title: '',

    // newsfeed
    avatarUrl: '',
    indexSymbol: '',
    fullName: '',
    givenName: '',
    // newsfeed

    // 以下為通訊錄 members 中沒有的數據，需要從其他接口獲取
    nickname: '',
    star_count: 0,
    departmental_staff_count: 0,
    departmental_staff: [],
    mutual_channel_count: 0,
    mutual_channels: [],
    file_count: 0,
    link_count: 0,
    media_count: 0,
  })
) {
  static fromJS(values = {}) {
    values = { ...values };
    // invariant(values.name, 'name is required');
    string_fields.forEach((field) => {
      values[field] = toString(values[field]);
    });

    Object.entries(fieldMap).forEach(([oldFiled, newFiled]) => {
      if (values[oldFiled]) {
        values[newFiled] = values[oldFiled];
      }
    });

    if (!values.indexSymbol) {
      values.indexSymbol = '#';
    }
    // 保存頭像時做需要的轉換，避免使用時多次轉換
    values.avatarUrl = getUrl(values.avatarUrl);

    return values;
  }

  constructor(values) {
    invariant(values.id, 'id is required');
    invariant(values.vchannel_id, 'vchannel_id is required');
    super(Member.fromJS(values));
  }

  getSearchIndexes() {
    return [
      this.get('name').toLowerCase(),
      this.get('nickname').toLowerCase(),
      this.get('given_name').toLowerCase(),
      this.get('full_name').toLowerCase(),
      this.get('title').toLowerCase(),
    ];
  }

  getName() {
    return (
      this.get('name') ||
      this.get('nickname') ||
      this.get('given_name') ||
      this.get('full_name')
    );
  }

  get username() {
    return (
      this.get('nickname') ||
      this.get('given_name') ||
      this.get('full_name') ||
      this.get('name') ||
      ''
    );
  }
}
